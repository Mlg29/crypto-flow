import { CHAINS } from "../lib/data";
import type { ChainId } from "../lib/types";

export function ChainBadge({
  chain,
  variant = "full",
  network,
}: {
  chain: ChainId;
  variant?: "full" | "icon" | "pill";
  network?: "mainnet" | "testnet";
}) {
  const c = CHAINS[chain];
  const net = network ?? c.network;

  const dot = (
    <span
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
      style={{ backgroundColor: c.color }}
      aria-hidden
    >
      {c.symbol[0]}
    </span>
  );

  if (variant === "icon") {
    return (
      <span title={`${c.name} (${net})`} className="inline-flex">
        {dot}
      </span>
    );
  }

  if (variant === "pill") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 bg-white px-2.5 py-1 text-xs font-semibold text-ink-800 shadow-sm">
        {dot}
        {c.symbol}
        <span
          className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
            net === "testnet" ? "bg-sandbox-light text-sandbox-dim" : "bg-ink-900/5 text-ink-600"
          }`}
        >
          {net}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800">
      {dot}
      {c.symbol}
    </span>
  );
}
