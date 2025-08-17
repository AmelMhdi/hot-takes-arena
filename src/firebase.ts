import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, type DocumentData } from "firebase/firestore";
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