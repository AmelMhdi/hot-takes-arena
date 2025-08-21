import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { subscribeToDebates, createDebate } from "../firebase";
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
    // NOTE: Replace "user123" with real currentUser.uid from auth
    await createDebate(id!, "user123");
  };

  return (
    <div className="p-4">
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