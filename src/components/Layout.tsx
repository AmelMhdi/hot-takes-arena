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
    <div className="min-h-screen bg-cream-50 text-charcoal-800 flex flex-col">
      <header className="bg-cream-100 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <h1 className="font-serif text-2xl font-bold text-charcoal-900 group-hover:text-sage-700 transition-colors">
                Hot Takes Arena
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                className={`font-sans font-medium transition-colors ${
                  isActive("/")
                    ? "text-sage-700 border-b-2 border-sage-600 pb-1"
                    : "text-charcoal-700 hover:text-charcoal-600"
                }`}
              >
                Home
              </Link>
              <Link
                to="/leaderboard"
                className={`font-sans font-medium transition-colors ${
                  isActive("/leaderboard")
                    ? "text-sage-700 border-b-2 border-sage-600 pb-1"
                    : "text-charcoal-700 hover:text-sage-600"
                }`}
              >
                Leaderboard
              </Link>
            </nav>

            {/* User section */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <span 
                  className="font-serif text-charcoal-600 animate-pulse"
                >Loading…</span>
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
                    <div className="bg-sage-200 text-charcoal-800 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                      {user.displayName?.[0]?.toUpperCase() ?? "A"}
                    </div>
                  )}
                  <button
                    onClick={() => signOut(auth)}
                    className="bg-stone-200 hover:bg-stone-300 text-charcoal-700 hover:text-charcoal-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={signInWithGoogle}
                    className="bg-sage-600 hover:bg-sage-700 text-cream-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign in with Google
                  </button>
                  <button
                    onClick={signInAnon}
                    className="bg-stone-200 hover:bg-stone-300 text-charcoal-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
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

      {/* Footer */}
      <footer className="bg-cream-100 border-t border-stone-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 mb-2">Hot Takes Arena</h3>
            <p className="font-sans text-sm text-stone-600">Where bold opinions spark meaningful conversations</p>
          </div>
        </div>
      </footer>
    </div>
  );
}