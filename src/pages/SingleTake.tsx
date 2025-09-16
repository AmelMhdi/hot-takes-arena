import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { subscribeToDebates, createDebate, auth } from "../firebase";
import DebateList from "../components/DebateList";

const SingleTake: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [debates, setDebates] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToDebates(id, setDebates);
    return () => unsubscribe();
  }, [id]);

  const handleStartDebate = async () => {
    if (!auth.currentUser) {
      alert("You must be signed in to start a debate.");
      return;
    }
    await createDebate(id!, auth.currentUser.uid);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-charcoal-900">Hot Take #{id}</h1>
      <button
        onClick={handleStartDebate}
        className="px-4 py-2 rounded-lg bg-sage-600 hover:bg-sage-700 text-cream-50 font-medium transition-colors duration-200"
      >
        Start a Debate
      </button>

      <DebateList debates={debates} />
    </div>
  );
};

export default SingleTake;