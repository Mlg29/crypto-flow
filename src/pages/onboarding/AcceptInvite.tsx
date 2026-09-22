import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { useAcceptInviteMutation } from '../../store/api/merchantApi';
import { toast } from '../../lib/AppContext';

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [strength, setStrength] = useState(0);
  const [mismatch, setMismatch] = useState(false);

  function checkStrength(v: string) {
    setPassword(v);
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setStrength(s);
    if (confirm) setMismatch(v !== confirm);
  }

  function checkConfirm(v: string) {
    setConfirm(v);
    setMismatch(v !== password);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMismatch(true);
      return;
    }
    try {
      await acceptInvite({ token, password }).unwrap();
      toast.success('Account activated. Please sign in.');
      navigate('/onboarding/login');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.danger(message ?? 'Failed to accept invite. The link may have expired.');
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="w-full max-w-sm text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-danger-light text-danger mx-auto mb-4">
            <Waves size={22} />
          </span>
          <h2 className="font-display text-lg font-bold text-ink-900">Invalid invite link</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            This invite link is missing a token. Please use the link from your email.
          </p>
          <Link
            to="/onboarding/login"
            className="mt-5 inline-block text-sm font-semibold text-cobalt-600 hover:underline"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor =
    strength <= 1 ? 'bg-danger' : strength === 2 ? 'bg-warning' : 'bg-success';

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sandbox">
            <Waves size={17} strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            CryptoFlow
          </span>
        </Link>

        <h1 className="font-display text-2xl font-bold text-ink-900">You've been invited</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Set a password to activate your account and join the workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => checkStrength(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
            />
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < strength ? strengthColor : 'bg-ink-900/8'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-ink-400">{strengthLabel}</p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => checkConfirm(e.target.value)}
              placeholder="Re-enter your password"
              required
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400 ${
                mismatch ? 'border-danger' : 'border-ink-900/12'
              }`}
            />
            {mismatch && (
              <p className="mt-1 text-xs text-danger">Passwords do not match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || mismatch || !password || !confirm}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Activating…' : 'Accept invite'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/onboarding/login" className="font-semibold text-cobalt-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
