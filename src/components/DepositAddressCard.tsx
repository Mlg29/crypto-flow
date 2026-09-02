import { Check, Copy, QrCode } from "lucide-react";
import { useState } from "react";
import { ChainBadge } from "./ChainBadge";
import type { ChainId } from "../lib/types";
import { fmtAmount } from "../lib/data";

export function DepositAddressCard({
  address,
  chain,
  amount,
  symbol,
}: {
  address: string;
  chain: ChainId;
  amount?: number;
  symbol?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="rounded-xl2 border border-ink-900/8 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          Deposit address
        </span>
        <ChainBadge chain={chain} variant="pill" />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg border border-dashed border-ink-900/15 bg-ink-900/[0.03] text-ink-400">
          <QrCode size={40} strokeWidth={1.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="break-all rounded-lg bg-ink-900/[0.04] px-3 py-2.5 font-mono text-sm text-ink-800">
            {address}
          </div>
          <button
            onClick={copy}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt-600 hover:text-cobalt-700"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy address"}
          </button>
        </div>
      </div>

      {amount != null && (
        <div className="mt-4 rounded-lg border border-warning/25 bg-warning-light px-3 py-2.5 text-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-ink-700">Send exactly</span>
            <span className="font-mono text-base font-semibold text-ink-900">
              {fmtAmount(amount)} {symbol}
            </span>
          </div>
          <p className="mt-1 text-xs text-warning">
            Sending a different amount may delay or affect your order.
          </p>
        </div>
      )}
    </div>
  );
}
