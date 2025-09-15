import { useEffect } from "react";

type Props = {
    open: boolean;
    text: string;
    setText: (v: string) => void;
    maxLen?: number;
    onSubmit: () => void;
    onClose: () => void;
};

export default function PostTakeModal({
    open, text, setText, maxLen = 140, onSubmit, onClose,
}: Props) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!open) return null;

    const remaining = maxLen - text.length;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 " onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg rounded-xl shadow-xl p-5">
                <h2 className="text-xl font-semibold mb-3">Post a Hot Take</h2>
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, maxLen))}
                    placeholder="Your blistering opinion..."
                    className="w-full h-32 p-3 border rounded focus:outline-none focus:ring-2"
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                    <span className={remaining < 0 ? "text-red-600" : "text-gray-500"}>
                        {remaining} characters left
                    </span>
                    <div className="flex gap-2">
                        <button onClick={onClose}
                        className="px-3 py-1 rounded border">
                            Cancel
                        </button>
                        <button onClick={onSubmit}
                        disabled={!text.trim()}              className="px-3 py-1 rounded disabled:opacity-50">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}