import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, FileText, Plus, Send, Wallet } from "lucide-react";
import { ACTIVITY_FEED, CHAINS, WALLET_BALANCES, fmtAmount, fmtUsd } from "../../lib/data";

export function DashboardHome() {
  const totalUsd = WALLET_BALANCES.reduce((sum, w) => sum + w.available * w.fiatRate, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Good afternoon, Northwind</h1>
        <p className="mt-1 text-sm text-ink-500">Here's what's happening across your wallets today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total balance" value={fmtUsd(totalUsd)} sub="Across 4 chains" />
        <SummaryCard label="Transactions this week" value="86" sub="+12% vs last week" trend="up" />
        <SummaryCard label="Pending payouts" value="3" sub="$4,120 queued" />
        <SummaryCard label="Open invoices" value="2" sub="$1,275 outstanding" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-ink-900/6 px-6 py-4">
            <h2 className="font-display text-base font-semibold text-ink-900">Wallets</h2>
            <Link to="/dashboard/payouts" className="text-xs font-semibold text-cobalt-600">
              Send payout
            </Link>
          </div>
          <div className="divide-y divide-ink-900/6">
            {WALLET_BALANCES.map((w) => (
              <Link
                key={w.chain}
                to={`/dashboard/wallets/${w.chain}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-ink-900/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: CHAINS[w.chain].color }}
                  >
                    {CHAINS[w.chain].symbol[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{CHAINS[w.chain].name}</p>
                    <p className="text-xs text-ink-500">{CHAINS[w.chain].symbol} · testnet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-ink-900">
                    {fmtAmount(w.available, 4)} {CHAINS[w.chain].symbol}
                  </p>
                  <p className="text-xs text-ink-400">{fmtUsd(w.available * w.fiatRate)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
          <div className="border-b border-ink-900/6 px-6 py-4">
            <h2 className="font-display text-base font-semibold text-ink-900">Recent activity</h2>
          </div>
          <div className="divide-y divide-ink-900/6">
            {ACTIVITY_FEED.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-6 py-3.5">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                    a.tone === "success"
                      ? "bg-success-light text-success"
                      : a.tone === "danger"
                      ? "bg-danger-light text-danger"
                      : "bg-ink-900/5 text-ink-500"
                  }`}
                >
                  {a.amount >= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-800">{a.label}</p>
                  <p className="text-xs text-ink-400">{a.time}</p>
                </div>
                {a.amount !== 0 && (
                  <span className="shrink-0 font-mono text-xs font-semibold text-ink-700">
                    {a.amount > 0 ? "+" : ""}
                    {fmtAmount(a.amount, 2)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-display text-base font-semibold text-ink-900">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickAction to="/dashboard/invoices/new" icon={<FileText size={17} />} label="Create invoice" />
          <QuickAction to="/dashboard/payouts" icon={<Send size={17} />} label="Send payout" />
          <QuickAction to="/dashboard/wallets/btc" icon={<Wallet size={17} />} label="View wallets" />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-xl2 border border-ink-900/8 bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-2 font-mono text-2xl font-bold text-ink-900">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-success" : "text-ink-400"}`}>
        {trend === "up" && <ArrowUpRight size={12} />}
        {sub}
      </p>
    </div>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-ink-900/8 px-4 py-3.5 text-sm font-semibold text-ink-800 hover:border-cobalt-300 hover:bg-cobalt-500/5"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-cobalt-500/10 text-cobalt-600">
        {icon}
      </span>
      {label}
      <Plus size={14} className="ml-auto text-ink-300" />
    </Link>
  );
}
