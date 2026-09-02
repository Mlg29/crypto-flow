import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(i: number, v: string) {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  }

  const complete = digits.every((d) => d !== "");

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-cobalt-500/10 text-cobalt-600">
        <MailCheck size={22} />
      </div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Check your email</h1>
      <p className="mt-2 text-sm text-ink-500">
        We sent a 6-digit code to your inbox. Enter it below to confirm your address.
      </p>

      <div className="mt-6 flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-12 rounded-lg border border-ink-900/12 text-center font-mono text-xl font-bold outline-none focus:border-cobalt-400"
          />
        ))}
      </div>

      <button
        onClick={() => navigate("/onboarding/verification")}
        disabled={!complete}
        className="mt-6 w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
      >
        Verify email
      </button>
      <button className="mt-3 text-sm font-semibold text-cobalt-600">Resend code</button>
    </div>
  );
}
