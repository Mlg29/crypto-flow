import { useState } from "react";
import { Check, Copy, Plus, ShieldCheck, Webhook } from "lucide-react";
import { StatusPill } from "../../components/StatusPill";
import { ConfirmModal } from "../../components/ConfirmModal";
import { API_KEYS, WEBHOOKS } from "../../lib/data";
import { useApp } from "../../lib/AppContext";

const TABS = ["API keys", "Webhooks", "Signature verifier"] as const;
const CHECKLIST = [
  "Create your first sandbox API key",
  "Make your first API call",
  "Set up a webhook endpoint",
  "Receive and verify your first webhook",
  "Graduate to production",
];

export function Developers() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("API keys");
  const [checked, setChecked] = useState<number[]>([0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Developers</h1>
        <p className="mt-1 text-sm text-ink-500">Manage API keys, webhooks, and verify signatures.</p>
      </div>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-5 shadow-soft">
        <p className="mb-3 text-sm font-semibold text-ink-900">Onboarding checklist</p>
        <div className="space-y-2">
          {CHECKLIST.map((item, i) => (
            <label key={item} className="flex items-center gap-2.5 text-sm">
              <button
                onClick={() => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))}
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                  checked.includes(i) ? "border-success bg-success text-white" : "border-ink-900/20"
                }`}
              >
                {checked.includes(i) && <Check size={12} />}
              </button>
              <span className={checked.includes(i) ? "text-ink-400 line-through" : "text-ink-800"}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-1 rounded-xl bg-ink-900/[0.04] p-1 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold sm:flex-none ${
              tab === t ? "bg-white text-ink-900 shadow-soft" : "text-ink-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "API keys" && <ApiKeysTab />}
      {tab === "Webhooks" && <WebhooksTab />}
      {tab === "Signature verifier" && <SignatureVerifierTab />}
    </div>
  );
}

function ApiKeysTab() {
  const { pushToast } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-bold text-white hover:bg-cobalt-600"
        >
          <Plus size={15} /> Create new key
        </button>
      </div>
      <div className="overflow-hidden rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/6 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
              <th className="px-6 py-3">Label</th>
              <th className="px-6 py-3">Key</th>
              <th className="px-6 py-3">Environment</th>
              <th className="px-6 py-3">Last used</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/6">
            {API_KEYS.map((k) => (
              <tr key={k.id}>
                <td className="px-6 py-3.5 font-semibold text-ink-900">{k.label}</td>
                <td className="px-6 py-3.5 font-mono text-xs text-ink-500">
                  {k.env}_••••{k.last4}
                </td>
                <td className="px-6 py-3.5">
                  <StatusPill tone={k.env === "live" ? "info" : "neutral"} label={k.env} />
                </td>
                <td className="px-6 py-3.5 text-ink-400">{k.lastUsed}</td>
                <td className="px-6 py-3.5 text-right">
                  <button className="text-xs font-semibold text-danger">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={createOpen}
        title={revealed ? "Save your new key" : "Create API key"}
        onClose={() => {
          setCreateOpen(false);
          setRevealed(false);
        }}
        onConfirm={() => {
          if (!revealed) setRevealed(true);
          else {
            setCreateOpen(false);
            setRevealed(false);
            pushToast("success", "API key created.");
          }
        }}
        confirmLabel={revealed ? "I have saved this key" : "Create key"}
      >
        {!revealed ? (
          <div className="space-y-3">
            <input placeholder="Label (e.g. Payroll script)" className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none" />
            <select className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none">
              <option>Sandbox</option>
              <option>Live</option>
            </select>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 rounded-lg bg-ink-900/[0.04] px-3.5 py-2.5">
              <span className="flex-1 truncate font-mono text-xs text-ink-800">sk_sandbox_9f27a1c8b3e04d5f7a2c8901bf6e2d31</span>
              <Copy size={14} className="text-cobalt-600" />
            </div>
            <p className="mt-2 text-xs font-semibold text-warning">This is the only time we'll show this key.</p>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}

function WebhooksTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-bold text-white hover:bg-cobalt-600">
          <Plus size={15} /> Add endpoint
        </button>
      </div>
      <div className="space-y-3">
        {WEBHOOKS.map((w) => (
          <div key={w.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-ink-900/8 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-cobalt-500/10 text-cobalt-600">
                <Webhook size={16} />
              </span>
              <div>
                <p className="font-mono text-sm font-semibold text-ink-900">{w.url}</p>
                <p className="text-xs text-ink-500">{w.events} events subscribed · last delivery {w.lastDelivery}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill tone={w.env === "live" ? "info" : "neutral"} label={w.env} />
              <StatusPill tone="success" label={w.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignatureVerifierTab() {
  const [result, setResult] = useState<null | boolean>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-500">Payload</label>
        <textarea rows={4} className="w-full rounded-lg border border-ink-900/12 p-3 font-mono text-xs outline-none" defaultValue={`{"event":"payout.completed","id":"PO-3391"}`} />
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-500">X-Flow-Signature header</label>
        <input className="w-full rounded-lg border border-ink-900/12 p-3 font-mono text-xs outline-none" defaultValue="t=1735689600,v1=8f2c1a..." />
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-500">Secret</label>
        <input className="w-full rounded-lg border border-ink-900/12 p-3 font-mono text-xs outline-none" placeholder="whsec_••••" />
        <button
          onClick={() => setResult(Math.random() > 0.3)}
          className="mt-2 flex items-center gap-2 rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600"
        >
          <ShieldCheck size={15} /> Verify signature
        </button>
      </div>
      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">Result</p>
        {result === null ? (
          <p className="text-sm text-ink-400">Run a verification to see the step-by-step computation.</p>
        ) : result ? (
          <div>
            <StatusPill tone="success" label="Signature valid" />
            <ol className="mt-4 space-y-2 text-xs text-ink-600">
              <li>1. Extracted timestamp and v1 signature from header</li>
              <li>2. Built signed payload: <span className="font-mono">timestamp.payload</span></li>
              <li>3. Computed HMAC-SHA256 with your secret</li>
              <li>4. Computed signature matches header value ✓</li>
            </ol>
          </div>
        ) : (
          <div>
            <StatusPill tone="danger" label="Signature mismatch" />
            <p className="mt-3 text-xs text-ink-600">
              Likely cause: the secret doesn't match this endpoint, or the payload was modified before hashing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
