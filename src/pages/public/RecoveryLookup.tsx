import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Search } from "lucide-react";

export function RecoveryLookup() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "not_found">("idle");

  function formatCode(v: string) {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
    return clean.match(/.{1,4}/g)?.join("-") ?? clean;
  }

  function lookup() {
    setStatus("loading");
    setTimeout(() => {
      if (code.replace(/-/g, "").length === 12 && code.startsWith("A")) {
        navigate(`/order/${code}?from=btc&to=eth&amount=0.1`);
      } else {
        setStatus("not_found");
      }
    }, 700);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-orchid-500/10 text-orchid-600">
        <KeyRound size={22} />
      </div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Track your order</h1>
      <p className="mt-2 text-sm text-ink-600">
        Enter the recovery code you saved when you created your order.
      </p>

      <div className="mt-6 rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <input
          value={code}
          onChange={(e) => {
            setCode(formatCode(e.target.value));
            setStatus("idle");
          }}
          placeholder="XXXX-XXXX-XXXX"
          className="w-full rounded-lg border border-ink-900/12 px-3.5 py-3 text-center font-mono text-lg font-semibold tracking-wider outline-none focus:border-orchid-400"
        />
        {status === "not_found" && (
          <p className="mt-2 text-center text-sm font-semibold text-danger">
            We couldn't find that order.
          </p>
        )}
        <button
          onClick={lookup}
          disabled={code.length < 14 || status === "loading"}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orchid-500 py-3 text-sm font-bold text-white hover:bg-orchid-600 disabled:opacity-40"
        >
          <Search size={15} />
          {status === "loading" ? "Looking up…" : "Look up order"}
        </button>
        <p className="mt-3 text-center text-xs text-ink-400">
          Try a code starting with "A" to see a sandbox match.
        </p>
      </div>
    </div>
  );
}
