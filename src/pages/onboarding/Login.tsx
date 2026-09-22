import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { useLoginMutation, useSendOtpMutation, useVerifyOtpMutation } from '../../store/api/authApi';
import { setCredentials, setMerchant } from '../../store/authSlice';
import { useAppDispatch } from '../../store';
import { toast } from '../../lib/AppContext';
import { getCookie } from '../../lib/cookie';
import { merchantApi } from '../../store/api/merchantApi';

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activityId, setActivityId] = useState('');
  const [digits, setDigits] = useState(Array(6).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const loginCredentials = useRef<{ accessToken: string; email: string; accountId: string } | null>(null);

  const isBusy = isLoggingIn || isSending;

  function setDigit(i: number, v: string) {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      const { access_token, account } = res.data;
      const refreshToken = getCookie('refresh_token') ?? undefined;

      loginCredentials.current = { accessToken: access_token, refreshToken, email: account.email, accountId: account.id };

      dispatch(setCredentials({ accessToken: access_token, refreshToken, email: account.email, accountId: account.id }));

      const otpRes = await sendOtp({ email: account.email, activity_type: 'verify_session' }).unwrap();
      setActivityId(otpRes.data.activity_id);
      setStep('otp');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.danger(message ?? 'Login failed. Please try again.');
    }
  }

  async function handleVerifyOtp() {
    try {
      if (loginCredentials.current) {
        dispatch(setCredentials(loginCredentials.current));
      }
      await verifyOtp({ otp: digits.join(''), activity_id: activityId }).unwrap();
      const merchantRes = await dispatch(merchantApi.endpoints.getMerchants.initiate()).unwrap();
      const merchant = merchantRes.data?.merchants?.[0];
      if (merchant) {
        dispatch(setMerchant({ merchantId: merchant.id, accountId: merchant.owner_id }));
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.danger(message ?? 'Invalid code. Please try again.');
      setDigits(Array(6).fill(''));
      refs.current[0]?.focus();
    }
  }

  async function handleResend() {
    try {
      const res = await sendOtp({ email, activity_id: activityId, activity_type: 'verify_session' }).unwrap();
      setActivityId(res.data.activity_id);
      toast.success('Code resent.');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.danger(message ?? 'Failed to resend code.');
    }
  }

  const logo = (
    <Link to="/" className="mb-8 flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sandbox">
        <Waves size={17} strokeWidth={2.4} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-ink-900">CryptoFlow</span>
    </Link>
  );

  if (step === 'otp') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="w-full max-w-sm">
          {logo}
          <h1 className="font-display text-2xl font-bold text-ink-900">Verify your session</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-ink-700">{email}</span>. Enter it below to continue.
          </p>

          <div className="mt-6 flex justify-between gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
                }}
                inputMode="numeric"
                maxLength={1}
                disabled={isVerifying}
                className="h-14 w-12 rounded-lg border border-ink-900/12 text-center font-mono text-xl font-bold outline-none focus:border-cobalt-400 disabled:opacity-50"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={digits.some((d) => d === '') || isVerifying}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
          >
            {isVerifying && <Spinner />}
            {isVerifying ? 'Verifying…' : 'Verify & continue'}
          </button>

          <button
            onClick={handleResend}
            disabled={isSending}
            className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-cobalt-600 disabled:opacity-40"
          >
            {isSending && <Spinner />}
            {isSending ? 'Sending…' : 'Resend code'}
          </button>

          <button
            onClick={() => { setStep('form'); setDigits(Array(6).fill('')); }}
            className="mt-2 w-full text-sm text-ink-400 hover:text-ink-600"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        {logo}
        <h1 className="font-display text-2xl font-bold text-ink-900">Sign in to your account</h1>
        <p className="mt-1.5 text-sm text-ink-500">Welcome back. Enter your credentials to continue.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            required
          />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Password</label>
              <Link to="/onboarding/forgot-password" className="text-xs font-semibold text-cobalt-600">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
          >
            {isBusy && <Spinner />}
            {isLoggingIn ? 'Signing in…' : isSending ? 'Sending code…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          Don't have an account?{' '}
          <Link to="/onboarding/signup" className="font-semibold text-cobalt-600">
            Sign up
          </Link>
        </p>
      </div>
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
