import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  auth, 
  endDebateAndSetWinner, 
  incrementUserLoss, 
  incrementUserWin, 
  sendDebateMessage, 
  subscribeToDebate, 
  upvoteMessage 
} from "../firebase";
import type { DebateDoc } from "../types";

const DebateRoom: React.FC = () => {
  const { debateId } = useParams<{ debateId: string }>();
  const [debate, setDebate] = useState<DebateDoc | null>(null);
  const [input, setInput] = useState("");
  const user = auth.currentUser;
  const isChallenger = user && (user.uid === debate?.challengerId || user.uid == debate?.opponentId);

  useEffect(() => {
    if (!debateId) return;
    const unsub = subscribeToDebate(debateId, setDebate);
    return () => unsub();
  }, [debateId]);

  if (!debate) return <p>No debate yet.</p>;

  const handleSend = async () => {
    if (!user || !input) return;
    await sendDebateMessage(debate.id!, user.uid, input, debate.messages.length);
    setInput("");
  };

  const handleUpvote = async (idx: number) => {
    if (!user || !debate.id) return;
    await upvoteMessage(debate.id, idx, user.uid);
  };

  const handleEnd = async () => {
    if (!debate.id) return;
    const winnerId = await endDebateAndSetWinner(debate.id);

    if (winnerId && user) {
      if (winnerId === user.uid) {
        await incrementUserWin(user.uid, user.displayName, user.photoURL);
      } else {
        await incrementUserLoss(user.uid, user.displayName, user.photoURL);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-cream-100 border border-stone-200 shadow-sm">
      <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Debate Room</h2>

      {debate.winnerId ? (
        <p className="font-semibold text-sage-700 bg-sage-50 p-3 rounded-lg border border-sage-200">
          Winner: {debate.winnerId === debate.challengerId ? "Challenger" : "Opponent"}
        </p>
      ) : (
        !debate.active && (
          <p className="text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">Result: Tie</p>
        )
      )}

      <div className="my-6 space-y-3">
        {debate.messages.map((m, idx) => (
          <div 
            key={idx} 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-cream-50 border border-stone-200 p-4 rounded-lg hover:bg-cream-100 transition-colors duration-200"
          >
            <span className="text-charcoal-800">
              <b className="text-charcoal-900">
                {m.uid === debate.challengerId ? "Challenger" : "Opponent"}
              </b>{" "}
              {m.text}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-peach-600 font-medium">{m.upvotes?.length || 0} 👍</span>
              <button 
                disabled={debate.active}
                onClick={() => handleUpvote(idx)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
                  debate.active
                    ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                    : "bg-sage-500 text-cream-50 hover:bg-sage-600 active:bg-sage-700"
                }`}
              >
                Upvote
              </button>
            </div>
          </div>
        ))}
      </div>

      {debate.active && isChallenger && (
        <div className="flex items-center sm:flex-row gap-3 mt-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your argument..."
            className="flex-1 bg-cream-100 border border-stone-300 rounded-lg px-4 py-3 text-charcoal-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all duration-200"
          />
          <button 
            onClick={handleSend}
            className="bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-cream-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Send
          </button>
          <button 
            onClick={handleEnd}
            className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-cream-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            End Debate
          </button>
        </div>
      )}
    </div>    
  );
};

export default DebateRoom;