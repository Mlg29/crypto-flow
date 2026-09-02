import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ShieldCheck, Timer, Zap } from "lucide-react";
import { CHAIN_LIST, RATES, fmtAmount } from "../../lib/data";
import type { ChainId, OrderType } from "../../lib/types";

const TABS: { id: OrderType; label: string }[] = [
  { id: "swap", label: "Swap" },
  { id: "buy", label: "Buy" },
  { id: "sell", label: "Sell" },
];

export function ExchangeLanding() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<OrderType>("swap");
  const [fromChain, setFromChain] = useState<ChainId>("btc");
  const [toChain, setToChain] = useState<ChainId>("eth");
  const [fromAmount, setFromAmount] = useState("0.1");

  const rate = RATES[`${fromChain}-${toChain}`] ?? 1;
  const toAmount = useMemo(() => {
    const n = parseFloat(fromAmount);
    if (Number.isNaN(n)) return 0;
    return n * rate;
  }, [fromAmount, rate]);

  const minAmount = 0.001;
  const isValid = parseFloat(fromAmount || "0") >= minAmount;

  function startOrder() {
    navigate(
      `/order/new?type=${tab}&from=${fromChain}&to=${toChain}&amount=${fromAmount || "0"}`
    );
  }

  return (
    <div className="relative overflow-hidden bg-ink-900">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-24">
        <div className="animate-rise text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-sandbox">
            <Zap size={13} /> No account, no waiting
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Move crypto in minutes.
            <br />
            Nobody needs your name.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
            Swap, buy, or sell across four chains with a locked rate and a
            transparent fee — funds go straight to your own wallet. We're a
            pass-through, never a custodian.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-white/80">
            <div>
              <p className="font-display text-2xl font-bold text-white">2.1M+</p>
              <p className="text-xs text-white/50">orders routed</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">99.98%</p>
              <p className="text-xs text-white/50">uptime</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">4</p>
              <p className="text-xs text-white/50">chains supported</p>
            </div>
          </div>
        </div>

        <div className="animate-rise rounded-xl2 border border-white/10 bg-white p-2 shadow-glow" style={{ animationDelay: "80ms" }}>
          <div className="flex gap-1 rounded-xl bg-ink-900/[0.04] p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  tab === t.id ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              You send
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-ink-900/10 bg-paper px-3 py-2.5">
              <input
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal"
                className="w-full bg-transparent font-mono text-lg font-semibold text-ink-900 outline-none"
              />
              <select
                value={fromChain}
                onChange={(e) => setFromChain(e.target.value as ChainId)}
                className="cursor-pointer rounded-lg border border-ink-900/10 bg-white px-2 py-1.5 text-sm font-semibold text-ink-800 outline-none"
              >
                {CHAIN_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative my-3 flex justify-center">
              <button
                onClick={() => {
                  setFromChain(toChain);
                  setToChain(fromChain);
                }}
                className="grid h-9 w-9 place-items-center rounded-full border-4 border-white bg-ink-900 text-white shadow-soft hover:bg-ink-800"
                aria-label="Swap direction"
              >
                <ArrowLeftRight size={15} />
              </button>
            </div>

            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              You receive
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-ink-900/10 bg-paper px-3 py-2.5">
              <span className="w-full truncate font-mono text-lg font-semibold text-ink-900">
                {fmtAmount(toAmount, 6)}
              </span>
              <select
                value={toChain}
                onChange={(e) => setToChain(e.target.value as ChainId)}
                className="cursor-pointer rounded-lg border border-ink-900/10 bg-white px-2 py-1.5 text-sm font-semibold text-ink-800 outline-none"
              >
                {CHAIN_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-1.5 rounded-lg bg-ink-900/[0.03] px-3 py-2.5 text-xs text-ink-600">
              <div className="flex justify-between">
                <span>Rate</span>
                <span className="font-mono font-semibold text-ink-800">
                  1 {fromChain.toUpperCase()} ≈ {fmtAmount(rate, 4)} {toChain.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Network fee</span>
                <span className="font-mono font-semibold text-ink-800">~0.15%</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum</span>
                <span className="font-mono font-semibold text-ink-800">
                  {minAmount} {fromChain.toUpperCase()}
                </span>
              </div>
            </div>

            {!isValid && (
              <p className="mt-2 text-xs font-semibold text-danger">
                Enter at least {minAmount} {fromChain.toUpperCase()} to continue.
              </p>
            )}

            <button
              onClick={startOrder}
              disabled={!isValid}
              className="mt-4 w-full rounded-xl bg-cobalt-500 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-cobalt-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1"><ShieldCheck size={13} /> No custody</span>
              <span className="inline-flex items-center gap-1"><Timer size={13} /> 60s rate lock</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-ink-950 px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">How it works</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Lock your rate", body: "Pick a pair and amount. Your rate holds for 60 seconds after you confirm." },
              { title: "Send your deposit", body: "We generate a one-time address. Send exactly what's shown, from any wallet." },
              { title: "Funds arrive", body: "We convert and broadcast straight to your destination address — nothing sits with us." },
            ].map((s, i) => (
              <div key={s.title} className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
                <span className="font-mono text-xs text-sandbox">0{i + 1}</span>
                <h3 className="mt-2 font-display text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
