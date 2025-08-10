import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithPopup 
} from "firebase/auth";
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import type { HotTake } from "./types";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAkqAguGpDYW-b86OySpzuR5gnicdD40TA",
  authDomain: "hot-takes-arena.firebaseapp.com",
  projectId: "hot-takes-arena",
  storageBucket: "hot-takes-arena.firebasestorage.app",
  messagingSenderId: "1043167162375",
  appId: "1:1043167162375:web:987da1c1ffe88d60e77aa2",
  measurementId: "G-5Y667H1X0C"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Sign-in functions
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signInAnon = () => signInAnonymously(auth);

// export const signInWithGoogle = async (): Promise<UserCredential> => {
//   return signInWithPopup(auth, provider);
// };

// export const signInAnon = async (): Promise<UserCredential> => {
//   return signInAnonymously(auth);
// };

// Reference to Firestore collections
export const takesCollection = collection(db, "hot_takes");

// Add a hot take
export const addHotTake = async (take: Omit<HotTake, "id" | "timestamp">) => {
  return addDoc(takesCollection, {
    ...take,
    timestamp: Date.now(),
  });
};

// Subscribe to hot takes
export const subscribeToTakes = (callback: (takes: HotTake[]) => void) => {
  const q = query(takesCollection, orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const takes: HotTake[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as HotTake
    }));
    callback(takes);
  });
};