import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { signInAnon, signInWithGoogle, signOut } from "../firebase";

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        🎯 Hot Takes Arena
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-yellow-400">Home</Link>
        <Link to="/leaderboard" className="hover:text-yellow-400">Leaderboard</Link>

        {loading ? (
          <span className="text-gray-400">Loading…</span>
        ) : user ? (
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black grid place-items-center font-bold">
                {user.displayName?.[0]?.toUpperCase() ?? "A"}
              </div>
            )}
            <span className="hidden sm:block text-sm text-gray-300">
              {user.displayName ?? "Anonymous"}
            </span>
            <button
              onClick={signOut}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded-md"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={signInWithGoogle}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded-md"
            >
              Sign in with Google
            </button>
            <button
              onClick={signInAnon}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
              title="Continue as guest"
            >
              Guest
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}