import React from "react";
import { Link } from "react-router-dom";

interface DebateListProps {
  debates: any[];
}

const DebateList: React.FC<DebateListProps> = ({ debates }) => {
  if (debates.length === 0) {
    return <p className="mt-4 text-gray-500">No debates yet.</p>;
  }

  return (
    <div className="êspace-y-4">
      {debates.map((debate) => (
        <Link
          key={debate.id}
          to={`/debate/${debate.id}`}
          className="block p-3 border rounded hover:bg-gray-100"
        >
          Debate {debate.id.slice(0, 6)} —{" "}
          {debate.active ? "In Progress" : "Finished"}
        </Link>
      ))}
    </div>
  );
};

export default DebateList;