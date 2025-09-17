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
			<div 
				className="absolute inset-0 bg-charcoal-900 bg-opacity-50"
				onClick={onClose} 
			/>
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg bg-cream-50 rounded-xl shadow-xl p-6 border border-plum-200">
				<h2 className="font-serif text-xl font-semibold mb-4 text-plum-700">Post a Hot Take</h2>
				<textarea 
					value={text}
					onChange={(e) => setText(e.target.value.slice(0, maxLen))}
					placeholder="Your blistering opinion..."
					className="w-full h-32 p-3 border border-plum-200 rounded-lg focus:outline-none focus:border-plum-200 text-charcoal-900 placeholder:text-stone-500 resize-none"
				/>
				<div className="mt-2 flex items-center justify-between text-sm">
					<span className={remaining < 0 ? "text-peach-500" : "text-stone-500"}>
						{remaining} characters left
					</span>
					<div className="flex gap-3">
						<button 
							onClick={onClose}
							className="px-4 py-2 rounded-lg border border-sage-200 text-charcoal-900 hover:bg-sage-200 hover:text-charcoal-900 transition-colors font-medium"
						>
							Cancel
						</button>
						<button 
							onClick={onSubmit}
							disabled={!text.trim()}
							className="px-4 py-2 rounded-lg bg-plum-600 text-cream-50 hover:bg-plum-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
						>
							Post
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}