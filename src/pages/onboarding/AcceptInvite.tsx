import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { useAcceptInviteMutation } from '../../store/api/merchantApi';

export function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await acceptInvite({ token, password }).unwrap();
      navigate('/onboarding/login');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setError(message ?? 'Failed to accept invite. The link may have expired.');
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-danger">Invalid invite link.</p>
          <Link to="/onboarding/login" className="mt-2 block text-sm text-cobalt-600">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sandbox">
            <Waves size={17} strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">CryptoFlow</span>
        </Link>

        <h1 className="font-display text-2xl font-bold text-ink-900">Accept your invite</h1>
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
          >
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
