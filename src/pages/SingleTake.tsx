import { useParams } from "react-router-dom";

export default function SingleTake() {
    const { id } = useParams();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Hot Take #{id}</h1>
            <p className="mb-6">This is where the hot take content will go</p>

            <h2 className="text-xl font-bold mb-2">Debates</h2>
            <div className="space-y-3">
                {[1, 2].map((reply) => (
                    <div key={reply} className="bg-white p-3 rounded-lg shadow">
                        Reply #{reply} — Placeholder text.
                    </div>
                ))}
            </div>
        </div>
    )
}