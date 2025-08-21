import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, sendDebateMessage } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const DebateRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [debate, setDebate] = useState<any | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, "debates", id);
    const unsub = onSnapshot(ref, (snap) => {
      setDebate({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [id]);

  const handleSend = async () => {
    if (!debate || !input.trim()) return;
    // NOTE: Replace "user123" with currentUser.uid
    const turn = debate.messages.length;
    await sendDebateMessage(debate.id, "user123", input, turn);
    setInput("");
  };

  if (!debate) return <p>Loading debate...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Debate Room</h1>

      <div className="space-y-2 mb-4">
        {debate.messages.map((msg: any, idx: number) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.uid === "user123" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>

      {debate.active ? (
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border px-2 py-1 rounded"
            placeholder="Write your message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Send
          </button>
        </div>
      ) : (
        <p className="text-gray-500">This debate has ended.</p>
      )}
    </div>
  );
};

export default DebateRoom;