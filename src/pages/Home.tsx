import { useEffect, useState } from "react";
import { addHotTake, auth, signInAnon, signInWithGoogle, subscribeToTakes } from "../firebase";
import type { HotTake } from "../types";

export default function Home() {
    const [takes, setTakes] = useState<HotTake[]>([]);
    const [newTake, setNewTake] = useState("");

    // Listen for hot takes in real-time
    useEffect(() => {
        const unsub = subscribeToTakes(setTakes);
        return () => unsub();
    }, []);

    // Handle posting
    const handlePost = async () => {
        if (!newTake.trim()) return;

        const user = auth.currentUser;
        if (!user) {
            await signInAnon(); // fallback to anonymous sign-in
        }
        await addHotTake({
            text: newTake,
            authorId: auth.currentUser?.uid || "anon",
            authorName: auth.currentUser?.displayName || "Anonymous",
        });
        setNewTake("");
    }

    return (
        <div className="p-4 text-white bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Hot Takes Arena</h1>

            {/* Sign-in buttons */}
            {!auth.currentUser && (
                <div className="flex gap-2 mb-4">
                    <button className="bg-blue-500 px-3 py-1 rounded" onClick={signInWithGoogle}>
                        Sign in with Google
                    </button>
                    <button className="bg-gray-500 px-3 py-1 rounded" onClick={signInAnon}>
                        Sign in Anonymously
                    </button>
                </div>
            )}

            {/* Post form */}
            <div className="mb-4 flex gap-2">
                <input 
                    type="text"
                    placeholder="Your hot take..."
                    value={newTake}
                    onChange={(e) => setNewTake(e.target.value)}
                />
                <button className="bg-red-500 px-4 py-2 rounded" onClick={handlePost}>
                    Post
                </button>
            </div>

            {/* Takes list */}
            <div className="space-y-3">
                {takes.map(take => (
                    <div key={take.id} className="bg-gray-800 p-3 rounded">
                        <p className="text-lg">{take.text}</p>
                        <p className="text-sm text-gray-400">
                            by {take.authorName}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}