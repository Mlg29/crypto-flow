import { Check } from "lucide-react";

export function StatusStepper({
  steps,
  currentIndex,
  failedIndex,
}: {
  steps: string[];
  currentIndex: number;
  failedIndex?: number;
}) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isFailed = failedIndex === i;
        const isDone = i < currentIndex && !isFailed;
        const isActive = i === currentIndex && !isFailed;
        const isLast = i === steps.length - 1;

        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold ${
                  isFailed
                    ? "border-danger bg-danger-light text-danger"
                    : isDone
                    ? "border-success bg-success text-white"
                    : isActive
                    ? "border-cobalt-500 bg-cobalt-500/10 text-cobalt-600"
                    : "border-ink-900/15 bg-white text-ink-400"
                }`}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 ${
                    isDone ? "bg-success" : "bg-ink-900/10"
                  }`}
                  style={{ minHeight: 22 }}
                />
              )}
            </div>
            <div className={`pb-6 pt-0.5 text-sm ${isActive || isFailed ? "font-semibold" : "font-medium"} ${
              isFailed ? "text-danger" : isActive ? "text-ink-900" : isDone ? "text-ink-700" : "text-ink-400"
            }`}>
              {step}
              {isActive && (
                <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulseSoft rounded-full bg-cobalt-500 align-middle" />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
