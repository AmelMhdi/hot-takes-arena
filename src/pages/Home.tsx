import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addHotTake, subscribeToTakes, auth, signInAnon } from "../firebase";
import type { HotTake } from "../types";
import { useAuth } from "../auth/AuthContext";
import PostTakeModal from "../components/PostTakeModal";

export default function Home() {
  const { user } = useAuth();
  const [takes, setTakes] = useState<HotTake[]>([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsub = subscribeToTakes(setTakes);
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Ensure at least anonymous auth for write rules
    if (!auth.currentUser) {
      await signInAnon();
    }

    await addHotTake({
      text: trimmed,
      author: auth.currentUser?.displayName ?? "Anonymous",
    });

    setText("");
    setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2 text-balance">🔥 Latest Hot Takes</h1>
          <p className="font-sans text-lg text-gray-600">Share your boldest opinions and spark meaningful debates</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Post Hot Take
        </button>
      </div>

      <div className="grid gap-6">
        {takes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤔</div>
             <h3 className="font-serif text-2xl font-semibold text-gray-700 mb-2">No takes yet</h3>
            <p className="font-sans text-gray-500">
              Be the first to share a hot take and get the conversation started!
            </p>
          </div>
        ) : (
          takes.map((t) => (
            <Link
              to={`/take/${t.id}`}
              key={t.id}
              className="group bg-white p-6 rounded-2xl shadow-card hover:shadow-card-hover border border-gray-100 transition-all duration-300 hover:border-amber-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                   <p className="font-sans text-lg leading-relaxed text-gray-800 mb-3 text-balance">{t.text}</p>
                   <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="font-medium">by {t.author ?? "Anonymous"}</span>
                    <span>•</span>
                    <span>{new Date(t.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                 <div className="ml-4 flex flex-col items-center space-y-2">
                  <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    {/* WIP : to dynamise */}
                    🔥 23
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
                    Click to debate
                  </div>
                </div>

              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>Join debate</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>👥</span>
                    <span>Community</span>
                  </span>
                </div>
                <div className="text-amber-600 group-hover:text-amber-700 transition-colors">→</div>
              </div>
            </Link>
          ))
        )}
      </div>

      <PostTakeModal
        open={open}
        text={text}
        setText={setText}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}