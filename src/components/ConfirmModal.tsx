import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function ConfirmModal({
  open,
  title,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  tone = "primary",
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  tone?: "primary" | "danger";
  children: ReactNode;
}) {
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  function handleConfirm() {
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onConfirm();
    }, 700);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-rise rounded-xl2 bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-ink-400 hover:bg-ink-900/5 hover:text-ink-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 text-sm text-ink-700">{children}</div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-ink-900/12 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${
              tone === "danger" ? "bg-danger hover:bg-danger/90" : "bg-cobalt-500 hover:bg-cobalt-600"
            }`}
          >
            {submitting ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
