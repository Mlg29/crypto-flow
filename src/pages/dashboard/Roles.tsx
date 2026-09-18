import { useState } from 'react';
import { Plus, Trash2, Shield, Pencil, UserPlus, UserMinus } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  useGetPermissionsQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  type Role,
} from '../../store/api/rbacApi';

export function Roles() {
  const [scope, setScope] = useState<'system' | 'merchant'>('merchant');
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignAccountId, setAssignAccountId] = useState('');
  const [assignRoleId, setAssignRoleId] = useState('');
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [removeAccountId, setRemoveAccountId] = useState('');
  const [removeRoleId, setRemoveRoleId] = useState('');

  const { pushToast } = useApp();

  const { data, isLoading } = useGetRolesQuery({ scope });
  const { data: permData } = useGetPermissionsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [removeRole, { isLoading: isRemoving }] = useRemoveRoleMutation();

  const roles = data?.data ?? [];
  const permissions = permData?.data ?? [];

  function togglePerm(perm: string) {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createRole({
      name,
      description,
      permissions: selectedPerms.map((p) => ({ [p]: true })),
      type: 'custom',
      scope,
    })
      .unwrap()
      .then(() => pushToast('success', 'Role created successfully.'))
      .catch(() => pushToast('danger', 'Failed to create role.'));
    setName('');
    setDescription('');
    setSelectedPerms([]);
    setShowCreate(false);
  }

  function startEdit(role: Role) {
    setEditingRole(role);
    setEditName(role.name);
    setEditDescription(role.description);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingRole) return;
    await updateRole({ id: editingRole.id, name: editName, description: editDescription })
      .unwrap()
      .then(() => pushToast('success', 'Role updated successfully.'))
      .catch(() => pushToast('danger', 'Failed to update role.'));
    setEditingRole(null);
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    await assignRole({ account_id: assignAccountId, role_id: assignRoleId })
      .unwrap()
      .then(() => pushToast('success', 'Role assigned successfully.'))
      .catch(() => pushToast('danger', 'Failed to assign role.'));
    setAssignAccountId('');
    setAssignRoleId('');
    setShowAssignForm(false);
  }

  async function handleRemove(e: React.FormEvent) {
    e.preventDefault();
    await removeRole({ account_id: removeAccountId, role_id: removeRoleId })
      .unwrap()
      .then(() => pushToast('success', 'Role removed successfully.'))
      .catch(() => pushToast('danger', 'Failed to remove role.'));
    setRemoveAccountId('');
    setRemoveRoleId('');
    setShowRemoveForm(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-ink-900">Roles</h1>
          <p className="mt-0.5 text-sm text-ink-500">Manage access control roles and their permissions.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAssignForm(true); setShowRemoveForm(false); }}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-900/[0.04]"
          >
            <UserPlus size={15} />
            Assign role
          </button>
          <button
            onClick={() => { setShowRemoveForm(true); setShowAssignForm(false); }}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-900/[0.04]"
          >
            <UserMinus size={15} />
            Remove role
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600"
          >
            <Plus size={15} />
            Create role
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {(['merchant', 'system'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
              scope === s ? 'bg-cobalt-500 text-white' : 'bg-ink-900/5 text-ink-600 hover:bg-ink-900/8'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {showAssignForm && (
        <form
          onSubmit={handleAssign}
          className="mb-6 rounded-xl border border-ink-900/8 bg-white p-5 shadow-soft"
        >
          <p className="mb-4 text-sm font-semibold text-ink-900">Assign role to account</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Account ID</label>
              <input
                value={assignAccountId}
                onChange={(e) => setAssignAccountId(e.target.value)}
                placeholder="account_id"
                required
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Role</label>
              <select
                value={assignRoleId}
                onChange={(e) => setAssignRoleId(e.target.value)}
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
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={isAssigning}
              className="rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              {isAssigning ? 'Assigning…' : 'Assign role'}
            </button>
            <button
              type="button"
              onClick={() => setShowAssignForm(false)}
              className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showRemoveForm && (
        <form
          onSubmit={handleRemove}
          className="mb-6 rounded-xl border border-ink-900/8 bg-white p-5 shadow-soft"
        >
          <p className="mb-4 text-sm font-semibold text-ink-900">Remove role from account</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Account ID</label>
              <input
                value={removeAccountId}
                onChange={(e) => setRemoveAccountId(e.target.value)}
                placeholder="account_id"
                required
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Role</label>
              <select
                value={removeRoleId}
                onChange={(e) => setRemoveRoleId(e.target.value)}
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
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={isRemoving}
              className="rounded-lg bg-danger px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-40"
            >
              {isRemoving ? 'Removing…' : 'Remove role'}
            </button>
            <button
              type="button"
              onClick={() => setShowRemoveForm(false)}
              className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-xl border border-ink-900/8 bg-white p-5 shadow-soft"
        >
          <p className="mb-4 text-sm font-semibold text-ink-900">New role</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. billing_manager"
                required
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
          </div>
          {permissions.length > 0 && (
            <div className="mt-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-500">Permissions</label>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {permissions.map((p) => (
                  <label key={p.name} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                    <input
                      type="checkbox"
                      checked={selectedPerms.includes(p.name)}
                      onChange={() => togglePerm(p.name)}
                      className="rounded border-ink-900/20 accent-cobalt-500"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              {isCreating ? 'Creating…' : 'Create role'}
            </button>
            <button
              type="button"
              onClick={() => { setShowCreate(false); setSelectedPerms([]); }}
              className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingRole && (
        <form
          onSubmit={handleUpdate}
          className="mb-6 rounded-xl border border-cobalt-200 bg-cobalt-50/40 p-5 shadow-soft"
        >
          <p className="mb-4 text-sm font-semibold text-ink-900">Edit "{editingRole.name}"</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Description</label>
              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-lg bg-cobalt-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              {isUpdating ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditingRole(null)}
              className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-ink-900/8 bg-white shadow-soft">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-ink-400">Loading roles…</div>
        ) : roles.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Shield size={32} className="mb-3 text-ink-300" />
            <p className="text-sm font-semibold text-ink-500">No roles found</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink-900/6">
            {roles.map((role) => (
              <li key={role.id} className="flex items-start justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-ink-900">{role.name}</p>
                  {role.description && (
                    <p className="mt-0.5 text-xs text-ink-400">{role.description}</p>
                  )}
                  <div className="mt-1.5 flex gap-2">
                    <span className="rounded-full bg-ink-900/5 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
                      {role.scope}
                    </span>
                    <span className="rounded-full bg-ink-900/5 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
                      {role.type}
                    </span>
                  </div>
                </div>
                {role.type === 'custom' && (
                  <div className="ml-4 flex gap-1">
                    <button
                      onClick={() => startEdit(role)}
                      className="rounded-md p-1.5 text-ink-400 hover:bg-ink-900/[0.04] hover:text-ink-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() =>
                        deleteRole(role.id)
                          .unwrap()
                          .then(() => pushToast('success', 'Role deleted.'))
                          .catch(() => pushToast('danger', 'Failed to delete role.'))
                      }
                      className="rounded-md p-1.5 text-ink-400 hover:bg-danger-light hover:text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
