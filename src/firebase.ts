import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { addDoc, arrayUnion, collection, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, updateDoc, type DocumentData } from "firebase/firestore";
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

// Firestore takes collection
export const takesCollection = collection(db, "hot_takes");

export const addHotTake = async (take: Omit<HotTake, "id" | "timestamp">) => {
  return addDoc(takesCollection, {
    ...take,
    timestamp: Date.now(),
  });
};

// Subscribe to takes collection
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

// Reference to debates collection
export const debatesCollection = collection(db, "debates");

// Create a new debate
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

// Join a debate
export const joinDebate = async (debateId: string, opponentId: string) => {
  const debateRef = doc(db, "debates", debateId);
  return updateDoc(debateRef, { opponentId });
};

// Send a message in a debate
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

// Subscribe to debates for a specific take
export const subscribeToDebates = (
  takeId: string,
  callback: (debates: any[]) => void
) => {
  const q = query(debatesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const debates = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((debate) => debate.takeId === takeId);
    callback(debates);
  });
};