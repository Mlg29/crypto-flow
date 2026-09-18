import { useState } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetMerchantAuditLogsQuery } from '../../store/api/auditApi';
import { useAppSelector } from '../../store';

export function AuditLogs() {
  const merchantId = useAppSelector((s) => s.auth.merchantId) ?? '';
  const [page, setPage] = useState(1);
  const [resource, setResource] = useState('');
  const [action, setAction] = useState('');

  const { data, isLoading, isFetching } = useGetMerchantAuditLogsQuery(
    { merchant_id: merchantId, page, limit: 20, resource: resource || undefined, action: action || undefined },
    { skip: !merchantId },
  );

  const logs = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-ink-900">Audit Logs</h1>
        <p className="mt-0.5 text-sm text-ink-500">A record of all actions taken in your merchant workspace.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={resource}
          onChange={(e) => { setResource(e.target.value); setPage(1); }}
          placeholder="Filter by resource…"
          className="rounded-lg border border-ink-900/12 px-3.5 py-2 text-sm outline-none focus:border-cobalt-400"
        />
        <input
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          placeholder="Filter by action…"
          className="rounded-lg border border-ink-900/12 px-3.5 py-2 text-sm outline-none focus:border-cobalt-400"
        />
      </div>

      <div className={`rounded-xl border border-ink-900/8 bg-white shadow-soft ${isFetching ? 'opacity-60' : ''}`}>
        {isLoading ? (
          <div className="py-16 text-center text-sm text-ink-400">Loading logs…</div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <ClipboardList size={32} className="mb-3 text-ink-300" />
            <p className="text-sm font-semibold text-ink-500">No audit logs found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/6">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Account</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Resource</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Action</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-ink-900/[0.02]">
                  <td className="px-5 py-3.5 text-ink-700">{log.account?.email ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-ink-900/5 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
                      {log.resource}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink-600">{log.action}</td>
                  <td className="px-5 py-3.5 text-ink-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pagination && (
          <div className="flex items-center justify-between border-t border-ink-900/6 px-5 py-3">
            <p className="text-xs text-ink-400">
              Page {pagination.page} of {pagination.total_pages} &middot; {pagination.total_items} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.has_previous}
                className="rounded-md p-1.5 text-ink-500 hover:bg-ink-900/[0.04] disabled:opacity-30"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.has_next}
                className="rounded-md p-1.5 text-ink-500 hover:bg-ink-900/[0.04] disabled:opacity-30"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
