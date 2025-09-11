import type { DebateDoc } from "@/types";
import { Link } from "react-router-dom";

interface DebateListProps {
    debates: DebateDoc[];
}

const DebateList: React.FC<DebateListProps> = ({ debates }) => {
    if (debates.length === 0) {
        return <p className="mt-4 text-gray-500">No debates yet. Be the first to start one.</p>;
    }

    return (
        <div className="space-y-3 mt-4">
            {debates.map((debate) => (
                <div
                    key={debate.id}
                    className="p-3 border rounded bg-white shadow hover:shadow-md transition"
                >
                    <p className="font-semibold">
                        Debate #{debate.id?.slice(0, 6)} —{" "}
                        {debate.active 
                            ? debate.opponentId
                                ? "Active debate"
                                : "Waiting for opponent"
                        : "Finished"}
                    </p>

                    {/* Link to debate room */}
                    <Link
                        to={`/debate/${debate.id}`}
                        className="text-blue-600 underline text-sm"
                    >
                        View debate
                    </Link>
                </div>
            ))}
        </div>
    )
};

export default DebateList;