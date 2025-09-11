import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { 
  addDoc, 
  arrayUnion, 
  collection, 
  doc, 
  getFirestore, 
  onSnapshot, 
  orderBy, 
  query, 
  serverTimestamp, 
  updateDoc, 
  getDoc, 
  increment, 
  setDoc, 
  getDocs, 
  limit 
} from "firebase/firestore";
import type { DebateDoc, HotTake, UserStats } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyAkqAguGpDYW-b86OySpzuR5gnicdD40TA",
  authDomain: "hot-takes-arena.firebaseapp.com",
  projectId: "hot-takes-arena",
  storageBucket: "hot-takes-arena.appspot.com",
  messagingSenderId: "1043167162375",
  appId: "1:1043167162375:web:987da1c1ffe88d60e77aa2",
  measurementId: "G-5Y667H1X0C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// ------------------
// Auth
// ------------------
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signInAnon = () => signInAnonymously(auth);
export const signOut = () => fbSignOut(auth);

// ------------------
// Firestore references
// ------------------
export const takesCollection = collection(db, "hot_takes");
export const usersCollection = collection(db, "users");
export const debatesCollection = collection(db, "debates");

// ------------------
// Hot Takes
// ------------------
export const addHotTake = async (take: Omit<HotTake, "id" | "timestamp" | "votes">) => {
  return addDoc(takesCollection, {
    ...take,
    timestamp: Date.now(),
    votes: 0,
  });
};

export const subscribeToTakes = (callback: (takes: HotTake[]) => void) => {
  const q = query(takesCollection, orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const takes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as HotTake[];
    callback(takes);
  });
};

// ------------------
// User Stats
// ------------------

// Ensure a user document exists before update
const ensureUserDoc = async (uid: string, displayName: string | null) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid,
      displayName: displayName ?? "Anonymous",
      wins: 0,
      losses: 0,
      upvotes: 0,
    });
  }
  return userRef;
};

// Increment wins
export const incrementWin = async (uid: string, displayName: string | null) => {
  const userRef = await ensureUserDoc(uid, displayName);
  await updateDoc(userRef, { wins: increment(1) });
};

// Increment losses
export const incrementLoss = async (uid: string, displayName: string | null) => {
  const userRef = await ensureUserDoc(uid, displayName);
  await updateDoc(userRef, { losses: increment(1) });
};

// Increment upvotes
export const incrementUpvotes = async (uid: string, displayName: string | null) => {
  const userRef = await ensureUserDoc(uid, displayName);
  await updateDoc(userRef, { upvotes: increment(1) });
};

// Get top users by wins
export const getTopUsers = async (): Promise<UserStats[]> => {
  const q = query(usersCollection, orderBy("wins", "desc"), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        uid: doc.id,
        ...doc.data(),
      } as UserStats)
  );
};

// ------------------
// Debates
// ------------------
export const createDebate = async (takeId: string, challengerId: string) => {
  return addDoc(debatesCollection, {
    takeId,
    challengerId,
    opponentId: null,
    messages: [],
    active: true,
    createdAt: serverTimestamp(),
  });
};

export const joinDebate = async (debateId: string, opponentId: string) => {
  const debateRef = doc(db, "debates", debateId);
  return updateDoc(debateRef, { opponentId });
};

export const sendDebateMessage = async (
  debateId: string,
  uid: string,
  text: string,
  turn: number
) => {
  const debateRef = doc(db, "debates", debateId);
  return updateDoc(debateRef, {
    messages: arrayUnion({
      uid,
      text,
      timestamp: Date.now(),
      turn,
      upvotes: []
    }),
  });
};

export const subscribeToDebates = (
  takeId: string,
  callback: (debates: DebateDoc[]) => void
) => {
  const q = query(debatesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const debates = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as DebateDoc) }))
      .filter((debate) => debate.takeId === takeId);
    callback(debates);
  });
};

// ------------------
// Upvotes
// ------------------
export const upvoteMessage = async (
  debateId: string,
  messageIndex: number,
  voterUid: string
) => {
  const ref = doc(db, "debates", debateId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as DebateDoc;
  if (data.active) return; // only after debate ends

  const messages = Array.isArray(data.messages) ? [...data.messages] : [];
  const msg = messages[messageIndex];
  if (!msg) return;

  if ((msg.upvotes || []).includes(voterUid)) return; // already voted

  messages[messageIndex] = {
    ...msg,
    upvotes: [...(msg.upvotes || []), voterUid],
  };

  await updateDoc(ref, { messages });
};

// ------------------
// Debate Results
// ------------------
export const computeWinnerUid = (debate: DebateDoc): string | null => {
  if (!debate.challengerId || !debate.opponentId) return null;

  let challengerVotes = 0;
  let opponentVotes = 0;

  for (const msg of debate.messages || []) {
    const votes = (msg.upvotes || []).length;
    if (msg.userId === debate.challengerId) challengerVotes += votes;
    else if (msg.userId === debate.opponentId) opponentVotes += votes;
  }

  if (challengerVotes > opponentVotes) return debate.challengerId;
  if (opponentVotes > challengerVotes) return debate.opponentId;
  return null; // tie
};

export const endDebateAndSetWinner = async (debateId: string) => {
  const ref = doc(db, "debates", debateId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as DebateDoc;
  const winnerId = computeWinnerUid(data);

  await updateDoc(ref, {
    active: false,
    winnerId: winnerId ?? null,
  });

  return winnerId;
};
