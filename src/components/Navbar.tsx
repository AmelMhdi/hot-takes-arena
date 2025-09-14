import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { signInAnon, signInWithGoogle, signOut } from "../firebase";
import { Home, LogOut, Trophy, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-card/95 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-serif font-bold text-foreground hover:text-primary transition-colors">
              Hot Takes Arena
            </h1>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link to="/leaderboard">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Link>
            </Button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Post Hot Take Button - Only show when authenticated */}
            {user && (
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium hidden sm:flex">
                Post Hot Take
              </Button>
            )}

            {/* Auth Section */}
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : user ? (
              // Authenticated User
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {user.photoURL ? (
                    <AvatarImage 
                      src={user.photoURL} 
                      alt={user.displayName || "User avatar"}
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                    {user.displayName?.[0]?.toUpperCase() || 
                     user.email?.[0]?.toUpperCase() || 
                     "A"}
                  </AvatarFallback>
                </Avatar>
                
                <span className="hidden sm:inline text-sm text-muted-foreground max-w-24 truncate">
                  {user.displayName || "Anonymous"}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground gap-2"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Sign Out</span>
                </Button>
              </div>
            ) : (
              // Not Authenticated
              <div className="flex items-center gap-2">
                <Button
                  onClick={signInWithGoogle}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  Sign in with Google
                </Button>
                <Button
                  onClick={signInAnon}
                  variant="secondary"
                  size="sm"
                  title="Continue as guest"
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Guest</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center justify-center gap-4 pt-3 border-t border-border/50 mt-3">
          <Button variant="ghost" size="sm" className="gap-2 flex-1" asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 flex-1" asChild>
            <Link to="/leaderboard">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
          </Button>
          {user && (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex-1" size="sm">
              Post Take
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}