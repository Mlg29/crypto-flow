import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Download,
  ShieldAlert,
  Tag,
} from "lucide-react";
import { ChainBadge } from "../../components/ChainBadge";
import { Countdown } from "../../components/Countdown";
import { CHAINS, fmtAmount, randomAddress, randomClaimCode } from "../../lib/data";
import type { ChainId, OrderType } from "../../lib/types";
import { useApp } from "../../lib/AppContext";

const STEP_LABELS = ["Pair & amount", "Destination", "Refund", "Review", "Save your code"];

const TIPS = [
  {
    q: "What if I send from the wrong network?",
    a: "If the asset is supported on our service, we'll still process your order — just expect a short delay while it's routed correctly.",
  },
  {
    q: "What if I send the wrong amount?",
    a: "Underpayments give you the option to top up or get a partial refund. Overpayments are refunded automatically to your refund address.",
  },
  {
    q: "What if my rate expires before I send?",
    a: "With a fixed rate, we re-quote at the current market rate. You can accept the new rate or cancel for a full refund.",
  },
  {
    q: "How do I cancel an order?",
    a: "If you haven't sent funds yet, just leave the page — there's nothing to cancel. If you've already sent funds, contact support right away.",
  },
];

export function OrderWizard() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { pushToast } = useApp();

  const type = (params.get("type") as OrderType) || "swap";
  const fromChain = (params.get("from") as ChainId) || "btc";
  const toChain = (params.get("to") as ChainId) || "eth";
  const fromAmount = params.get("amount") || "0.1";
  const fixedRate = params.get("fixed") !== "false";

  const steps = type === "buy" ? [0, 1, 3, 4] : [0, 1, 2, 3, 4];
  const [stepPos, setStepPos] = useState(0);
  const step = steps[stepPos];

  const [destination, setDestination] = useState("");
  const [refund, setRefund] = useState("");
  const [promo, setPromo] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [rateExpired, setRateExpired] = useState(false);
  const [openTip, setOpenTip] = useState<number | null>(null);

  const claimCode = useMemo(() => randomClaimCode(), []);
  const depositAddress = useMemo(() => randomAddress(fromChain), [fromChain]);

  function next() {
    if (stepPos < steps.length - 1) setStepPos(stepPos + 1);
  }
  function back() {
    if (stepPos > 0) setStepPos(stepPos - 1);
  }

  function finish() {
    pushToast("success", "Order created — deposit address ready.");
    navigate(
      `/order/${claimCode}?type=${type}&from=${fromChain}&to=${toChain}&amount=${fromAmount}&dest=${destination}`
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-10 sm:px-8">
      <button
        onClick={() => (stepPos === 0 ? navigate("/") : back())}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-8 flex items-center gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${i <= stepPos ? "bg-orchid-500" : "bg-ink-900/8"}`}
          />
        ))}
      </div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
        Step {stepPos + 1} of {steps.length}
      </p>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">
        {STEP_LABELS[step]}
      </h1>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-ink-900/[0.03] px-4 py-3">
              <span className="text-sm text-ink-600">You send</span>
              <span className="flex items-center gap-2 font-mono text-sm font-semibold text-ink-900">
                {fmtAmount(parseFloat(fromAmount))} <ChainBadge chain={fromChain} />
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-ink-900/[0.03] px-4 py-3">
              <span className="text-sm text-ink-600">You receive (est.)</span>
              <span className="flex items-center gap-2 font-mono text-sm font-semibold text-ink-900">
                ≈ {fmtAmount(parseFloat(fromAmount) * 12.4)} <ChainBadge chain={toChain} />
              </span>
            </div>
            <p className="text-xs text-ink-500">
              {fixedRate
                ? "Fixed rate: you receive the quoted amount as long as your deposit arrives within the rate lock window."
                : "Floating rate: your final amount adjusts with the market rate at the time your deposit is detected."}
            </p>
            <button onClick={next} className="w-full rounded-xl bg-orchid-500 py-3 text-sm font-bold text-white hover:bg-orchid-600">
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Your {CHAINS[toChain].name} destination address
            </label>
            <div className="flex items-center gap-2">
              <ChainBadge chain={toChain} variant="pill" />
              <span className="text-xs text-ink-500">Funds arrive here directly</span>
            </div>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={`Paste your ${CHAINS[toChain].symbol} address`}
              className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-orchid-400"
            />
            <div className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning-light px-3.5 py-2.5 text-xs text-warning">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              Double-check this address. Crypto sent to the wrong address cannot be recovered.
            </div>
            <button
              onClick={next}
              disabled={destination.trim().length < 6}
              className="w-full rounded-xl bg-orchid-500 py-3 text-sm font-bold text-white hover:bg-orchid-600 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Refund address on {CHAINS[fromChain].name}
            </label>
            <input
              value={refund}
              onChange={(e) => setRefund(e.target.value)}
              placeholder={`Paste a ${CHAINS[fromChain].symbol} address`}
              className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-orchid-400"
            />
            <p className="text-xs text-ink-500">
              If your order can't be completed, funds are returned here. Since there's no account,
              this is your only backup recovery path.
            </p>
            <button
              onClick={next}
              disabled={refund.trim().length < 6}
              className="w-full rounded-xl bg-orchid-500 py-3 text-sm font-bold text-white hover:bg-orchid-600 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {rateExpired ? (
              <div className="rounded-lg border border-warning/25 bg-warning-light p-4 text-sm text-warning">
                <p className="font-semibold">Your locked rate expired.</p>
                <p className="mt-1 text-ink-700">We've re-quoted at the current market rate below.</p>
              </div>
            ) : (
              <Countdown seconds={60} urgent label={fixedRate ? "Rate lock" : "Rate updates in"} onExpire={() => setRateExpired(true)} />
            )}
            <dl className="space-y-2.5 text-sm">
              <Row label="Sending" value={`${fmtAmount(parseFloat(fromAmount))} ${fromChain.toUpperCase()}`} />
              <Row label={fixedRate ? "Receiving (rate locked)" : "Receiving (estimated)"} value={`${fmtAmount(parseFloat(fromAmount) * 12.4)} ${toChain.toUpperCase()}`} />
              <Row label="Destination" value={destination || "—"} mono />
              {type !== "buy" && <Row label="Refund address" value={refund || "—"} mono />}
              <Row label="Network fee" value="~0.15%" />
            </dl>

            {!showPromo ? (
              <button
                onClick={() => setShowPromo(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-orchid-600"
              >
                <Tag size={13} /> I have a promo code
              </button>
            ) : (
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Enter promo code"
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-orchid-400"
              />
            )}

            <label className="flex items-start gap-2.5 text-xs text-ink-600">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-900/25 text-orchid-500 focus:ring-orchid-400"
              />
              I've read and agree to the Terms of Use, Privacy Policy, and Risk Disclosure Statement
            </label>

            <button
              onClick={next}
              disabled={!agreedToTerms}
              className="w-full rounded-xl bg-orchid-500 py-3 text-sm font-bold text-white hover:bg-orchid-600 disabled:opacity-40"
            >
              Confirm and lock rate
            </button>

            <div className="border-t border-ink-900/6 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                Useful things to know
              </p>
              <div className="space-y-1.5">
                {TIPS.map((tip, i) => (
                  <div key={tip.q} className="rounded-lg border border-ink-900/8">
                    <button
                      onClick={() => setOpenTip(openTip === i ? null : i)}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-ink-700"
                    >
                      {tip.q}
                      <ChevronDown size={14} className={`shrink-0 transition ${openTip === i ? "rotate-180" : ""}`} />
                    </button>
                    {openTip === i && (
                      <p className="border-t border-ink-900/6 px-3.5 py-2.5 text-xs leading-relaxed text-ink-500">
                        {tip.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-danger/25 bg-danger-light px-3.5 py-2.5 text-xs font-semibold text-danger">
              <ShieldAlert size={16} className="shrink-0" />
              This is your order's only recovery handle. Save it before continuing.
            </div>
            <div className="rounded-xl border-2 border-dashed border-ink-900/15 bg-ink-900/[0.03] px-4 py-6 text-center">
              <p className="font-mono text-xl font-bold tracking-wider text-ink-900">{claimCode}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(claimCode).catch(() => {});
                  pushToast("info", "Recovery code copied.");
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink-900/12 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
              >
                <Copy size={15} /> Copy
              </button>
              <button
                onClick={() => pushToast("info", "Recovery code downloaded.")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink-900/12 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
              >
                <Download size={15} /> Download
              </button>
            </div>
            <label className="flex items-start gap-2.5 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-900/25 text-orchid-500 focus:ring-orchid-400"
              />
              I have saved my recovery code
            </label>
            <button
              onClick={finish}
              disabled={!confirmed}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orchid-500 py-3 text-sm font-bold text-white hover:bg-orchid-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={16} /> Continue to deposit
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-ink-400">{depositAddress ? "" : ""}</p>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-900/6 pb-2.5">
      <dt className="text-ink-500">{label}</dt>
      <dd className={`text-right text-ink-900 ${mono ? "break-all font-mono text-xs" : "font-semibold"}`}>{value}</dd>
    </div>
  );
}
