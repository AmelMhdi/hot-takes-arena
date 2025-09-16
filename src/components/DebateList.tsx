import { MessageSquare } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface Debate {
  id: string;
  active: boolean;
}

interface DebateListProps {
  debates: Debate[];
}

const DebateList: React.FC<DebateListProps> = ({ debates }) => {
  if (debates.length === 0) {
    return (
      <div className="mt-4 text-center text-charcoal-600 py-8">
        <MessageSquare className="h-12 w-12 text-charcoal-400 mx-auto mb-3" />
        <p className="mt-4 text-sm text-charcoal-600">No debates yet.</p>
        <p className="mt-2 text-xs text-charcoal-600">Be the first to start a debate!</p>
      </div>
    );
  }

  // TODO: sort debates by creation date descending
  // const sortedDebates = [...debates].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mt-4 space-y-2 flex flex-col">
      {debates.map((debate, index) => (
        <Link
          key={debate.id}
          to={`/debate/${debate.id}`}
          className="block p-4 rounded-lg bg-cream-50 border border-stone-200 hover:bg-cream-100 transition-colors duration-200"
        >
          Debate #{index + 1} —{" "}
          {debate.active ? "In Progress" : "Finished"}
        </Link>
      ))}
    </div>
  );
};

export default DebateList;