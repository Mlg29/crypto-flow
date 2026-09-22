import { useState, type ReactNode } from 'react';
import { Plus, Trash2, Shield, Pencil, X } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  useGetPermissionsQuery,
  type Role,
  type PermissionItem,
} from '../../store/api/rbacApi';

type ScopeFilter = 'system' | 'merchant' | undefined;

function toPermStrings(permissions: string[]): string[] {
  return Array.isArray(permissions) ? permissions : [];
}

function groupByResource(perms: string[]): Record<string, string[]> {
  return perms.reduce<Record<string, string[]>>((acc, perm) => {
    const resource = perm.split(':')[0];
    (acc[resource] ??= []).push(perm);
    return acc;
  }, {});
}
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
      <div
        className={`flex max-h-[90vh] w-full flex-col rounded-xl bg-white shadow-glow ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink-900/8 px-6 py-4">
          <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-ink-400 hover:bg-ink-900/5 hover:text-ink-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function PermissionsSelector({
  grouped,
  selected,
  onToggle,
  onBulkToggle,
}: {
  grouped: Record<string, PermissionItem[]>;
  selected: string[];
  onToggle: (perm: string) => void;
  onBulkToggle: (perms: string[], select: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([resource, items]) => {
        const keys = items.map((i) => i.permission);
        const allSelected = keys.every((k) => selected.includes(k));
        const someSelected = !allSelected && keys.some((k) => selected.includes(k));

        return (
          <div key={resource}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{resource}</p>
              <button
                type="button"
                onClick={() => onBulkToggle(keys, !allSelected)}
                className="text-[11px] font-semibold text-cobalt-600 hover:underline"
              >
                {allSelected ? 'Deselect all' : someSelected ? 'Select remaining' : 'Select all'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
              {items.map((item) => (
                <label
                  key={item.permission}
                  className="flex cursor-pointer items-center gap-2 text-sm text-ink-700"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.permission)}
                    onChange={() => onToggle(item.permission)}
                    className="h-4 w-4 rounded border-ink-900/20 accent-cobalt-500"
                  />
                  <span className="truncate font-mono text-xs">
                    {item.field ? `${item.action}:${item.field}` : item.action}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Roles() {
  const { pushToast } = useApp();

  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>(undefined);
  const [viewPermsRole, setViewPermsRole] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formScope, setFormScope] = useState<'system' | 'merchant'>('merchant');
  const [formPerms, setFormPerms] = useState<string[]>([]);

  const { data, isLoading } = useGetRolesQuery({ scope: scopeFilter });
  const { data: permData } = useGetPermissionsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const roles = data?.data ?? [];
  const groupedPermissions = permData?.data?.grouped_by_resource ?? {};

  function togglePerm(perm: string) {
    setFormPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  }

  function bulkTogglePerms(perms: string[], select: boolean) {
    setFormPerms((prev) =>
      select
        ? [...new Set([...prev, ...perms])]
        : prev.filter((p) => !perms.includes(p)),
    );
  }

  const allPermKeys = Object.values(groupedPermissions).flat().map((i) => i.permission);
  const allSelected = allPermKeys.length > 0 && allPermKeys.every((k) => formPerms.includes(k));

  function openCreate() {
    setFormName('');
    setFormDescription('');
    setFormScope('merchant');
    setFormPerms([]);
    setCreateOpen(true);
  }

  function openEdit(role: Role) {
    setFormName(role.name);
    setFormDescription(role.description ?? '');
    setFormScope(role.scope);
    setFormPerms(toPermStrings(role.permissions));
    setEditingRole(role);
  }

  async function handleCreate(e: React.SyntheticEvent) {
    e.preventDefault();
    const payload = {
      name: formName,
      description: formDescription,
      permissions: formPerms.filter(Boolean),
      scope: formScope,
    }

    await createRole(payload)
      .unwrap()
      .then(() => {
        pushToast('success', 'Role created successfully.');
        setCreateOpen(false);
      })
      .catch((err) => {
        const errMsg = err?.data?.message ?? err?.data?.message[0] ?? 'An error occurred.';
        pushToast('danger', errMsg)
      });
  }

  async function handleUpdate(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!editingRole) return;
    await updateRole({
      id: editingRole.id,
      name: formName,
      description: formDescription,
      permissions: formPerms.filter(Boolean),
    })
      .unwrap()
      .then(() => {
        pushToast('success', 'Role updated successfully.');
        setEditingRole(null);
      })
      .catch((err) => {

        const errMsg = err?.data?.message ?? err?.data?.message[0] ?? 'An error occurred.';
        pushToast('danger', errMsg)
      });
  }

  async function handleDelete() {
    if (!deletingRole) return;
    await deleteRole(deletingRole.id)
      .unwrap()
      .then(() => {
        pushToast('success', 'Role deleted.');
        setDeletingRole(null);
      })
      .catch((err) => {
        const errMsg = err?.data?.message ?? err?.data?.message[0] ?? 'An error occurred.';
        pushToast('danger', errMsg)
      });
  }

  const SCOPE_FILTERS: Array<{ label: string; value: ScopeFilter }> = [
    { label: 'All', value: undefined },
    { label: 'Merchant', value: 'merchant' },
    { label: 'System', value: 'system' },
  ];

  const roleFormBody = (
    <div className="px-6 py-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Name
          </label>
          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. billing_manager"
            required
            className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Scope
          </label>
          <select
            value={formScope}
            onChange={(e) => setFormScope(e.target.value as 'system' | 'merchant')}
            className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
          >
            <option value="merchant">Merchant</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Description
          </label>
          <input
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Short description of this role"
            className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
          />
        </div>
      </div>

      {Object.keys(groupedPermissions).length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Permissions
              {formPerms.length > 0 && (
                <span className="ml-2 rounded-full bg-cobalt-500/10 px-2 py-0.5 text-cobalt-700">
                  {formPerms.length} selected
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => bulkTogglePerms(allPermKeys, !allSelected)}
              className="text-xs font-semibold text-cobalt-600 hover:underline"
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          <div className="rounded-lg border border-ink-900/8 bg-ink-900/[0.02] p-4">
            <PermissionsSelector
              grouped={groupedPermissions}
              selected={formPerms}
              onToggle={togglePerm}
              onBulkToggle={bulkTogglePerms}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-ink-900">Roles</h1>
            <p className="mt-0.5 text-sm text-ink-500">
              Manage access control roles and their permissions.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600"
          >
            <Plus size={15} />
            Create role
          </button>
        </div>

        <div className="mb-5 flex gap-1.5">
          {SCOPE_FILTERS.map((s) => (
            <button
              key={String(s.value)}
              onClick={() => setScopeFilter(s.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${scopeFilter === s.value
                ? 'bg-cobalt-500 text-white'
                : 'bg-ink-900/5 text-ink-600 hover:bg-ink-900/8'
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-ink-900/8 bg-white shadow-soft">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-ink-400">Loading roles…</div>
          ) : roles.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <Shield size={32} className="mb-3 text-ink-300" />
              <p className="text-sm font-semibold text-ink-500">No roles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-900/6 bg-ink-900/[0.02]">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Role
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Scope
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Type
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Permissions
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Created
                    </th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {roles.map((role) => {
                    const permStrings = toPermStrings(role.permissions);
                    const isWildcard =
                      permStrings.length === 1 && permStrings[0] === '*:*';
                    const isActive = (role as Role & { is_active?: boolean }).is_active !== false;

                    return (
                      <tr key={role.id} className="hover:bg-ink-900/[0.015] transition">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-ink-900">{role.name}</p>
                          {role.description && (
                            <p className="mt-0.5 max-w-xs text-xs text-ink-400">
                              {role.description}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${role.scope === 'system'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-cobalt-500/8 text-cobalt-700'
                              }`}
                          >
                            {role.scope}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${role.type === 'system'
                              ? 'bg-ink-900/5 text-ink-500'
                              : 'bg-sandbox-light text-sandbox-dim'
                              }`}
                          >
                            {role.type}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
                              ? 'bg-success-light text-success'
                              : 'bg-ink-900/5 text-ink-400'
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-ink-300'}`}
                            />
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => setViewPermsRole(role)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-900/[0.04]"
                          >
                            {isWildcard ? 'All permissions' : `${permStrings.length} permission${permStrings.length !== 1 ? 's' : ''}`}
                          </button>
                        </td>

                        <td className="px-5 py-4 text-xs text-ink-400">
                          {new Date(role.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(role)}
                              title="Edit role"
                              className="rounded-md p-1.5 text-ink-400 transition hover:bg-ink-900/[0.04] hover:text-ink-700"
                            >
                              <Pencil size={15} />
                            </button>
                            {role.type === 'custom' && (
                              <button
                                onClick={() => setDeletingRole(role)}
                                title="Delete role"
                                className="rounded-md p-1.5 text-ink-400 transition hover:bg-danger-light hover:text-danger"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {viewPermsRole && (() => {
        const permStrings = toPermStrings(viewPermsRole.permissions);
        const isWildcard = permStrings.length === 1 && permStrings[0] === '*:*';
        const grouped = groupByResource(permStrings);

        return (
          <Modal title={`Permissions — ${viewPermsRole.name}`} onClose={() => setViewPermsRole(null)} wide>
            <div className="px-6 py-5">
              {isWildcard ? (
                <div className="rounded-lg border border-success/20 bg-success-light px-4 py-3 text-sm font-medium text-success">
                  This role has full access to all permissions (<code className="font-mono">*:*</code>).
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(grouped).map(([resource, actions]) => (
                    <div key={resource}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
                        {resource}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {actions.map((perm) => (
                          <span
                            key={perm}
                            className="rounded-md bg-cobalt-500/8 px-2.5 py-1 font-mono text-xs font-medium text-cobalt-700"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Modal>
        );
      })()}

      {createOpen && (
        <Modal title="Create role" onClose={() => setCreateOpen(false)} wide>
          <form onSubmit={handleCreate}>
            {roleFormBody}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-ink-900/8 px-6 py-4">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
              >
                {isCreating ? 'Creating…' : 'Create role'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {editingRole && (
        <Modal title={`Edit role — ${editingRole.name}`} onClose={() => setEditingRole(null)} wide>
          <form onSubmit={handleUpdate}>
            {roleFormBody}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-ink-900/8 px-6 py-4">
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
              >
                {isUpdating ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={!!deletingRole}
        title="Delete role"
        tone="danger"
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete role'}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete the role{' '}
        <strong className="text-ink-900">{deletingRole?.name}</strong>? This action cannot be
        undone.
      </ConfirmModal>
    </>
  );
}
