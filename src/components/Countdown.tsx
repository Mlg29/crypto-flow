import { useEffect, useState } from "react";

export function Countdown({
  seconds,
  urgent = false,
  label,
  onExpire,
}: {
  seconds: number;
  urgent?: boolean;
  label: string;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onExpire]);

  const mm = Math.floor(Math.max(remaining, 0) / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.max(remaining, 0) % 60;

  const low = urgent && remaining <= 15;

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
        low
          ? "border-danger/30 bg-danger-light"
          : urgent
          ? "border-warning/30 bg-warning-light"
          : "border-ink-900/8 bg-ink-900/[0.03]"
      }`}
    >
      <span className={`text-xs font-semibold uppercase tracking-wide ${low ? "text-danger" : "text-ink-600"}`}>
        {label}
      </span>
      <span className={`font-mono text-lg font-semibold ${low ? "text-danger" : "text-ink-900"}`}>
        {mm}:{ss.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
