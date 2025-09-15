import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { signInAnon, signInWithGoogle, auth } from "../firebase";
import { signOut } from "firebase/auth";

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
             {/* Logo and brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-2xl">🎯</div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                Hot Takes Arena
              </h1>
            </Link>

               {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                className={`font-sans font-medium transition-colors ${
                  isActive("/")
                    ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/leaderboard"
                className={`font-sans font-medium transition-colors ${
                  isActive("/leaderboard")
                    ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Leaderboard
              </Link>
            </nav>

            {/* User section */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <span>Loading…</span>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="font-sans text-sm text-gray-700 font-bold w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.displayName?.[0]?.toUpperCase() ?? "A"}
                    </div>
                  )}
                  <button
                    onClick={() => signOut(auth)}
                    className="px-3 py-1 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={signInWithGoogle}
                    className="px-3 py-1 rounded-md"
                  >
                    Sign in with Google
                  </button>
                  <button
                    onClick={signInAnon}
                    className="px-3 py-1 rounded-md"
                    title="Continue as guest"
                  >
                    Guest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      <footer className="w-full border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">Hot Takes Arena</h3>
            <p className="font-sans text-sm text-gray-500">Where bold opinions spark meaningful conversations</p>
          </div>
        </div>
      </footer>
    </div>
  );
}