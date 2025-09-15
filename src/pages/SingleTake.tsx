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
      alert("Please log in to start a debate.");
      return;
    }
    await createDebate(id!, auth.currentUser.uid);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-4">Hot Take #{id}</h1>
      <button
        onClick={handleStartDebate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start a Debate
      </button>

      <DebateList debates={debates} />
    </div>
  );
};

export default SingleTake;