import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, Waves, Wallet } from 'lucide-react';
import {
  useCreateMerchantMutation,
  useGetAllCountriesQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '../../store/api/authApi';
import { setCredentials } from '../../store/authSlice';
import { useAppDispatch } from '../../store';

const INDUSTRIES = ['E-commerce', 'Marketplaces', 'SaaS & web services', 'Payroll teams', 'Gaming', 'Trading platforms'];

const SECURITY_FEATURES = [
  { icon: KeyRound, title: 'Two-factor authentication', body: 'An extra layer of protection against unauthorized account access.' },
  { icon: ShieldCheck, title: 'Role-based access', body: 'Assign teammates the exact level of access their job needs.' },
  { icon: Wallet, title: 'Payout whitelisting', body: 'Send payouts only to pre-approved, trusted addresses.' },
];

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [createMerchant, { isLoading: isCreating }] = useCreateMerchantMutation();
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const { data: countries } = useGetAllCountriesQuery();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [activityId, setActivityId] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [strength, setStrength] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const [digits, setDigits] = useState(Array(6).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function checkStrength(v: string) {
    setPassword(v);
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setStrength(s);
  }

  function setDigit(i: number, v: string) {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await sendOtp({ email, activity_type: 'verify_email' }).unwrap();
      setActivityId(res.data.activity_id);
      setStep('otp');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setError(message ?? 'Failed to send verification code. Please try again.');
    }
  }

  async function handleOtpSubmit() {
    setError('');
    try {
      await verifyOtp({ otp: digits.join(''), activity_id: activityId }).unwrap();

      const res = await createMerchant({
        business_name: businessName,
        country_id: countryId,
        email,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          accessToken: res.data.access_token,
          email,
          merchantId: res.data.merchant.id,
        }),
      );

      navigate('/onboarding/verification');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setError(message ?? 'Verification failed. Please try again.');
      setDigits(Array(6).fill(''));
      refs.current[0]?.focus();
    }
  }

  async function handleResend() {
    setError('');
    try {
      const res = await sendOtp({ email, activity_id: activityId }).unwrap();
      setActivityId(res.data.activity_id);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setError(message ?? 'Failed to resend code.');
    }
  }

  const otpComplete = digits.every((d) => d !== '');
  const isBusy = isVerifying || isCreating;

  const sidebar = (
    <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
      <div className="absolute inset-0 bg-mesh" />
      <div className="relative flex h-full flex-col justify-between p-12 text-white">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-sandbox">
            <Waves size={17} />
          </span>
          <div>
            <span className="block font-display text-lg font-bold leading-tight">CryptoFlow</span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/40">Merchant Platform</span>
          </div>
        </Link>
        <div>
          <p className="font-display text-3xl font-bold leading-tight">
            Accept crypto payments. Send payouts across chains, built for your team.
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Custodial wallets, invoicing, and bulk payouts — purpose-built for teams that move value across chains at scale.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <span key={ind} className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75">
                {ind}
              </span>
            ))}
          </div>
          <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
            {SECURITY_FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/8 text-cobalt-400">
                  <f.icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/55">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/40">Used by 1,200+ businesses across 40 countries</p>
      </div>
    </div>
  );

  if (step === 'otp') {
    return (
      <div className="grid min-h-screen lg:grid-cols-2">
        {sidebar}
        <div className="flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-2xl font-bold text-ink-900">Verify your email</h1>
            <p className="mt-1.5 text-sm text-ink-500">
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-ink-700">{email}</span>.
              Enter it below to continue.
            </p>

            <div className="mt-6 flex justify-between gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el; }}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digits[i] && i > 0) {
                      refs.current[i - 1]?.focus();
                    }
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  disabled={isBusy}
                  className="h-14 w-12 rounded-lg border border-ink-900/12 text-center font-mono text-xl font-bold outline-none focus:border-cobalt-400 disabled:opacity-50"
                />
              ))}
            </div>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <button
              onClick={handleOtpSubmit}
              disabled={!otpComplete || isBusy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              {isBusy && <Spinner />}
              {isVerifying ? 'Verifying…' : isCreating ? 'Creating account…' : 'Verify & create account'}
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
              onClick={() => { setStep('form'); setError(''); setDigits(Array(6).fill('')); }}
              className="mt-2 w-full text-sm text-ink-400 hover:text-ink-600"
            >
              ← Back to sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {sidebar}
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-ink-900">Create your Merchant Platform account</h1>
          <p className="mt-1.5 text-sm text-ink-500">Business verification typically takes about 15 minutes.</p>

          <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
            <Field
              label="Work email"
              type="email"
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <Field
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => checkStrength(e.target.value)}
                required
              />
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i < strength
                      ? strength <= 1
                        ? 'bg-danger'
                        : strength <= 2
                          ? 'bg-warning'
                          : 'bg-success'
                      : 'bg-ink-900/8'
                      }`}
                  />
                ))}
              </div>
            </div>
            <Field
              label="Business name"
              placeholder="Northwind Studio"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Country
              </label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                required
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              >
                <option value="">Select a country</option>
                {countries?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-2.5 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-900/25 text-cobalt-500"
              />
              I agree to the Terms of Service and Privacy Policy
            </label>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={!agreed || isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              {isSending && <Spinner />}
              {isSending ? 'Sending code…' : 'Create account'}
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
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
      />
    </div>
  );
}
