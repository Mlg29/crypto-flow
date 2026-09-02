import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Copy } from "lucide-react";
import { ChainBadge } from "../../components/ChainBadge";
import { CHAIN_LIST, fmtUsd } from "../../lib/data";
import type { ChainId } from "../../lib/types";
import { useApp } from "../../lib/AppContext";

export function CreateInvoice() {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("250");
  const [chain, setChain] = useState<ChainId>("trx");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [expiry, setExpiry] = useState("1 hour");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Create invoice</h1>

      <div className="flex items-center gap-2 text-xs font-semibold text-ink-400">
        <span className={step === 0 ? "text-cobalt-600" : ""}>Details</span>
        <ChevronRight size={13} />
        <span className={step === 1 ? "text-cobalt-600" : ""}>Preview</span>
        <ChevronRight size={13} />
        <span className={step === 2 ? "text-cobalt-600" : ""}>Created</span>
      </div>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Amount (USD)</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-cobalt-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Chain</label>
                <select
                  value={chain}
                  onChange={(e) => setChain(e.target.value as ChainId)}
                  className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
                >
                  {CHAIN_LIST.map((c) => (
                    <option key={c.id} value={c.id}>{c.symbol}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Description <span className="text-ink-400 normal-case">(visible to customer)</span>
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Consulting — September"
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Customer email <span className="text-ink-400 normal-case">(optional)</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Expiry</label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
                >
                  {["15 min", "1 hour", "1 day", "Custom"].map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!amount || !description}
              className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              Preview invoice
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-ink-900/10 bg-paper p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Amount due</p>
              <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{fmtUsd(parseFloat(amount || "0"))}</p>
              <p className="mt-1 text-sm text-ink-500">{description || "—"}</p>
              <div className="mt-2 flex justify-center">
                <ChainBadge chain={chain} variant="pill" />
              </div>
            </div>
            <p className="text-xs text-ink-500">This is what your customer will see on the payment page.</p>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 rounded-lg border border-ink-900/12 py-2.5 text-sm font-semibold text-ink-700">
                Back
              </button>
              <button
                onClick={() => {
                  pushToast("success", "Invoice created.");
                  setStep(2);
                }}
                className="flex-1 rounded-lg bg-cobalt-500 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600"
              >
                Create invoice
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-center">
            <p className="font-display text-lg font-semibold text-ink-900">Invoice created</p>
            <div className="flex items-center gap-2 rounded-lg bg-ink-900/[0.03] px-3.5 py-2.5">
              <span className="flex-1 truncate text-left font-mono text-xs text-ink-700">
                cryptoflow.example/pay/INV-9021
              </span>
              <button
                onClick={() => pushToast("info", "Link copied.")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-cobalt-600"
              >
                <Copy size={13} /> Copy
              </button>
            </div>
            <button
              onClick={() => navigate("/dashboard/invoices")}
              className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600"
            >
              View all invoices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
