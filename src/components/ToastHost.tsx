import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useApp } from "../lib/AppContext";

const ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
};

const STYLES = {
  success: "border-success/25 bg-white text-success",
  info: "border-cobalt-500/25 bg-white text-cobalt-600",
  warning: "border-warning/30 bg-white text-warning",
  danger: "border-danger/25 bg-white text-danger",
};

export function ToastHost() {
  const { toasts } = useApp();

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0">
      {toasts.map((t) => {
        const Icon = ICONS[t.tone];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium shadow-soft animate-rise ${STYLES[t.tone]}`}
          >
            <Icon size={17} className="shrink-0" />
            <span className="text-ink-800">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
