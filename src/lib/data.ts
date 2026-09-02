import type {
  Chain,
  ChainId,
  Invoice,
  Payout,
  WalletBalance,
} from "./types";

export const CHAINS: Record<ChainId, Chain> = {
  btc: { id: "btc", name: "Bitcoin", symbol: "BTC", color: "#F7931A", network: "testnet" },
  eth: { id: "eth", name: "Ethereum", symbol: "ETH", color: "#6C8CFF", network: "testnet" },
  trx: { id: "trx", name: "Tron", symbol: "USDT-TRC20", color: "#C8102E", network: "testnet" },
  bsc: { id: "bsc", name: "BNB Chain", symbol: "USDT-BEP20", color: "#F0B90B", network: "testnet" },
};

export const CHAIN_LIST = Object.values(CHAINS);

export function fmtAmount(n: number, decimals = 6) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: Math.min(decimals, 2),
    maximumFractionDigits: decimals,
  });
}

export function fmtUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function shortAddr(addr: string, size = 6) {
  return `${addr.slice(0, size)}…${addr.slice(-size)}`;
}

export function randomAddress(chain: ChainId) {
  const prefixes: Record<ChainId, string> = {
    btc: "tb1q",
    eth: "0x",
    trx: "T",
    bsc: "0x",
  };
  const chars = "abcdef0123456789";
  let out = "";
  for (let i = 0; i < 34; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return prefixes[chain] + out;
}

export function randomClaimCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const group = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${group()}-${group()}-${group()}`;
}

export const RATES: Record<string, number> = {
  "btc-eth": 15.42,
  "eth-btc": 0.0648,
  "btc-trx": 62480,
  "eth-bsc": 620.2,
};

export const WALLET_BALANCES: WalletBalance[] = [
  { chain: "btc", available: 0.842, pending: 0.02, reserved: 0.01, fiatRate: 62480 },
  { chain: "eth", available: 6.318, pending: 0.15, reserved: 0.4, fiatRate: 3480 },
  { chain: "trx", available: 18420, pending: 0, reserved: 500, fiatRate: 1 },
  { chain: "bsc", available: 9210, pending: 120, reserved: 0, fiatRate: 1 },
];

export const INVOICES: Invoice[] = [
  {
    id: "INV-8841",
    amount: 420,
    chain: "trx",
    description: "Design retainer — September",
    customerEmail: "ada@northwind.io",
    status: "paid",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    expiresAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    address: randomAddress("trx"),
  },
  {
    id: "INV-8842",
    amount: 1200,
    chain: "eth",
    description: "Consulting — Q3 sprint",
    customerEmail: "finance@parallel.dev",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    expiresAt: Date.now() + 1000 * 60 * 60 * 19,
    address: randomAddress("eth"),
  },
  {
    id: "INV-8843",
    amount: 75,
    chain: "bsc",
    description: "API overage — August",
    status: "underpaid",
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    expiresAt: Date.now() - 1000 * 60 * 60 * 6,
    address: randomAddress("bsc"),
  },
  {
    id: "INV-8844",
    amount: 60,
    chain: "btc",
    description: "One-time onboarding fee",
    status: "expired",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    expiresAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    address: randomAddress("btc"),
  },
];

export const PAYOUTS: Payout[] = [
  {
    id: "PO-3391",
    kind: "single",
    destination: randomAddress("eth"),
    amount: 2.4,
    chain: "eth",
    status: "complete",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    txId: "0x9fa2…c81d",
  },
  {
    id: "PB-1042",
    kind: "bulk",
    destination: "247 recipients",
    amount: 41230,
    chain: "trx",
    status: "complete",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    recipients: 247,
  },
  {
    id: "PO-3392",
    kind: "single",
    destination: randomAddress("btc"),
    amount: 0.05,
    chain: "btc",
    status: "confirming",
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: "PB-1043",
    kind: "bulk",
    destination: "58 recipients",
    amount: 8600,
    chain: "bsc",
    status: "failed",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    recipients: 58,
  },
];

export const ACTIVITY_FEED = [
  { id: 1, label: "Invoice INV-8841 paid", chain: "trx" as ChainId, amount: 420, time: "2h ago", tone: "success" as const },
  { id: 2, label: "Payout PO-3391 completed", chain: "eth" as ChainId, amount: -2.4, time: "2h ago", tone: "success" as const },
  { id: 3, label: "Deposit received into wallet", chain: "btc" as ChainId, amount: 0.12, time: "6h ago", tone: "success" as const },
  { id: 4, label: "Bulk payout PB-1043 failed — 6 items", chain: "bsc" as ChainId, amount: -8600, time: "1d ago", tone: "danger" as const },
  { id: 5, label: "Webhook delivery retried", chain: "eth" as ChainId, amount: 0, time: "1d ago", tone: "neutral" as const },
];

export const ANALYTICS_VOLUME = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  BTC: Math.round(400 + Math.sin(i / 2) * 150 + Math.random() * 120),
  ETH: Math.round(600 + Math.cos(i / 3) * 200 + Math.random() * 150),
  USDT: Math.round(900 + Math.sin(i / 1.5) * 250 + Math.random() * 180),
}));

export const ANALYTICS_TOP_CURRENCIES = [
  { name: "USDT (TRC20)", value: 48200 },
  { name: "ETH", value: 31500 },
  { name: "BTC", value: 22900 },
  { name: "USDT (BEP20)", value: 11400 },
];

export const API_KEYS = [
  { id: "key_1", label: "Production backend", last4: "8f2c", env: "live" as const, created: "Jun 12, 2026", lastUsed: "3m ago" },
  { id: "key_2", label: "Payroll script", last4: "a913", env: "live" as const, created: "May 2, 2026", lastUsed: "2h ago" },
  { id: "key_3", label: "Local dev", last4: "44b1", env: "sandbox" as const, created: "Aug 20, 2026", lastUsed: "1d ago" },
];

export const WEBHOOKS = [
  { id: "wh_1", url: "https://api.northwind.io/hooks/cryptoflow", env: "live" as const, events: 6, status: "enabled" as const, lastDelivery: "4m ago" },
  { id: "wh_2", url: "https://staging.northwind.io/hooks/cf", env: "sandbox" as const, events: 3, status: "enabled" as const, lastDelivery: "1h ago" },
];
