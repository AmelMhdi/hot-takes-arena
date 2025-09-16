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
    return <p className="mt-4">No debates yet.</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {debates.map((debate) => (
        <Link
          key={debate.id}
          to={`/debate/${debate.id}`}
        >
          Debate {debate.id.slice(0, 6)} —{" "}
          {debate.active ? "In Progress" : "Finished"}
        </Link>
      ))}
    </div>
  );
};

export default DebateList;