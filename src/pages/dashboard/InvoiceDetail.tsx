import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Mail } from "lucide-react";
import { ChainBadge } from "../../components/ChainBadge";
import { StatusPill } from "../../components/StatusPill";
import { StatusStepper } from "../../components/StatusStepper";
import { INVOICES, fmtUsd } from "../../lib/data";
import { useApp } from "../../lib/AppContext";
import type { InvoiceStatus } from "../../lib/types";

const STATUS_TONE: Record<InvoiceStatus, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  overpaid: "success",
  underpaid: "danger",
  expired: "neutral",
  cancelled: "neutral",
};

const STEPS = ["Pending", "Detected", "Confirmed", "Paid"];
const stepIndex: Record<InvoiceStatus, number> = {
  pending: 0,
  underpaid: 1,
  overpaid: 2,
  paid: 3,
  expired: 0,
  cancelled: 0,
};

export function InvoiceDetail() {
  const { invoiceId } = useParams();
  const { pushToast } = useApp();
  const invoice = INVOICES.find((i) => i.id === invoiceId) ?? INVOICES[0];
  const link = `cryptoflow.example/pay/${invoice.id}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/dashboard/invoices" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back to invoices
      </Link>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-sm text-ink-400">{invoice.id}</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink-900">{fmtUsd(invoice.amount)}</p>
            <p className="mt-1 text-sm text-ink-500">{invoice.description}</p>
          </div>
          <StatusPill tone={STATUS_TONE[invoice.status]} label={invoice.status} />
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg bg-ink-900/[0.03] px-3.5 py-2.5">
          <span className="flex-1 truncate font-mono text-xs text-ink-700">{link}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(link).catch(() => {});
              pushToast("info", "Payment link copied.");
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-cobalt-600"
          >
            <Copy size={13} /> Copy
          </button>
          <button className="inline-flex items-center gap-1 text-xs font-semibold text-cobalt-600">
            <Mail size={13} /> Send by email
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm text-ink-600">
          <span>Chain</span>
          <ChainBadge chain={invoice.chain} variant="pill" />
        </div>
      </div>

      {invoice.status !== "expired" && invoice.status !== "cancelled" && (
        <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
          <p className="mb-4 text-sm font-semibold text-ink-900">Payment progress</p>
          <StatusStepper steps={STEPS} currentIndex={stepIndex[invoice.status]} />
        </div>
      )}

      {invoice.status === "pending" && (
        <button className="w-full rounded-xl border border-danger/25 py-3 text-sm font-bold text-danger hover:bg-danger-light">
          Cancel invoice
        </button>
      )}
    </div>
  );
}
