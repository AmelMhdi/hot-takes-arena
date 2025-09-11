import React, { useEffect, useState } from "react";

import { 
  auth, 
  endDebateAndSetWinner, 
  incrementWin, 
  sendDebateMessage, 
  subscribeToDebates, 
  upvoteMessage 
} from "../firebase";
import type { DebateDoc } from "../types";

interface Props {
  takeId: string;
}

const DebateRoom: React.FC<Props> = ({ takeId }) => {
  const [debates, setDebates] = useState<DebateDoc[]>([]);
  const [input, setInput] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const unsub = subscribeToDebates(takeId, setDebates);
    return () => unsub();
  }, [takeId]);

  const debate = debates[0]; // MVP: show the first debate only
  if (!debate) return <p>No debate yet.</p>;

  const handleSend = async () => {
    if (!user || !input.trim()) return;
    await sendDebateMessage(
      debate.id!, 
      user.uid, 
      input, 
      debate.messages.length
    );
    setInput("");
  };

  const handleUpvote = async (idx: number) => {
    if (!user || !debate.id) return;
    await upvoteMessage(debate.id, idx, user.uid);
  };

  const handleEnd = async () => {
    if (!debate.id) return;
    const winnerId = await endDebateAndSetWinner(debate.id);

    if (winnerId && user && winnerId === user.uid) {
      await incrementWin(user.uid, user.displayName);
    }
  };

  return (
    <div className="p-4 rounded">
      <h2 className="text-xl font-bold">Debate Room</h2>

      {debate.winnerId ? (
        <p className="text-green-600 font-semibold">
          Winner: {debate.winnerId === debate.challengerId ? "Challenger" : "Opponent"}
        </p>
      ) : (
        !debate.active && <p className="text-gray-500">Result: Tie</p>
      )}

      <div className="my-4 space-y-2">
        {debate.messages.map((m, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>
              <b>
                {m.userId === debate.challengerId 
                  ? "Challenger" 
                  : "Opponent"
                }
              </b>{" "}
              {m.text}
            </span>
            <div className="flex items-center space-x-2">
              <span>{m.upvotes?.length || 0} 👍</span>
              <button 
                disabled={debate.active}
                onClick={() => handleUpvote(idx)}
                className={`px-2 py-1 text-sm rounded ${
                  debate.active
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Upvote
              </button>
            </div>
          </div>
        ))}
      </div>

      {debate.active && (
        <div className="space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your argument..."
            className="border p-2 rounded"
          />
          <button 
            onClick={handleSend}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
          <button 
            onClick={handleEnd} 
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            End Debate
          </button>
        </div>
      )}
    </div>    
  );
};

export default DebateRoom;