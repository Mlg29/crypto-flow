import { useState, type ReactNode } from 'react';
import { Mail, MoreHorizontal, RefreshCw, UserPlus, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import {
  useGetMerchantAccountsQuery,
  useInviteAccountMutation,
  useReinviteAccountMutation,
  useSuspendAccountMutation,
  useActivateAccountMutation,
} from '../../store/api/merchantApi';
import {
  useGetRolesQuery,
  useMerchantAssignRoleMutation,
  useMerchantRemoveRoleMutation,
  useGetMerchantAccountRolesQuery,
  useGetMerchantAccountPermissionsQuery,
  useUpdateMerchantAccountPermissionsMutation,
  useGetPermissionsQuery,
  type Role,
} from '../../store/api/rbacApi';
import { useAppSelector } from '../../store';

function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm">
      <div className={`flex w-full flex-col rounded-xl bg-white shadow-glow ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="flex shrink-0 items-center justify-between border-b border-ink-900/8 px-6 py-4">
          <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-ink-400 hover:bg-ink-900/5 hover:text-ink-700"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MemberRolePanel({
  merchantId,
  accountId,
}: {
  merchantId: string;
  accountId: string;
}) {
  const { pushToast } = useApp();

  const [assignRoleId, setAssignRoleId] = useState('');
  const [assignPerms, setAssignPerms] = useState<string[]>([]);
  const [showPermsEdit, setShowPermsEdit] = useState(false);
  const [permsRoleId, setPermsRoleId] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const { data: rolesData } = useGetRolesQuery({ scope: 'merchant' });
  const { data: memberRolesData, isLoading: loadingRoles } = useGetMerchantAccountRolesQuery({ merchant_id: merchantId, account_id: accountId });
  const { data: memberPermsData } = useGetMerchantAccountPermissionsQuery({ merchant_id: merchantId, account_id: accountId });
  const { data: allPermsData } = useGetPermissionsQuery();
  const [assignRole, { isLoading: isAssigning }] = useMerchantAssignRoleMutation();
  const [removeRole] = useMerchantRemoveRoleMutation();
  const [updatePermissions, { isLoading: isUpdatingPerms }] = useUpdateMerchantAccountPermissionsMutation();

  const availableRoles = rolesData?.data ?? [];
  const memberRoles: Role[] = memberRolesData?.data ?? [];
  const groupedPermissions = allPermsData?.data?.grouped_by_resource ?? {};
  const currentPerms: string[] = memberPermsData?.data ?? [];

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!assignRoleId) return;
    const permissions = assignPerms.length ? assignPerms : undefined;
    await assignRole({ merchant_id: merchantId, account_id: accountId, role_id: assignRoleId, permissions })
      .unwrap()
      .then(() => pushToast('success', 'Role assigned successfully.'))
      .catch(() => pushToast('danger', 'Failed to assign role.'));
    setAssignRoleId('');
    setAssignPerms([]);
  }

  async function handleRemove(roleId: string) {
    await removeRole({ merchant_id: merchantId, account_id: accountId, role_id: roleId })
      .unwrap()
      .then(() => pushToast('success', 'Role removed.'))
      .catch(() => pushToast('danger', 'Failed to remove role.'));
  }

  function togglePerm(perm: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(perm) ? list.filter((p) => p !== perm) : [...list, perm]);
  }

  function openPermsEdit() {
    setSelectedPerms([...currentPerms]);
    setPermsRoleId(memberRoles[0]?.id ?? '');
    setShowPermsEdit(true);
  }

  async function handleUpdatePerms(e: React.FormEvent) {
    e.preventDefault();
    if (!permsRoleId) return;
    await updatePermissions({
      merchant_id: merchantId,
      account_id: accountId,
      role_id: permsRoleId,
      permissions: selectedPerms,
    })
      .unwrap()
      .then(() => pushToast('success', 'Permissions updated successfully.'))
      .catch(() => pushToast('danger', 'Failed to update permissions.'));
    setShowPermsEdit(false);
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Current roles</p>
        {loadingRoles ? (
          <p className="text-xs text-ink-400">Loading…</p>
        ) : memberRoles.length === 0 ? (
          <p className="text-xs text-ink-400">No roles assigned.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {memberRoles.map((r) => (
              <span
                key={r.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/8 bg-ink-900/[0.03] px-3 py-1 text-xs font-semibold text-ink-700"
              >
                {r.name}
                <button
                  onClick={() => handleRemove(r.id)}
                  className="text-ink-400 hover:text-danger"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAssign} className="mb-5">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Assign role</label>
        <div className="flex gap-3">
          <select
            value={assignRoleId}
            onChange={(e) => setAssignRoleId(e.target.value)}
            required
            className="flex-1 rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
          >
            <option value="">Select a role</option>
            {availableRoles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isAssigning}
            className="rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
          >
            {isAssigning ? 'Assigning…' : 'Assign'}
          </button>
        </div>
        {Object.keys(groupedPermissions).length > 0 && assignRoleId && (
          <div className="mt-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Permissions override (optional)</label>
            <div className="space-y-3">
              {Object.entries(groupedPermissions).map(([resource, items]) => (
                <div key={resource}>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-400">{resource}</p>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {items.map((item) => (
                      <label key={item.permission} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                        <input
                          type="checkbox"
                          checked={assignPerms.includes(item.permission)}
                          onChange={() => togglePerm(item.permission, assignPerms, setAssignPerms)}
                          className="rounded border-ink-900/20 accent-cobalt-500"
                        />
                        <span className="font-mono text-xs">{item.field ? `${item.action}:${item.field}` : item.action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Permissions</p>
          {!showPermsEdit && (
            <button
              onClick={openPermsEdit}
              className="text-xs font-semibold text-cobalt-600 hover:underline"
            >
              Edit
            </button>
          )}
        </div>
        {showPermsEdit ? (
          <form onSubmit={handleUpdatePerms}>
            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Role</label>
              <select
                value={permsRoleId}
                onChange={(e) => setPermsRoleId(e.target.value)}
                required
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2 text-sm outline-none focus:border-cobalt-400"
              >
                <option value="">Select a role</option>
                {memberRoles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {Object.entries(groupedPermissions).map(([resource, items]) => (
                <div key={resource}>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-400">{resource}</p>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {items.map((item) => (
                      <label key={item.permission} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(item.permission)}
                          onChange={() => togglePerm(item.permission, selectedPerms, setSelectedPerms)}
                          className="rounded border-ink-900/20 accent-cobalt-500"
                        />
                        <span className="font-mono text-xs">{item.field ? `${item.action}:${item.field}` : item.action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                disabled={isUpdatingPerms}
                className="rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
              >
                {isUpdatingPerms ? 'Saving…' : 'Save permissions'}
              </button>
              <button
                type="button"
                onClick={() => setShowPermsEdit(false)}
                className="rounded-lg border border-ink-900/12 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentPerms.map((perm) => (
              <span
                key={perm}
                className="rounded-full bg-ink-900/5 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink-500"
              >
                {perm}
              </span>
            ))}
            {currentPerms.length === 0 && (
              <p className="text-xs text-ink-400">No permissions set.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Team() {
  const { pushToast } = useApp();
  const merchantId = useAppSelector((s) => s.auth.merchantId) ?? '';
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [managingRolesFor, setManagingRolesFor] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetMerchantAccountsQuery(
    { merchant_id: merchantId },
    { skip: !merchantId },
  );
  const { data: rolesData } = useGetRolesQuery({ scope: 'merchant' });
  const roles = rolesData?.data ?? [];
  const [inviteAccount, { isLoading: isInviting }] = useInviteAccountMutation();
  const [reinviteAccount] = useReinviteAccountMutation();
  const [suspendAccount] = useSuspendAccountMutation();
  const [activateAccount] = useActivateAccountMutation();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!merchantId) return;
    await inviteAccount({ merchant_id: merchantId, email: inviteEmail, role_id: inviteRole })
      .unwrap()
      .then(() => pushToast('success', 'Invite sent successfully.'))
      .catch(() => pushToast('danger', 'Failed to send invite.'));
    setInviteEmail('');
    setInviteRole('');
    setShowInvite(false);
  }

  const accounts = data?.data.items ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-ink-900">Team</h1>
          <p className="mt-0.5 text-sm text-ink-500">Manage who has access to this merchant workspace.</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600"
        >
          <UserPlus size={15} />
          Invite member
        </button>
      </div>

      {showInvite && (
        <Modal title="Invite team member" onClose={() => setShowInvite(false)}>
          <form onSubmit={handleInvite}>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@business.com"
                  required
                  className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  required
                  className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
                >
                  <option value="">Select a role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-ink-900/8 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isInviting}
                className="rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
              >
                {isInviting ? 'Sending…' : 'Send invite'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {managingRolesFor && merchantId && (
        <Modal title="Manage roles & permissions" onClose={() => setManagingRolesFor(null)} wide>
          <MemberRolePanel
            merchantId={merchantId}
            accountId={managingRolesFor}
          />
        </Modal>
      )}

      <div className="rounded-xl border border-ink-900/8 bg-white shadow-soft">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-ink-400">Loading members…</div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Mail size={32} className="mb-3 text-ink-300" />
            <p className="text-sm font-semibold text-ink-500">No team members yet</p>
            <p className="mt-1 text-xs text-ink-400">Invite someone to collaborate on this workspace.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/6">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Member</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Joined</th>
                <th className="w-12 px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {accounts.map((a) => (
                <tr key={a.id} className="hover:bg-ink-900/[0.02]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink-900">{a.email}</p>
                    <p className="text-xs text-ink-400">{a.role_id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.status === 'active'
                        ? 'bg-success-light text-success'
                        : a.status === 'suspended'
                          ? 'bg-danger-light text-danger'
                          : 'bg-ink-900/5 text-ink-500'
                        }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-500">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="relative px-5 py-4">
                    <button
                      onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                      className="rounded-md p-1 text-ink-400 hover:bg-ink-900/[0.04] hover:text-ink-700"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenu === a.id && (
                      <div className="absolute right-4 top-10 z-20 w-44 overflow-hidden rounded-lg border border-ink-900/8 bg-white py-1 shadow-soft">
                        <button
                          onClick={() => {
                            reinviteAccount({ merchant_id: merchantId, invite_id: a.id })
                              .unwrap()
                              .then(() => pushToast('success', 'Invite resent.'))
                              .catch(() => pushToast('danger', 'Failed to resend invite.'));
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink-700 hover:bg-ink-900/[0.04]"
                        >
                          <RefreshCw size={13} /> Reinvite
                        </button>
                        <button
                          onClick={() => {
                            setManagingRolesFor(a.account_id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink-700 hover:bg-ink-900/[0.04]"
                        >
                          <ShieldCheck size={13} /> Manage roles
                        </button>
                        {a.status === 'active' ? (
                          <button
                            onClick={() => {
                              suspendAccount({ merchant_id: merchantId, account_id: a.account_id })
                                .unwrap()
                                .then(() => pushToast('success', 'Account suspended.'))
                                .catch(() => pushToast('danger', 'Failed to suspend account.'));
                              setOpenMenu(null);
                            }}
                            className="w-full px-3.5 py-2 text-left text-sm text-danger hover:bg-ink-900/[0.04]"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              activateAccount({ merchant_id: merchantId, account_id: a.account_id })
                                .unwrap()
                                .then(() => pushToast('success', 'Account activated.'))
                                .catch((err) => {
                                  const errMsg = err?.data?.message ?? err?.data?.message[0] ?? 'Failed to activate account.';
                                  pushToast('danger', errMsg)
                                });
                              setOpenMenu(null);
                            }}
                            className="w-full px-3.5 py-2 text-left text-sm text-success hover:bg-ink-900/[0.04]"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex items-center justify-between border-t border-ink-900/6 px-5 py-3">
          <p className="text-xs text-ink-400">
            {data?.data.pagination.total_items ?? 0} member{(data?.data.pagination.total_items ?? 0) !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs font-semibold text-cobalt-600"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
