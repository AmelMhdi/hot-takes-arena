import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addHotTake, subscribeToTakes, auth, signInAnon } from "../firebase";
import type { HotTake } from "../types";
// import { useAuth } from "../auth/AuthContext";
import PostTakeModal from "../components/PostTakeModal";

export default function Home() {
  // const { user } = useAuth();
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
    if (!user) {
      await signInAnon();
    }

    console.log("Submitting hot take as:", user);

    await addHotTake({
      text: trimmed,
      author: user?.displayName ?? "Anonymous",
    });

    console.log("Hot take submitted with text:", trimmed);

    setText("");
    setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mb-2 text-balance">
            Latest Hot Takes
          </h1>
          <p className="font-sans text-lg text-sage-600">
            Share your boldest opinions and spark meaningful debates
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-sage-600 hover:bg-sage-700 text-cream-50 font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Post Hot Take
        </button>
      </div>

      {/* Takes list */}
      <div className="grid gap-6">
        {takes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="font-serif text-2xl font-semibold text-sage-700 mb-2">
              No takes yet
            </h3>
            <p className="font-sans text-stone-600">
              Be the first to share a hot take and get the conversation started!
            </p>
          </div>
        ) : (
          takes.map((t) => (
            <Link
              to={`/take/${t.id}`}
              key={t.id}
              className="group bg-cream-100 p-6 rounded-2xl shadow-md hover:shadow-lg border border-stone-200 transition-all duration-300 hover:border-sage-400"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="font-sans text-lg leading-relaxed text-charcoal-800 mb-3 text-balance">
                    {t.text}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-stone-600">
                    <span className="font-medium">
                      by {t.author ?? "Anonymous"}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(t.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Vote count + hover */}
                <div className="ml-4 flex flex-col items-center space-y-2">
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-peach-200 text-peach-800">
                    {t.debatesCount} debate{t.debatesCount !== 1 || t.debatesCount > 0 && "s"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <div className="flex items-center space-x-4 text-sm text-stone-600">
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>Join debate</span>
                  </span>
                </div>
                <div className="text-sage-600 group-hover:text-charcoal-800 transition-colors">
                  →
                </div>
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
