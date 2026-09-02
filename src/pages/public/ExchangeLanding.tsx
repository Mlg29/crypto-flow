import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  BadgeCheck,
  Info,
  Lock,
  ShieldCheck,
  Star,
  Timer,
} from "lucide-react";
import { CHAIN_LIST, RATES, fmtAmount } from "../../lib/data";
import type { ChainId, OrderType } from "../../lib/types";
import { Countdown } from "../../components/Countdown";

const TABS: { id: OrderType; label: string }[] = [
  { id: "swap", label: "Swap" },
  { id: "buy", label: "Buy / Sell" },
];

export function ExchangeLanding() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<OrderType>("swap");
  const [fromChain, setFromChain] = useState<ChainId>("btc");
  const [toChain, setToChain] = useState<ChainId>("eth");
  const [fromAmount, setFromAmount] = useState("0.1");
  const [fixedRate, setFixedRate] = useState(true);
  const [rateKey, setRateKey] = useState(0);

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
      `/order/new?type=${tab}&from=${fromChain}&to=${toChain}&amount=${fromAmount || "0"}&fixed=${fixedRate}`
    );
  }

  return (
    <div className="relative overflow-hidden bg-ink-900">
      <div className="absolute inset-0 bg-meshViolet" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-20">
        <div className="animate-rise text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-orchid-300">
            <ShieldCheck size={13} /> No account, ever
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Crypto, moved.
            <br />
            No sign-up required.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
            Pick a pair, lock a rate, send from any wallet. Your funds go
            straight to your own address — we never hold a balance for you.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80">
              <BadgeCheck size={14} className="text-orchid-300" /> No hidden fees
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80">
              <Star size={14} className="text-orchid-300" /> Trusted since day one
            </span>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <Stat value="2.1M+" label="orders routed" />
            <Stat value="99.98%" label="uptime" />
            <Stat value="4" label="chains supported" />
          </div>
        </div>

        <div className="animate-rise rounded-xl2 border border-white/10 bg-white p-2 shadow-glowViolet" style={{ animationDelay: "80ms" }}>
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
              <CoinPicker value={fromChain} onChange={setFromChain} />
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
              You get
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-ink-900/10 bg-paper px-3 py-2.5">
              <span className="w-full truncate font-mono text-lg font-semibold text-ink-900">
                {fmtAmount(toAmount, 6)}
              </span>
              <CoinPicker value={toChain} onChange={setToChain} />
            </div>

            <div className="mt-3.5 flex items-center justify-between rounded-lg border border-ink-900/8 px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-700">
                Fixed rate
                <Info size={12} className="text-ink-400" />
              </span>
              <button
                onClick={() => setFixedRate((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition ${fixedRate ? "bg-orchid-500" : "bg-ink-900/15"}`}
                aria-pressed={fixedRate}
                aria-label="Toggle fixed rate mode"
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    fixedRate ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {fixedRate && (
              <p className="mt-1.5 px-0.5 text-[11px] leading-relaxed text-ink-400">
                Your rate is locked once you confirm — you'll get the agreed amount regardless of market movement.
              </p>
            )}

            <div className="mt-3.5">
              <Countdown key={rateKey} seconds={45} label="Rate updates in" onExpire={() => setRateKey((k) => k + 1)} />
            </div>

            <div className="mt-3.5 space-y-1.5 rounded-lg bg-ink-900/[0.03] px-3 py-2.5 text-xs text-ink-600">
              <div className="flex justify-between">
                <span>Rate</span>
                <span className="font-mono font-semibold text-ink-800">
                  1 {fromChain.toUpperCase()} ≈ {fmtAmount(rate, 4)} {toChain.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>All fees included</span>
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
              className="mt-4 w-full rounded-xl bg-orchid-500 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-orchid-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Exchange
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1"><Lock size={13} /> No custody</span>
              <span className="inline-flex items-center gap-1"><Timer size={13} /> ~1 min average</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-y border-white/10 bg-ink-950 px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
          <BigStat value="10M+" label="orders processed" />
          <BigStat value="$10B+" label="volume moved" />
          <BigStat value="4" label="chains, more soon" />
          <BigStat value="24/7" label="human support" />
        </div>
      </div>

      <div className="relative bg-ink-950 px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">How it works</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Choose your pair", body: "Pick what you're sending and receiving, and how much. Your rate locks once you confirm." },
              { title: "Make your deposit", body: "We generate a one-time address. Send exactly what's shown, from any wallet you like." },
              { title: "Receive your crypto", body: "We convert and broadcast straight to your destination address — nothing sits with us." },
            ].map((s, i) => (
              <div key={s.title} className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
                <span className="font-mono text-xs text-orchid-300">0{i + 1}</span>
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

function CoinPicker({ value, onChange }: { value: ChainId; onChange: (c: ChainId) => void }) {
  const c = CHAIN_LIST.find((x) => x.id === value)!;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ChainId)}
        className="peer absolute inset-0 cursor-pointer opacity-0"
      >
        {CHAIN_LIST.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.symbol}
          </option>
        ))}
      </select>
      <div className="pointer-events-none flex items-center gap-1.5 rounded-full border border-ink-900/10 bg-white px-2.5 py-1.5 text-sm font-bold text-ink-800 shadow-sm peer-hover:border-orchid-300">
        <span
          className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white"
          style={{ backgroundColor: c.color }}
        >
          {c.symbol[0]}
        </span>
        {c.symbol}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-white sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs text-white/45">{label}</p>
    </div>
  );
}
