/**
 * All homepage copy lives here so marketing can edit it without touching layout.
 * Items marked [PLACEHOLDER] must be replaced or confirmed before launch (see docs/website/06-content.md).
 */
import type { IconName } from "@/components/ui/icons";

export const nav = {
  links: [
    { label: "Platform", href: "/platform" },
    { label: "Exchange", href: "/exchange" },
    { label: "Security", href: "/security" },
    { label: "Developers", href: "/developers" },
    { label: "Use cases", href: "/use-cases" },
  ],
  login: { label: "Log in", href: "/login" },
  create: { label: "Become a merchant", href: "/create-merchant" },
};

export const hero = {
  titleLead: "Exchange and settle",
  titleAccent: "digital assets.",
  sub: "Secure, privacy-conscious infrastructure for business.",
};

export const assets = [
  { symbol: "USDT", network: "Tron" },
  { symbol: "USDT", network: "Ethereum" },
  { symbol: "USDC", network: "Base" },
  { symbol: "USDC", network: "Solana" },
  { symbol: "BTC" },
  { symbol: "ETH" },
  { symbol: "BNB", network: "BNB Chain" },
  { symbol: "SOL" },
  { symbol: "cNGN", network: "Base" },
  { symbol: "POL", network: "Polygon" },
];

export const pillars = [
  { n: "01", title: "Exchange", dark: false, body: "Convert between stablecoins, crypto and local currency at firm, locked rates.", points: ["Desk and API quotes", "Large-ticket OTC handling", "Transparent spreads"] },
  { n: "02", title: "Settle", dark: true, body: "Settle to your treasury wallet or bank account on your schedule, fully reconciled.", points: ["Scheduled and on-demand sweeps", "Automatic reconciliation", "On-chain proof for every settlement"] },
  { n: "03", title: "Pay out", dark: false, body: "Collect with invoices and payment links, then pay suppliers and teams in bulk.", points: ["Invoices and payment links", "Bulk payouts by CSV or API", "Each recipient on their network"] },
];

export const exchange = {
  title: "Firm quotes, fast settlement, no surprises.",
  body: "Convert between stablecoins, crypto and local currency from the desk or by API. The rate you accept is the rate you settle at.",
  points: [
    "Quotes held for 30 seconds, then refreshed. No silent repricing.",
    "Dedicated desk support for large and recurring conversions.",
    "Every trade screened and recorded with its on-chain hash.",
    "Settle the proceeds to a wallet or bank account in one step.",
  ],
};

export const privacy: { title: string; body: string; icon: IconName }[] = [
  { title: "Data minimisation", body: "We collect what regulation requires to verify your business, and nothing more.", icon: "shield" },
  { title: "Segregated addresses", body: "Dedicated deposit and settlement addresses keep your treasury out of your counterparties’ view.", icon: "wallet" },
  { title: "Least-privilege access", body: "Role-based permissions, approvals and audit logs for every action your team takes.", icon: "lock" },
  { title: "Screened, not shared", body: "Every address is screened against sanctions lists. Your data is never sold or used for marketing.", icon: "eye" },
];

export const features = [
  { title: "Locked-rate exchange", body: "Quote, lock and convert across major coins and stablecoins, from the desk or by API." },
  { title: "Invoices and payment links", body: "Bill customers in USDT or USDC and reconcile payments automatically." },
  { title: "Bulk payouts", body: "Pay suppliers, contractors or partners in one CSV upload or API call." },
  { title: "Flexible settlement", body: "Hold stablecoins, convert to local currency, or sweep to your bank on a schedule." },
  { title: "AML and sanctions screening", body: "Every incoming and outgoing address is checked before funds move." },
  { title: "Multi-chain by default", body: "Tron, Ethereum, Base, BNB Chain, Solana and Polygon behind one integration." },
];

export const steps = [
  { n: "01", title: "Get approved fast", body: "Complete KYB once and get a decision quickly. We ask only for what regulation requires." },
  { n: "02", title: "Connect", body: "Use the dashboard, or integrate the API against the testnet sandbox first." },
  { n: "03", title: "Exchange and settle", body: "Go live with firm quotes, payouts and settlement to your wallet or bank." },
];

export const api = [
  { tag: "Quotes", title: "Firm, lockable rates", body: "Request a quote for any supported pair and hold it for 30 seconds." },
  { tag: "Exchanges", title: "Convert in one call", body: "Execute against a quote and receive the result by webhook." },
  { tag: "Payouts", title: "Single and bulk", body: "Send to one recipient or thousands, each on their preferred network." },
  { tag: "Settlements", title: "Wallet or bank", body: "Sweep balances out on demand or on a schedule, with reconciliation data." },
];

export const useCases = [
  { n: "01", title: "Cross-border B2B", body: "Pay and get paid by partners abroad without correspondent banking delays." },
  { n: "02", title: "Treasury conversion", body: "Move between stablecoins and local currency at firm rates." },
  { n: "03", title: "Contractor payouts", body: "Pay distributed teams in USDT or USDC on the day, in one batch." },
  { n: "04", title: "Merchant collections", body: "Accept stablecoins from customers and settle how you choose." },
];

export const footer = {
  blurb: "Secure, privacy-conscious infrastructure to exchange and settle digital assets.",
  columns: [
    { head: "Platform", links: ["Exchange", "Settlement", "Payouts", "Invoicing"] },
    { head: "Developers", links: ["API reference", "Sandbox", "Webhooks", "Status"] },
    { head: "Company", links: ["About", "Careers", "Contact", "Blog"] },
    { head: "Legal", links: ["Terms", "Privacy", "AML policy", "Cookies"] },
  ],
  legal: "© 2026 CryptoFlow. [PLACEHOLDER: legal entity and registration]",
  disclosure: "Digital assets are volatile. [PLACEHOLDER: regulatory disclosure]",
};
