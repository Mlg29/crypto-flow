import { useParams } from "react-router-dom";
import { Copy, Droplet, Send } from "lucide-react";
import { StatusPill } from "../../components/StatusPill";
import { CHAINS, WALLET_BALANCES, fmtAmount, fmtUsd, randomAddress } from "../../lib/data";
import type { ChainId } from "../../lib/types";
import { useApp } from "../../lib/AppContext";

const TX_TYPES = ["deposit", "payout", "fee", "swap"] as const;

export function WalletDetail() {
  const { chainId } = useParams();
  const chain = (chainId as ChainId) || "btc";
  const { env, pushToast } = useApp();
  const balance = WALLET_BALANCES.find((w) => w.chain === chain) ?? WALLET_BALANCES[0];
  const address = randomAddress(chain);

  const txs = Array.from({ length: 8 }, (_, i) => ({
    id: `TX-${1000 + i}`,
    type: TX_TYPES[i % TX_TYPES.length],
    amount: (i % 2 === 0 ? 1 : -1) * (0.02 + i * 0.011),
    status: i === 1 ? "pending" : "complete",
    time: `${i + 1}h ago`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: CHAINS[chain].color }}
          >
            {CHAINS[chain].symbol[0]}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-ink-900">
              {CHAINS[chain].name} {env === "sandbox" && <span className="text-ink-400">Testnet</span>}
            </h1>
            <p className="font-mono text-sm text-ink-500">
              {fmtAmount(balance.available, 4)} {CHAINS[chain].symbol} · {fmtUsd(balance.available * balance.fiatRate)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {env === "sandbox" && (
            <button
              onClick={() => pushToast("success", `Funded ${CHAINS[chain].symbol} wallet with testnet assets.`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sandbox/30 bg-sandbox-light px-3.5 py-2 text-sm font-semibold text-sandbox-dim"
            >
              <Droplet size={15} /> Fund with faucet
            </button>
          )}
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-cobalt-600">
            <Send size={15} /> Send payout
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="Available" value={`${fmtAmount(balance.available, 4)} ${CHAINS[chain].symbol}`} />
        <MiniStat label="Pending" value={`${fmtAmount(balance.pending, 4)} ${CHAINS[chain].symbol}`} />
        <MiniStat label="Reserved" value={`${fmtAmount(balance.reserved, 4)} ${CHAINS[chain].symbol}`} />
      </div>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-5 shadow-soft">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Deposit address</p>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-ink-900/[0.03] px-3.5 py-2.5">
          <span className="truncate font-mono text-sm text-ink-800">{address}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(address).catch(() => {});
              pushToast("info", "Address copied.");
            }}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-cobalt-600"
          >
            <Copy size={13} /> Copy
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
        <div className="border-b border-ink-900/6 px-6 py-4">
          <h2 className="font-display text-base font-semibold text-ink-900">Transaction history</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/6 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/6">
            {txs.map((t) => (
              <tr key={t.id} className="hover:bg-ink-900/[0.02]">
                <td className="px-6 py-3.5 capitalize text-ink-700">{t.type}</td>
                <td className={`px-6 py-3.5 font-mono font-semibold ${t.amount >= 0 ? "text-success" : "text-ink-900"}`}>
                  {t.amount >= 0 ? "+" : ""}
                  {fmtAmount(t.amount, 4)} {CHAINS[chain].symbol}
                </td>
                <td className="px-6 py-3.5">
                  <StatusPill tone={t.status === "pending" ? "warning" : "success"} label={t.status} />
                </td>
                <td className="px-6 py-3.5 text-ink-400">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl2 border border-ink-900/8 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1.5 font-mono text-lg font-bold text-ink-900">{value}</p>
    </div>
  );
}
