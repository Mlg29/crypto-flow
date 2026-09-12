import { useParams } from "react-router-dom";
import { Waves } from "lucide-react";
import { DepositAddressCard } from "../../components/DepositAddressCard";
import { StatusStepper } from "../../components/StatusStepper";
import { Countdown } from "../../components/Countdown";
import { INVOICES, fmtUsd, randomAddress } from "../../lib/data";

const STEPS = ["Pending", "Detected", "Confirmed", "Paid"];

export function InvoicePay() {
  const { invoiceId } = useParams();
  const invoice = INVOICES.find((i) => i.id === invoiceId) ?? INVOICES[1];
  const address = randomAddress(invoice.chain);
  const stageMap: Record<string, number> = { pending: 0, underpaid: 1, overpaid: 2, paid: 3, expired: 0, cancelled: 0 };

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-lg px-5 py-10 sm:px-8">
        <div className="mb-6 flex items-center gap-2.5 rounded-xl2 border border-ink-900/8 bg-white p-4 shadow-soft">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink-900 text-sandbox">
            <Waves size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">Northwind Studio</p>
            <p className="text-xs text-ink-500">requesting payment</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl2 border border-ink-900/8 bg-white p-6 text-center shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Amount due</p>
          <p className="mt-1 font-mono text-3xl font-bold text-ink-900">{fmtUsd(invoice.amount)}</p>
          <p className="mt-1 text-sm text-ink-500">{invoice.description}</p>
          <p className="mt-2 font-mono text-xs text-ink-400">Invoice {invoice.id}</p>
        </div>

        {invoice.status === "expired" ? (
          <div className="rounded-xl2 border border-ink-900/8 bg-white p-8 text-center shadow-soft">
            <p className="font-display text-lg font-bold text-ink-900">This invoice has expired</p>
            <p className="mt-2 text-sm text-ink-500">Ask Northwind Studio to send a new payment link.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <Countdown seconds={1200} label="Time remaining" />
            </div>
            <DepositAddressCard address={address} chain={invoice.chain} amount={invoice.amount / 62480} symbol={invoice.chain.toUpperCase()} />
            <div className="mt-4 rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
              <StatusStepper steps={STEPS} currentIndex={stageMap[invoice.status] ?? 0} />
            </div>
          </>
        )}

        <p className="mt-6 text-center text-xs text-ink-400">
          This payment is processed by CryptoFlow · Questions? Use the chat icon in the corner.
        </p>
      </div>
    </div>
  );
}
