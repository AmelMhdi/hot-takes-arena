import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold tracking-wide">
                Hot Takes Arena
            </Link>

            {/* Navigation links */}
            <div className="flex items-center space-x-6">
                <Link to="/" className="hover:text-yellow-400">Home
                </Link>
                <Link to="/leaderboard" className="hover:text-yellow-400">Leaderboard
                </Link>
                {/* Placeholder sign-in button */}
                <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-md">
                    Sign In
                </button>
            </div>
        </nav>
    );
}