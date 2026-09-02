import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, ExternalLink, FlaskConical, RefreshCw } from "lucide-react";
import { DepositAddressCard } from "../../components/DepositAddressCard";
import { StatusStepper } from "../../components/StatusStepper";
import { Countdown } from "../../components/Countdown";
import { ChainBadge } from "../../components/ChainBadge";
import { fmtAmount, randomAddress } from "../../lib/data";
import type { ChainId } from "../../lib/types";
import { useApp } from "../../lib/AppContext";

const STEPS = ["Awaiting deposit", "Deposit detected", "Confirming", "Converting", "Paying out", "Complete"];

type Exception = "none" | "underpaid" | "overpaid" | "rate_expired" | "late";

export function DepositStatus() {
  const { claimCode } = useParams();
  const [params] = useSearchParams();
  const { pushToast, env } = useApp();

  const fromChain = (params.get("from") as ChainId) || "btc";
  const toChain = (params.get("to") as ChainId) || "eth";
  const amount = parseFloat(params.get("amount") || "0.1");

  const depositAddress = useMemo(() => randomAddress(fromChain), [fromChain]);
  const [stage, setStage] = useState(0);
  const [exception, setException] = useState<Exception>("none");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);

  function advance() {
    if (stage < STEPS.length - 1) setStage((s) => s + 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Order</p>
          <p className="font-mono text-lg font-bold text-ink-900">{claimCode}</p>
        </div>
        <span className="rounded-full bg-sandbox-light px-3 py-1 text-xs font-bold text-sandbox-dim">
          Sandbox — testnet assets only
        </span>
      </div>

      {exception === "none" && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <Countdown seconds={45} urgent label="Rate lock" onExpire={() => setException("rate_expired")} />
          <Countdown seconds={1800} label="Deposit window" />
        </div>
      )}

      {exception === "rate_expired" && (
        <div className="mb-6 rounded-xl border border-warning/25 bg-warning-light p-4 text-sm">
          <p className="font-semibold text-warning">Your rate lock expired before a deposit arrived.</p>
          <p className="mt-1 text-ink-700">We can re-quote at the current market rate, or you can cancel and get a refund.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setException("none")} className="rounded-lg bg-warning px-3.5 py-2 text-xs font-bold text-white">
              Accept new rate
            </button>
            <button onClick={() => pushToast("info", "Order cancelled — refund initiated.")} className="rounded-lg border border-ink-900/15 px-3.5 py-2 text-xs font-bold text-ink-700">
              Cancel & refund
            </button>
          </div>
        </div>
      )}

      {exception === "underpaid" && (
        <div className="mb-6 rounded-xl border border-danger/25 bg-danger-light p-4 text-sm">
          <p className="font-semibold text-danger">We received less than expected.</p>
          <p className="mt-1 text-ink-700">
            Expected {fmtAmount(amount)} {fromChain.toUpperCase()}, received {fmtAmount(amount * 0.6)} {fromChain.toUpperCase()}.
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setException("none")} className="rounded-lg bg-danger px-3.5 py-2 text-xs font-bold text-white">
              Send remaining {fmtAmount(amount * 0.4)} {fromChain.toUpperCase()}
            </button>
            <button onClick={() => pushToast("info", "Refund requested for partial amount.")} className="rounded-lg border border-ink-900/15 px-3.5 py-2 text-xs font-bold text-ink-700">
              Refund what I sent
            </button>
          </div>
        </div>
      )}

      {exception === "overpaid" && (
        <div className="mb-6 rounded-xl border border-cobalt-500/25 bg-cobalt-500/5 p-4 text-sm">
          <p className="font-semibold text-cobalt-700">We received more than expected.</p>
          <p className="mt-1 text-ink-700">
            The extra {fmtAmount(amount * 0.3)} {fromChain.toUpperCase()} will be automatically refunded to your refund address. No action needed.
          </p>
        </div>
      )}

      {exception !== "underpaid" && exception !== "overpaid" && (
        <DepositAddressCard address={depositAddress} chain={fromChain} amount={amount} symbol={fromChain.toUpperCase()} />
      )}

      <div className="mt-6 rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <p className="mb-4 text-sm font-semibold text-ink-900">Order progress</p>
        <StatusStepper steps={STEPS} currentIndex={stage} />
        {stage === STEPS.length - 1 && (
          <div className="rounded-lg bg-success-light p-3.5 text-sm text-success">
            <p className="font-semibold">Complete — funds delivered.</p>
            <a href="#" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold underline">
              View on block explorer <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
        <button
          onClick={() => setDetailsOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-4 text-sm font-semibold text-ink-800"
        >
          Order details
          <ChevronDown size={16} className={`transition ${detailsOpen ? "rotate-180" : ""}`} />
        </button>
        {detailsOpen && (
          <div className="space-y-2.5 border-t border-ink-900/6 px-6 py-4 text-sm">
            <DetailRow label="Recovery code" value={claimCode || ""} mono />
            <DetailRow label="From" value={<ChainBadge chain={fromChain} />} />
            <DetailRow label="To" value={<ChainBadge chain={toChain} />} />
            <DetailRow label="Estimated total received" value={`${fmtAmount(amount * 12.4)} ${toChain.toUpperCase()}`} />
            <DetailRow label="Order ID" value={`ORD-${claimCode?.slice(0, 4)}`} mono />
          </div>
        )}
      </div>

      {env === "sandbox" && (
        <div className="mt-6 rounded-xl2 border border-sandbox/25 bg-sandbox-light p-4">
          <button onClick={() => setDevtoolsOpen((v) => !v)} className="flex w-full items-center justify-between text-sm font-bold text-sandbox-dim">
            <span className="inline-flex items-center gap-1.5"><FlaskConical size={15} /> Sandbox devtools</span>
            <ChevronDown size={16} className={`transition ${devtoolsOpen ? "rotate-180" : ""}`} />
          </button>
          {devtoolsOpen && (
            <div className="mt-3 flex flex-wrap gap-2">
              <DevBtn onClick={advance} icon={<RefreshCw size={13} />} label="Advance state" />
              <DevBtn onClick={() => setException("underpaid")} label="Simulate underpayment" />
              <DevBtn onClick={() => setException("overpaid")} label="Simulate overpayment" />
              <DevBtn onClick={() => setException("rate_expired")} label="Force rate expiry" />
              <DevBtn onClick={() => setException("none")} label="Reset" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-ink-500">{label}</span>
      <span className={`text-right text-ink-900 ${mono ? "font-mono text-xs" : "font-semibold"}`}>{value}</span>
    </div>
  );
}

function DevBtn({ onClick, label, icon }: { onClick: () => void; label: string; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-sandbox-dim shadow-sm hover:bg-sandbox/10"
    >
      {icon}
      {label}
    </button>
  );
}
