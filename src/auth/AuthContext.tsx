import { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

type AuthCtx = { user: User | null; loading: boolean };

const AuthContext = createContext<AuthCtx>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const off = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        await setDoc(
          doc(db, "users", u.uid),
          {
            displayName: u.displayName ?? "Anonymous",
            photoURL: u.photoURL ?? "",
          },
          { merge: true }
        );
      }
      setLoading(false);
    });
    return () => off();
  }, []);

  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.error("Redirect sign-in error:", err);
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);