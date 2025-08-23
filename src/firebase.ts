import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { addDoc, arrayUnion, collection, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, updateDoc, getDoc, type DocumentData, increment, setDoc } from "firebase/firestore";
import type { HotTake } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyAkqAguGpDYW-b86OySpzuR5gnicdD40TA",
  authDomain: "hot-takes-arena.firebaseapp.com",
  projectId: "hot-takes-arena",
  storageBucket: "hot-takes-arena.appspot.com",
  messagingSenderId: "1043167162375",
  appId: "1:1043167162375:web:987da1c1ffe88d60e77aa2",
  measurementId: "G-5Y667H1X0C"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Sign-in functions
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signInAnon = () => signInAnonymously(auth);
export const signOut = () => fbSignOut(auth);

// --- Hot takes collection ---
export const takesCollection = collection(db, "hot_takes");

export const addHotTake = async (take: Omit<HotTake, "id" | "timestamp">) => {
  return addDoc(takesCollection, {
    ...take,
    timestamp: Date.now(),
  });
};

export const subscribeToTakes = (callback: (takes: HotTake[]) => void) => {
  const q = query(takesCollection, orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const list: HotTake[] = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        text: data.text ?? "",
        authorId: data.authorId ?? "",
        authorName: data.authorName ?? "Anonymous",
        timestamp: typeof data.timestamp === "number" ? data.timestamp : 0,
      };
    });
    callback(list);
  });
};

// --- Debates ---
export const debatesCollection = collection(db, "debates");

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
  callback: (debates: any[]) => void
) => {
  const q = query(debatesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const debates = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as { takeId: string }) }))
      .filter((debate) => debate.takeId === takeId);
    callback(debates);
  });
};

// --- Upvotes ---
export const upvoteMessage = async (
  debateId: string,
  messageIndex: number,
  voterUid: string
) => {
  const ref = doc(db, "debates", debateId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as DebateDoc;
  if (data.active) return; // ✅ only after debate ends

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

export const computeWinnerUid = (debate: DebateDoc): string | null => {
  if (!debate.challengerId || !debate.opponentId) return null;

  let challengerVotes = 0;
  let opponentVotes = 0;

  for (const msg of debate.messages || []) {
    const votes = (msg.upvotes || []).length;
    if (msg.uid === debate.challengerId) challengerVotes += votes;
    else if (msg.uid === debate.opponentId) opponentVotes += votes;
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

// --- User stats ---
export const incrementUserWin = async (
  uid: string,
  displayName: string | null
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      displayName: displayName ?? "Anonymous",
      wins: increment(1),
      losses: increment(0),
    },
    { merge: true }
  );
};

export const incrementUserLoss = async (
  uid: string,
  displayName: string | null
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      displayName: displayName ?? "Anonymous",
      wins: increment(0),
      losses: increment(1),
    },
    { merge: true }
  );
};