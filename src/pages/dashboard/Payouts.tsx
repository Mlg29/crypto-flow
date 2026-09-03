import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileWarning, Send, Upload } from "lucide-react";
import { ChainBadge } from "../../components/ChainBadge";
import { StatusPill } from "../../components/StatusPill";
import { ConfirmModal } from "../../components/ConfirmModal";
import { CHAIN_LIST, PAYOUTS, WALLET_BALANCES, fmtAmount } from "../../lib/data";
import type { ChainId, PayoutStatus } from "../../lib/types";
import { useApp } from "../../lib/AppContext";

const TABS = ["Single payout", "Bulk payout", "History"] as const;

const STATUS_TONE: Record<PayoutStatus, "success" | "warning" | "danger" | "neutral"> = {
  complete: "success",
  confirming: "warning",
  broadcasting: "warning",
  queued: "neutral",
  failed: "danger",
};

export function Payouts() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Single payout");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Payouts</h1>
        <p className="mt-1 text-sm text-ink-500">Send funds from your custodial wallets — one at a time or in bulk.</p>
      </div>

      <div className="flex gap-1 rounded-xl bg-ink-900/[0.04] p-1 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition sm:flex-none ${
              tab === t ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Single payout" && <SinglePayout />}
      {tab === "Bulk payout" && <BulkPayout />}
      {tab === "History" && <PayoutHistory />}
    </div>
  );
}

function SinglePayout() {
  const { pushToast } = useApp();
  const [chain, setChain] = useState<ChainId>("eth");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const wallet = WALLET_BALANCES.find((w) => w.chain === chain)!;
  const amt = parseFloat(amount || "0");
  const insufficient = amt > wallet.available;
  const fee = amt * 0.001;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Source wallet</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CHAIN_LIST.map((c) => {
              const bal = WALLET_BALANCES.find((w) => w.chain === c.id)!;
              return (
                <button
                  key={c.id}
                  onClick={() => setChain(c.id)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-xs ${
                    chain === c.id ? "border-cobalt-400 bg-cobalt-500/5" : "border-ink-900/10"
                  }`}
                >
                  <ChainBadge chain={c.id} />
                  <p className="mt-1 font-mono font-semibold text-ink-800">{fmtAmount(bal.available, 3)}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Destination address</label>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={`Paste a ${chain.toUpperCase()} address`}
            className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-cobalt-400"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Amount</label>
            <button onClick={() => setAmount(String(wallet.available))} className="text-xs font-semibold text-cobalt-600">
              Max: {fmtAmount(wallet.available, 4)} {chain.toUpperCase()}
            </button>
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-cobalt-400"
          />
          {insufficient && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-danger">
              <AlertTriangle size={13} /> Amount exceeds available balance
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Memo <span className="text-ink-400 normal-case">(optional)</span>
          </label>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
          />
        </div>

        <button
          onClick={() => setConfirmOpen(true)}
          disabled={!destination || !amt || insufficient}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
        >
          <Send size={15} /> Review payout
        </button>
      </div>

      <div className="h-fit space-y-3 rounded-xl2 border border-ink-900/8 bg-white p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Fee estimate</p>
        <Row label="Amount" value={`${fmtAmount(amt, 4)} ${chain.toUpperCase()}`} />
        <Row label="Network fee" value={`${fmtAmount(fee, 6)} ${chain.toUpperCase()}`} />
        <div className="border-t border-ink-900/8 pt-2.5">
          <Row label="Recipient gets" value={`${fmtAmount(amt - fee, 4)} ${chain.toUpperCase()}`} bold />
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Confirm payout"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          pushToast("success", "Payout broadcast — tracking in history.");
          setAmount("");
          setDestination("");
        }}
        confirmLabel="Broadcast payout"
      >
        <div className="space-y-2">
          <Row label="Destination" value={destination || "—"} mono />
          <Row label="Amount" value={`${fmtAmount(amt, 4)} ${chain.toUpperCase()}`} />
          <Row label="Fee" value={`${fmtAmount(fee, 6)} ${chain.toUpperCase()}`} />
          <Row label="Total debited" value={`${fmtAmount(amt, 4)} ${chain.toUpperCase()}`} bold />
        </div>
        <p className="mt-3 rounded-lg bg-warning-light px-3 py-2 text-xs font-semibold text-warning">
          Once broadcast, payouts cannot be cancelled.
        </p>
      </ConfirmModal>
    </div>
  );
}

function BulkPayout() {
  const { pushToast } = useApp();
  const [phase, setPhase] = useState<"upload" | "review" | "processing" | "done">("upload");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const rows = [
    { row: 1, address: "0x9c1…4fd2", amount: 120, chain: "eth" as ChainId, ok: true },
    { row: 2, address: "TQn8…88aA", amount: 40, chain: "trx" as ChainId, ok: true },
    { row: 3, address: "0xbad", amount: 15, chain: "bsc" as ChainId, ok: false },
    { row: 4, address: "0x2ab…91c0", amount: 300, chain: "eth" as ChainId, ok: true },
  ];
  const errorCount = rows.filter((r) => !r.ok).length;

  function process() {
    setConfirmOpen(false);
    setPhase("processing");
    let p = 0;
    const t = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(t);
        setPhase("done");
        pushToast("success", "Bulk payout processed.");
      }
    }, 500);
  }

  if (phase === "upload") {
    return (
      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-ink-900/15 py-14 text-center">
          <Upload size={26} className="mb-3 text-ink-400" />
          <p className="text-sm font-semibold text-ink-800">Drag a CSV here or click to browse</p>
          <p className="mt-1 text-xs text-ink-500">Accepts .csv up to 10MB</p>
          <button onClick={() => setPhase("review")} className="mt-4 rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-bold text-white hover:bg-cobalt-600">
            Click to upload
          </button>
        </div>
        <a href="#" className="mt-3 inline-block text-xs font-semibold text-cobalt-600">
          Download CSV template
        </a>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Total rows" value={String(rows.length)} />
          <MiniStat label="Valid rows" value={String(rows.length - errorCount)} tone="success" />
          <MiniStat label="Rows with errors" value={String(errorCount)} tone={errorCount ? "danger" : "neutral"} />
          <MiniStat label="Aggregate total" value={`$${rows.reduce((s, r) => s + r.amount, 0)}`} />
        </div>
        <div className="overflow-hidden rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/6 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3">Row</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Chain</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {rows.map((r) => (
                <tr key={r.row} className={!r.ok ? "bg-danger-light/40" : ""}>
                  <td className="px-5 py-3 text-ink-500">{r.row}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-800">{r.address}</td>
                  <td className="px-5 py-3 font-mono font-semibold text-ink-900">${r.amount}</td>
                  <td className="px-5 py-3"><ChainBadge chain={r.chain} /></td>
                  <td className="px-5 py-3">
                    {r.ok ? (
                      <StatusPill tone="success" label="Valid" />
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-danger">
                        <FileWarning size={13} /> Invalid address
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errorCount > 0 && (
          <p className="rounded-lg bg-danger-light px-3.5 py-2.5 text-sm font-semibold text-danger">
            Fix or remove {errorCount} row(s) with errors before you can proceed — no partial batches are broadcast.
          </p>
        )}
        <div className="flex gap-3">
          <button onClick={() => setPhase("upload")} className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700">
            Re-upload
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={errorCount > 0}
            className="flex-1 rounded-lg bg-cobalt-500 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
          >
            Continue to confirmation
          </button>
        </div>

        <ConfirmModal
          open={confirmOpen}
          title="Confirm bulk payout"
          onClose={() => setConfirmOpen(false)}
          onConfirm={process}
          confirmLabel={`Confirm ${rows.length} payouts`}
        >
          <p>
            You're about to send <strong>{rows.length} payouts</strong> totaling{" "}
            <strong>${rows.reduce((s, r) => s + r.amount, 0)}</strong> across{" "}
            {new Set(rows.map((r) => r.chain)).size} chains.
          </p>
          <p className="mt-3 rounded-lg bg-warning-light px-3 py-2 text-xs font-semibold text-warning">
            This action is irreversible once broadcast begins.
          </p>
        </ConfirmModal>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="rounded-xl2 border border-ink-900/8 bg-white p-8 shadow-soft">
        <p className="mb-3 text-sm font-semibold text-ink-800">Processing batch…</p>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-900/8">
          <div className="h-full rounded-full bg-cobalt-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-ink-500">{Math.round((progress / 100) * rows.length)} of {rows.length} items processed</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl2 border border-ink-900/8 bg-white p-8 text-center shadow-soft">
      <CheckCircle2 size={32} className="mx-auto mb-3 text-success" />
      <p className="font-display text-lg font-semibold text-ink-900">Batch complete</p>
      <p className="mt-1 text-sm text-ink-500">{rows.length} of {rows.length} payouts succeeded.</p>
      <button onClick={() => setPhase("upload")} className="mt-4 rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-bold text-white hover:bg-cobalt-600">
        Download results CSV
      </button>
    </div>
  );
}

function PayoutHistory() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-900/6 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Recipient</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Chain</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-900/6">
          {PAYOUTS.map((p) => (
            <tr key={p.id} className="hover:bg-ink-900/[0.02]">
              <td className="px-6 py-3.5 font-semibold text-ink-900">{p.id}</td>
              <td className="px-6 py-3.5 font-mono text-xs text-ink-700">{p.destination}</td>
              <td className="px-6 py-3.5 font-mono font-semibold text-ink-900">{fmtAmount(p.amount, 2)}</td>
              <td className="px-6 py-3.5"><ChainBadge chain={p.chain} /></td>
              <td className="px-6 py-3.5">
                <StatusPill tone={STATUS_TONE[p.status]} label={p.status} />
                {p.status === "failed" && (
                  <button className="ml-2 text-xs font-semibold text-cobalt-600">Retry</button>
                )}
              </td>
              <td className="px-6 py-3.5 text-ink-400">{new Date(p.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, value, bold, mono }: { label: string; value: string; bold?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={`text-right text-ink-900 ${bold ? "font-bold" : "font-medium"} ${mono ? "break-all font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" | "neutral" }) {
  const color = tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-ink-900";
  return (
    <div className="rounded-xl2 border border-ink-900/8 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className={`mt-1.5 font-mono text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
