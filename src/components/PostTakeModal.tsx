import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  text: string;
  setText: (v: string) => void;
  maxLen?: number;
  onSubmit: () => void;
  onClose: () => void;
};

export default function PostTakeModal({
  open,
  text,
  setText,
  maxLen = 140,
  onSubmit,
  onClose,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    // Prevent body scroll when modal is open
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handler);
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [onClose, open]);

  if (!open) return null;

  const remaining = maxLen - text.length;
  const isOverLimit = remaining < 0;
  const canSubmit = text.trim() && !isOverLimit;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container - Flexbox centering */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-card shadow-2xl transition-all border border-border"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 
              id="modal-title"
              className="text-xl font-serif font-semibold text-foreground"
            >
              Post a Hot Take
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, maxLen))}
              placeholder="Share your hottest take..."
              className="w-full h-32 p-3 bg-background border border-border rounded-lg resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              autoFocus
              maxLength={maxLen}
            />

            {/* Character count and buttons */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className={`text-sm font-medium ${
                    isOverLimit 
                      ? "text-destructive" 
                      : remaining <= 10 
                        ? "text-amber-500" 
                        : "text-muted-foreground"
                  }`}
                >
                  {remaining} characters left
                </span>
                {isOverLimit && (
                  <span className="text-xs text-destructive">
                    Too long!
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                >
                  Post Take
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}