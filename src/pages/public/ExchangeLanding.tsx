import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Code2,
  Database,
  EyeOff,
  FileText,
  FlaskConical,
  Info,
  Key,
  Lock,
  RefreshCw,
  Send,
  ShieldCheck,
  Star,
  Timer,
  Users,
  Wallet,
  Webhook,
} from "lucide-react";
import { CHAIN_LIST, CHAINS, RATES, RECENT_ORDERS, REVIEWS, fmtAmount } from "../../lib/data";
import type { ChainId, OrderType } from "../../lib/types";
import { Countdown } from "../../components/Countdown";
import { ChainBadge } from "../../components/ChainBadge";

const TABS: { id: OrderType; label: string }[] = [
  { id: "swap", label: "Swap" },
  { id: "buy", label: "Buy / Sell" },
];

const EXCHANGE_FEATURES = [
  {
    icon: EyeOff,
    title: "No account, no KYC",
    body: "We don't collect personal information. No email, no ID — just a destination address.",
  },
  {
    icon: Wallet,
    title: "Non-custodial by design",
    body: "Funds go directly from your wallet to your destination. We never hold a balance on your behalf.",
  },
  {
    icon: RefreshCw,
    title: "Rate locked on confirm",
    body: "When you choose a fixed rate, your quoted amount is locked the moment you confirm the order.",
  },
  {
    icon: Key,
    title: "One-time deposit addresses",
    body: "Every order gets a unique deposit address, generated fresh and used once.",
  },
  {
    icon: Lock,
    title: "Track orders without logging in",
    body: "Your recovery code is your only identifier. Use it to check order status any time — no account needed.",
  },
  {
    icon: ArrowLeftRight,
    title: "Swap, Buy, or Sell",
    body: "Exchange between supported chains in either direction, or buy and sell using your preferred asset.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose your pair",
    body: "Select what you're sending and what you want to receive. Enter your amount and choose a fixed or floating rate.",
  },
  {
    step: "02",
    title: "Send your deposit",
    body: "We generate a one-time deposit address. Send exactly what's shown from any wallet you control — no registration required.",
  },
  {
    step: "03",
    title: "Save your recovery code",
    body: "You'll receive a unique code that lets you track your order at any time, without an account or login.",
  },
  {
    step: "04",
    title: "Receive your crypto",
    body: "Once your deposit is confirmed on-chain, we convert and send directly to your destination address.",
  },
];

const MERCHANT_FEATURES = [
  {
    icon: Database,
    title: "Multi-chain custodial wallets",
    body: "Managed wallets for BTC, ETH, USDT-TRC20, and USDT-BEP20 — balances, pending, and reserved all in one view.",
  },
  {
    icon: FileText,
    title: "Invoice payments",
    body: "Generate shareable payment links for any amount and supported chain. Track pending, paid, and expired states in real time.",
  },
  {
    icon: Send,
    title: "Single payouts",
    body: "Send from any custodial wallet to an external address, with a fee estimate and confirmation step before broadcast.",
  },
  {
    icon: ArrowRight,
    title: "Bulk payouts",
    body: "Upload a CSV, validate every row before committing, and broadcast to hundreds of recipients across chains in one batch.",
  },
  {
    icon: Code2,
    title: "Full REST API",
    body: "Programmatic access to wallets, invoices, payouts, and webhooks. Sandbox and live environments, clearly separated.",
  },
  {
    icon: Webhook,
    title: "Signed webhooks",
    body: "Receive real-time event notifications. Every delivery is signed with HMAC-SHA256 so you can verify authenticity.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    body: "Volume charts, top currencies by value, and a full transaction feed — always up to date across all your wallets.",
  },
  {
    icon: Users,
    title: "Team access controls",
    body: "Two-factor authentication, role-based permissions, and payout whitelisting to keep your team and funds secure.",
  },
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

      {/* ── Hero ── */}
      <div className="absolute inset-0 bg-meshViolet" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1fr_460px] lg:items-center lg:gap-16 lg:pt-24">

        <div className="animate-rise text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-orchid-300">
            <ShieldCheck size={13} /> Anonymous Exchange
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-[3.75rem]">
            Swap crypto
            <br />
            <span className="text-orchid-300">privately.</span>
          </h1>
          <p className="mt-5 max-w-[26rem] text-lg leading-relaxed text-white/65">
            Pick a pair, lock a rate, and send from any wallet you control. Your funds go
            directly to your own address — we never hold a balance on your behalf.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <TrustPill icon={<BadgeCheck size={13} />} label="All fees shown upfront" />
            <TrustPill icon={<Lock size={13} />} label="Zero-custody design" />
            <TrustPill icon={<EyeOff size={13} />} label="No personal data collected" />
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            <HeroStat value="2.1M+" label="Swaps completed" />
            <HeroStat value="99.98%" label="Uptime" />
            <HeroStat value="4" label="Chains" />
          </div>
        </div>

        {/* Exchange widget */}
        <div
          className="animate-rise rounded-2xl border border-white/10 bg-white p-2 shadow-glowViolet"
          style={{ animationDelay: "80ms" }}
        >
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
                onClick={() => { setFromChain(toChain); setToChain(fromChain); }}
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
                Fixed rate <Info size={12} className="text-ink-400" />
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
                Your rate is locked once you confirm — you receive the quoted amount as long as your deposit arrives within the rate lock window.
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
              Start swap
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1"><Lock size={13} /> No custody, ever</span>
              <span className="inline-flex items-center gap-1"><Timer size={13} /> Typically ~1 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live ticker ── */}
      <div className="relative border-y border-white/10 bg-ink-950 px-5 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-hidden">
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-orchid-300">
            <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-orchid-400" /> LIVE
          </span>
          <div className="flex flex-1 gap-6 overflow-x-auto text-xs text-white/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RECENT_ORDERS.map((o, i) => (
              <span key={i} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                <ChainBadge chain={o.from} variant="icon" />
                <span className="font-mono text-white/70">{o.amount}</span>
                <span>→</span>
                <ChainBadge chain={o.to} variant="icon" />
                <span className="text-white/30">· {o.time}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Anonymous Exchange features ── */}
      <div className="relative border-b border-white/10 bg-ink-950 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Anonymous Exchange</p>
              <p className="mb-5 font-display text-2xl font-bold text-white">Your control. Your keys. Your funds.</p>
              <p className="text-sm leading-relaxed text-white/55">
                Built from the ground up for privacy. No accounts, no tracking, no custody — just your wallet, your rate, and your destination address.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=460&fit=crop&q=80&auto=format"
                alt="Secure blockchain network visualization"
                className="w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink-950/50 via-transparent to-transparent" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXCHANGE_FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-orchid-500/10 text-orchid-300">
                  <f.icon size={18} strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-sm font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="relative border-b border-white/10 bg-ink-950 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-4">
            <BigStat value="10M+" label="Swaps processed" />
            <BigStat value="$10B+" label="Volume exchanged" />
            <BigStat value="4" label="Chains supported" />
            <BigStat value="24/7" label="Live human support" />
          </dl>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="relative border-b border-white/10 bg-ink-950 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">How it works</p>
              <p className="mb-10 font-display text-2xl font-bold text-white">Four steps. No account.</p>
              <div className="grid gap-8 sm:grid-cols-2">
                {HOW_IT_WORKS.map((s) => (
                  <div key={s.step}>
                    <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-orchid-500/12 font-mono text-sm font-bold text-orchid-300">
                      {s.step}
                    </span>
                    <h3 className="font-display text-base font-bold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
              <img
                src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=700&h=720&fit=crop&q=80&auto=format"
                alt="Crypto exchange on mobile"
                className="w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Supported chains ── */}
      <div className="relative border-b border-white/10 bg-ink-950 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-white/40">Supported chains</p>
          <div className="flex flex-wrap gap-3">
            {CHAIN_LIST.map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80"
              >
                <span
                  className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.symbol[0]}
                </span>
                {CHAINS[c.id].name}
              </span>
            ))}
            <span className="flex items-center rounded-full border border-dashed border-white/15 px-4 py-2 text-sm font-medium text-white/35">
              More coming
            </span>
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="relative border-b border-white/10 bg-ink-950 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">What users say</p>
          <p className="mb-8 font-display text-2xl font-bold text-white">Trusted by privacy-conscious users.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                <div className="flex gap-0.5 text-orchid-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/70">"{r.text}"</p>
                <p className="mt-4 text-xs font-semibold text-white/35">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Merchant Platform features ── */}
      <div className="relative border-b border-white/10 bg-ink-950 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid items-center gap-10 lg:grid-cols-[480px_1fr] lg:gap-16">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Merchant Platform</p>
              <p className="mb-5 font-display text-2xl font-bold text-white">
                Everything your business needs
                <br />
                to accept and send crypto.
              </p>
              <p className="text-sm leading-relaxed text-white/50">
                Built for teams that move value across chains every day — from a single payout to hundreds at once.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=520&fit=crop&q=80&auto=format"
                alt="Merchant analytics dashboard"
                className="w-full object-cover opacity-85"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent to-ink-950/30" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MERCHANT_FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-cobalt-500/10 text-cobalt-400">
                  <f.icon size={18} strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-sm font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cobalt-500/12 text-cobalt-400">
                <FlaskConical size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Sandbox environment included</p>
                <p className="mt-0.5 text-xs text-white/50">Test your entire integration with testnet assets before going live. Sandbox and production endpoints are always clearly labeled.</p>
              </div>
            </div>
            <Link
              to="/onboarding/signup"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cobalt-500 px-5 py-3 text-sm font-bold text-white hover:bg-cobalt-600"
            >
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── API & Developer Docs ── */}
      <div className="relative border-b border-white/10 bg-ink-950 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">API & Developer docs</p>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="font-display text-2xl font-bold text-white">
                Integrate in days,
                <br />
                not weeks.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
                The CryptoFlow API gives you programmatic control over wallets, invoices, payouts, and webhooks. Every endpoint is versioned, every response is consistent, and sandbox endpoints are always clearly separated from production.
              </p>
              <ul className="mt-7 space-y-4">
                {[
                  { label: "Wallets API", desc: "Read balances, pending amounts, and reserved funds across all supported chains." },
                  { label: "Invoices API", desc: "Create, retrieve, and expire invoices. Receive a ready-to-share payment URL in the response." },
                  { label: "Payouts API", desc: "Send a single payout or submit a bulk batch — single request, multi-chain support." },
                  { label: "Webhooks", desc: "Subscribe to payment and payout events. Every delivery is signed with HMAC-SHA256 for verification." },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt-400" />
                    <div>
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                      <p className="mt-0.5 text-sm text-white/45">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-cobalt-500 px-5 py-3 text-sm font-bold text-white hover:bg-cobalt-600"
                >
                  View API docs <ArrowRight size={15} />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/5"
                >
                  Download OpenAPI spec
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d0f14] p-6 font-mono text-xs leading-relaxed">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="rounded bg-cobalt-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cobalt-300">v1</span>
                <span className="text-white/35">POST /v1/invoices</span>
              </div>

              <div className="space-y-1 text-white/55">
                <p>
                  <span className="text-orchid-300">Authorization</span>
                  <span className="text-white/30">: </span>
                  <span className="text-white/75">Bearer sk_live_••••8f2c</span>
                </p>
                <p>
                  <span className="text-orchid-300">Content-Type</span>
                  <span className="text-white/30">: </span>
                  <span className="text-white/75">application/json</span>
                </p>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-white/30">{"{"}</p>
                <p className="pl-4">
                  <span className="text-cobalt-300">"amount"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-white/80">420</span>
                  <span className="text-white/30">,</span>
                </p>
                <p className="pl-4">
                  <span className="text-cobalt-300">"chain"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-orchid-200">"trx"</span>
                  <span className="text-white/30">,</span>
                </p>
                <p className="pl-4">
                  <span className="text-cobalt-300">"description"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-orchid-200">"Design retainer — September"</span>
                  <span className="text-white/30">,</span>
                </p>
                <p className="pl-4">
                  <span className="text-cobalt-300">"customer_email"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-orchid-200">"ada@northwind.io"</span>
                </p>
                <p className="text-white/30">{"}"}</p>
              </div>

              <div className="mt-5 border-t border-white/8 pt-5">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Response · 201 Created</p>
                <div className="space-y-1">
                  <p className="text-white/30">{"{"}</p>
                  <p className="pl-4">
                    <span className="text-cobalt-300">"id"</span>
                    <span className="text-white/30">: </span>
                    <span className="text-orchid-200">"INV-8841"</span>
                    <span className="text-white/30">,</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-cobalt-300">"status"</span>
                    <span className="text-white/30">: </span>
                    <span className="text-orchid-200">"pending"</span>
                    <span className="text-white/30">,</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-cobalt-300">"payment_url"</span>
                    <span className="text-white/30">: </span>
                    <span className="text-orchid-200">"https://pay.cryptoflow/INV-8841"</span>
                  </p>
                  <p className="text-white/30">{"}"}</p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-3">
                <FlaskConical size={12} className="mt-0.5 shrink-0 text-white/35" />
                <p className="text-[10px] leading-relaxed text-white/40">
                  Use <span className="font-semibold text-white/60">sk_sandbox_</span> keys to test against the sandbox environment. Sandbox and production endpoints are always labeled separately throughout the docs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Merchant Platform CTA ── */}
      <div className="relative bg-ink-950 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cobalt-500/15 text-cobalt-400">
                <Building2 size={22} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-white">Ready to get started with the Merchant Platform?</p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/55">
                  Create your account, complete business verification, and go live — or explore everything in sandbox first with no risk.
                </p>
              </div>
            </div>
            <Link
              to="/onboarding/signup"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cobalt-500 px-5 py-3 text-sm font-bold text-white hover:bg-cobalt-600"
            >
              Create merchant account <ArrowRight size={15} />
            </Link>
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

function TrustPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80">
      <span className="text-orchid-300">{icon}</span>
      {label}
    </span>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-white/50">{label}</p>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ink-950 py-8 text-center">
      <p className="font-display text-3xl font-bold text-white sm:text-4xl">{value}</p>
      <p className="mt-1.5 text-xs text-white/45">{label}</p>
    </div>
  );
}
