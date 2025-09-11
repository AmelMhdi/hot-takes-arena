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

    // Ensure anonymous auth for write rules
    if (!auth.currentUser) {
      await signInAnon();
    }

    await addHotTake({
      text: trimmed,
      authorId: auth.currentUser?.uid || "anon",
      authorName: auth.currentUser?.displayName ?? "Anonymous",
    });

    setText("");
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🔥 Latest Hot Takes</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-md"
        >
          Post Hot Take
        </button>
      </div>

      <div className="grid gap-4">
        {takes.length === 0 ? (
          <div className="text-gray-500">No takes yet. Be the first!</div>
        ) : (
          takes.map((t) => (
            <Link
              to={`/take/${t.id}`}
              key={t.id}
              className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
            >
              <p className="text-lg">{t.text}</p>
              <div className="text-sm text-gray-500 mt-1">
                by {t.authorName ?? "Anonymous"}
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