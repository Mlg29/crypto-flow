import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Plus, Search } from "lucide-react";
import { ChainBadge } from "../../components/ChainBadge";
import { StatusPill } from "../../components/StatusPill";
import { INVOICES, fmtUsd } from "../../lib/data";
import type { InvoiceStatus } from "../../lib/types";

const STATUS_TONE: Record<InvoiceStatus, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  overpaid: "success",
  underpaid: "danger",
  expired: "neutral",
  cancelled: "neutral",
};

const FILTERS: (InvoiceStatus | "all")[] = ["all", "pending", "paid", "underpaid", "expired"];

export function Invoices() {
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all");
  const list = INVOICES.filter((i) => filter === "all" || i.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Invoices</h1>
          <p className="mt-1 text-sm text-ink-500">Create and track payment requests to your customers.</p>
        </div>
        <Link
          to="/dashboard/invoices/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600"
        >
          <Plus size={16} /> Create invoice
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
              filter === f ? "bg-ink-900 text-white" : "bg-white text-ink-600 border border-ink-900/10"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5">
          <Search size={14} className="text-ink-400" />
          <input placeholder="Search invoices" className="w-40 bg-transparent text-sm outline-none" />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-ink-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/6 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {list.map((inv) => (
                <tr key={inv.id} className="hover:bg-ink-900/[0.02]">
                  <td className="px-6 py-3.5">
                    <Link to={`/dashboard/invoices/${inv.id}`} className="font-semibold text-ink-900 hover:text-cobalt-600">
                      {inv.id}
                    </Link>
                    <p className="text-xs text-ink-400">{inv.description}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-2 font-mono font-semibold text-ink-900">
                      {fmtUsd(inv.amount)}
                      <ChainBadge chain={inv.chain} variant="icon" />
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusPill tone={STATUS_TONE[inv.status]} label={inv.status} />
                  </td>
                  <td className="px-6 py-3.5 text-ink-500">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5">
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-800">
                      <Download size={13} /> Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl2 border border-dashed border-ink-900/15 bg-white py-16 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-cobalt-500/10 text-cobalt-600">
        <FileText size={24} />
      </span>
      <p className="font-display text-lg font-semibold text-ink-900">No invoices match this filter</p>
      <p className="mt-1 text-sm text-ink-500">Create your first invoice to start getting paid.</p>
      <Link to="/dashboard/invoices/new" className="mt-4 rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-bold text-white hover:bg-cobalt-600">
        Create your first invoice
      </Link>
    </div>
  );
}
