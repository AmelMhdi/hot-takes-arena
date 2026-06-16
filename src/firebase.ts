import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithPopup,
  signInWithRedirect,
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
  type DocumentData, 
  increment, 
  setDoc 
} from "firebase/firestore";
import type { DebateDoc, HotTake } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Init Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Sign-in functions
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const signInWithGoogle = async () => {
  const provider = new  GoogleAuthProvider();
  if (isMobile()) {
    await signInWithRedirect(auth, provider);
  } else {
    await signInWithPopup(auth, provider);
  }
};

// export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signInAnon = () => signInAnonymously(auth);
// export const signOut = () => fbSignOut(auth);

// --- Hot takes collection ---
export const takesCollection = collection(db, "hot_takes");

export const addHotTake = async (take: Omit<HotTake, "id" | "timestamp" | "debatesCount" | "likes" | "dislikes" | "counter">) => {
  return addDoc(takesCollection, {
    ...take,
    debatesCount: 0,
    timestamp: Date.now(),
    likes: [],
    dislikes: [],
    counter: 0,
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
        authorId: data.authorId ?? null,
        authorName: data.authorName ?? "Anonymous",
        debatesCount: data.debatesCount ?? 0,
        timestamp: typeof data.timestamp === "number" ? data.timestamp : 0,
        likes: Array.isArray(data.likes) ? data.likes : [],
        dislikes: Array.isArray(data.dislikes) ? data.dislikes : [],
        counter: typeof data.counter === "number" ? data.counter : 0,
      };
    });
    callback(list);
  });
};

export const voteTake = async (takeId: string, uid: string, type: "like" | "dislike") => {
  const takeRef = doc(db, "hot_takes", takeId);
  const snap = await getDoc(takeRef);
  
  if (!snap.exists()) return;

  const data = snap.data() as DocumentData;

  let likes = data.likes || [];
  let dislikes = data.dislikes || [];

  // remove existing votes
  likes = likes.filter((id: string) => id !== uid);
  dislikes = dislikes.filter((id: string) => id !== uid);

  // add a new vote
  if (type === "like") likes.push(uid);
  else dislikes.push(uid);

  await updateDoc(takeRef, {
    likes,
    dislikes,
    counter: likes.length - dislikes.length,
  });
}

// --- Debates ---
export const debatesCollection = collection(db, "debates");

export const createDebate = async (takeId: string, challengerId: string) => {
  await addDoc(debatesCollection, {
    takeId,
    challengerId,
    opponentId: null,
    messages: [],
    active: true,
    createdAt: serverTimestamp(),
  });
  
  const takeRef = doc(db, "hot_takes", takeId);

  await updateDoc(takeRef, {
    debatesCount: increment(1),
  });
};

export const joinDebate = async (debateId: string, opponentId: string) => {
  if (!opponentId) return;
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

export const subscribeToDebate = (
  debateId: string,
  callback: (debate: DebateDoc | null) => void
) => {
  const ref = doc(db, "debates", debateId);
  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    const data = snap.data() as any;
    const debate: DebateDoc = {
      id: snap.id,
      takeId: data.takeId,
      challengerId: data.challengerId,
      opponentId: data.opponentId,
      messages: Array.isArray(data.messages) ? data.messages : [],
      active: data.active,
      winnerId: data.winnerId ?? null,
      createdAt: data.createdAt,
    };
    callback(debate);
  });
  return unsub;
}

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

  // Update user stats
  if (winnerId) {
    if (winnerId === data.challengerId) {
      await incrementUserWin(data.challengerId, "Challenger");
      if (data.opponentId) {
        await incrementUserLoss(data.opponentId, "Opponent");
      }
    } else {
      await incrementUserWin(data.opponentId!, "Opponent");
      await incrementUserLoss(data.challengerId, "Challenger");
    }
  }

  return winnerId;
};

// --- User stats ---
export const incrementUserWin = async (
  uid: string,
  displayName: string | null,
  photoURL?: string | null
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      displayName: displayName ?? "Anonymous",
      photoURL: photoURL ?? null,
      wins: increment(1),
      losses: increment(0),
    },
    { merge: true }
  );
};

export const incrementUserLoss = async (
  uid: string,
  displayName: string | null,
  photoURL?: string | null
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      displayName: displayName ?? "Anonymous",
      photoURL: photoURL ?? null,
      wins: increment(0),
      losses: increment(1),
    },
    { merge: true }
  );
};

/**
 * Ensure a user document exists and merge basic profile fields.
 * Call this when the user signs in.
 */
export const ensureUserProfile = async (
  uid: string,
  displayName: string | null,
  photoUrl?: string | null
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      uid,
      displayName: displayName ?? "Anonymous",
      photoUrl: photoUrl ?? null,
      wins: increment(0),
      losses: increment(0),
    },
    { merge: true }
  );
  return userRef;
};