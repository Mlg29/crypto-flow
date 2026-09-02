import { useState } from "react";
import { Download } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ANALYTICS_TOP_CURRENCIES, ANALYTICS_VOLUME, fmtUsd } from "../../lib/data";

const RANGES = ["7d", "30d", "90d"] as const;

export function Analytics() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("30d");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Analytics</h1>
          <p className="mt-1 text-sm text-ink-500">Volume, currencies, and payout activity over time.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg bg-ink-900/[0.04] p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1.5 text-xs font-bold ${
                  range === r ? "bg-white text-ink-900 shadow-soft" : "text-ink-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <MiniStat label="Total volume" value={fmtUsd(112400)} />
        <MiniStat label="Avg transaction" value={fmtUsd(486)} />
        <MiniStat label="Fee revenue" value={fmtUsd(1284)} />
        <MiniStat label="Settlement time (p50)" value="4m 20s" />
      </div>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <p className="mb-4 font-display text-base font-semibold text-ink-900">Volume over time, by chain</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={ANALYTICS_VOLUME}>
            <defs>
              <linearGradient id="btcFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7931A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#F7931A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ethFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3D63F5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3D63F5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="usdtFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0FBFA8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0FBFA8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0B122010" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#7C88A6" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#7C88A6" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E7E9F2", fontSize: 12 }} />
            <Area type="monotone" dataKey="BTC" stroke="#F7931A" fill="url(#btcFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="ETH" stroke="#3D63F5" fill="url(#ethFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="USDT" stroke="#0FBFA8" fill="url(#usdtFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
          <p className="mb-4 font-display text-base font-semibold text-ink-900">Top currencies by volume</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ANALYTICS_TOP_CURRENCIES} layout="vertical" margin={{ left: 24 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#33477A" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E7E9F2", fontSize: 12 }} />
              <Bar dataKey="value" fill="#3D63F5" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
          <p className="mb-4 font-display text-base font-semibold text-ink-900">Top recipients (payouts)</p>
          <div className="space-y-3">
            {["payroll-bulk-247", "0x2ab…91c0", "TQn8…88aA", "0x9c1…4fd2"].map((r, i) => (
              <div key={r} className="flex items-center justify-between text-sm">
                <span className="font-mono text-ink-700">{r}</span>
                <span className="font-mono font-semibold text-ink-900">{fmtUsd(9200 - i * 1800)}</span>
              </div>
            ))}
          </div>
        </div>
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
