import { useEffect, useState } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '../../store/api/userApi';
import { useGetAccountRolesQuery, useGetAccountPermissionsQuery } from '../../store/api/rbacApi';
import { useApp } from '../../lib/AppContext';

function AccountRoles({ accountId }: { accountId: string }) {
  const { data } = useGetAccountRolesQuery(accountId);
  const roles = data?.data ?? [];

  if (roles.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-ink-900/8 bg-white p-6 shadow-soft">
      <p className="mb-3 text-sm font-semibold text-ink-900">System roles</p>
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => (
          <span
            key={r.id}
            className="rounded-full border border-ink-900/8 bg-ink-900/[0.03] px-3 py-1 text-xs font-semibold text-ink-700"
          >
            {r.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function AccountPermissions({ accountId }: { accountId: string }) {
  const { data } = useGetAccountPermissionsQuery(accountId);
  const perms = data?.data ?? {};
  const activePerms = Object.entries(perms)
    .filter(([, v]) => v)
    .map(([k]) => k);

  if (activePerms.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-ink-900/8 bg-white p-6 shadow-soft">
      <p className="mb-3 text-sm font-semibold text-ink-900">System permissions</p>
      <div className="flex flex-wrap gap-2">
        {activePerms.map((p) => (
          <span
            key={p}
            className="rounded-full bg-ink-900/5 px-2 py-0.5 text-[11px] font-semibold text-ink-500"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Profile() {
  const { pushToast } = useApp();
  const { data, isLoading } = useGetUserQuery();
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (data?.data) {
      setFirstName(data.data.first_name ?? '');
      setLastName(data.data.last_name ?? '');
      setMiddleName(data.data.middle_name ?? '');
      setPhone(data.data.phone_number ?? '');
    }
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateUser({
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        phone_number: phone,
      }).unwrap();
      pushToast('success', 'Profile updated successfully.');
    } catch {
      pushToast('danger', 'Failed to update profile.');
    }
  }

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-ink-400">Loading profile…</div>;
  }

  const user = data?.data;

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-ink-900">Profile</h1>
        <p className="mt-0.5 text-sm text-ink-500">Update your personal information.</p>
      </div>

      {user?.picture && (
        <div className="mb-6 flex items-center gap-4">
          <img
            src={user.picture}
            alt="Avatar"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-ink-900">
              {[user.first_name, user.last_name].filter(Boolean).join(' ') || '—'}
            </p>
            <p className="text-sm text-ink-500">{user.email}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-ink-900/8 bg-white p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Field label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Field label="Middle name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
          <Field label="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
        </div>

        <div className="mt-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Email</label>
          <input
            value={user?.email ?? ''}
            disabled
            className="w-full rounded-lg border border-ink-900/12 bg-ink-900/[0.03] px-3.5 py-2.5 text-sm text-ink-400"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 rounded-lg bg-cobalt-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      {user?.id && (
        <>
          <AccountRoles accountId={user.id} />
          <AccountPermissions accountId={user.id} />
        </>
      )}
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
      />
    </div>
  );
}
