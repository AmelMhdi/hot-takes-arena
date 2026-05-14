import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { subscribeToDebates, createDebate, auth, db } from "../firebase";
import DebateList from "../components/DebateList";
import type { HotTake } from "@/types";
import { doc, onSnapshot } from "firebase/firestore";

const SingleTake: React.FC = () => {
  const { takeId } = useParams<{ takeId: string }>();
  const [debates, setDebates] = useState<any[]>([]);
  const [hotTake, setHotTake] = useState<HotTake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get data for debates related to this take
  useEffect(() => {
    if (!takeId) return;

    const hotTakeRef = doc(db, "hot_takes", takeId);

    const unsubscribe = onSnapshot(
      hotTakeRef,
      (doc) => {
        if (doc.exists()) {
          setHotTake({ id: doc.id, ...doc.data() } as HotTake);
          setError(null);
        } else {
          setError("Hot take not found.");
          setHotTake(null);
      }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching hot take:", error);
        setError("Failed to load hot take.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [takeId]);

  // get debates
  useEffect(() => {
    if (!takeId) return;
    const unsubscribe = subscribeToDebates(takeId, setDebates);
    return () => unsubscribe();
  }, [takeId]);

  const handleStartDebate = async () => {
    if (!auth.currentUser) {
      alert("You must be signed in to start a debate.");
      return;
    }
    await createDebate(takeId!, auth.currentUser.uid);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="p-4">
        <div className="font-serif text-charcoal-600 animate-pulse">
          <div className="h-8 bg-cream-100 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-cream-100 rounded w-32 mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-[#755a75] rounded-lg p-4 mb-4">
          <h1 className="text-lg font-semibold text-[#faf8fa] mb-2">Error</h1>
          <p className="text-[#faf8fa]">{error}</p>
        </div>
      </div>
    );
  }

  if (!hotTake) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <p className="text-charcoal-900">Hot take not found</p>
        </div>
      </div>
    );
  }

  // Function to shorten hot take text if too long
  const getTitleFromText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-4 text-charcoal-900">{getTitleFromText(hotTake.text)}</h1>
        <div className="text-sm text-charcoal-600">
          <span>by {hotTake.authorName ?? "Anonymous"}</span>
          <span> • </span>
          <span>{new Date(hotTake.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Full text if different from title */}
      {hotTake.text.length > 80 && (
        <div className="mb-6 p-4 bg-cream-50 border border-stone-200 rounded-lg">
          <p className="text-charcoal-900 leading-relaxed">{hotTake.text}</p>
        </div>
      )}

      {/* Start a debate button */}
      <div className="mb-6">
        <button
          onClick={handleStartDebate}
          className="px-4 py-2 rounded-lg bg-sage-600 hover:bg-sage-700 text-cream-50 font-medium transition-colors duration-200"
        >
          Start a Debate
        </button>
      </div>

      {/* List of debates */}
      <div>
        <DebateList debates={debates} />
      </div>
    </div>
  );
};

export default SingleTake;