import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useSendOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } from '../../store/api/authApi';
import { toast } from '../../lib/AppContext';

type Step = 'email' | 'otp' | 'password';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [activityId, setActivityId] = useState('');
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(i: number, v: string) {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await sendOtp({ email, activity_type: 'reset_password' }).unwrap();
      setActivityId(res.data.activity_id);
      setStep('otp');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.danger(message ?? 'Failed to send code. Please try again.');
    }
  }

  async function handleVerifyOtp() {
    const otp = digits.join('');
    try {
      await verifyOtp({ otp, activity_id: activityId }).unwrap();
      setStep('password');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.danger(message ?? 'Invalid code. Please try again.');
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      await resetPassword({ email, password: newPassword }).unwrap();
      toast.success('Password reset successfully.');
      navigate('/onboarding/login');
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.danger(message ?? 'Failed to reset password. Please try again.');
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-cobalt-500/10 text-cobalt-600">
        <KeyRound size={22} />
      </div>

      {step === 'email' && (
        <>
          <h1 className="font-display text-2xl font-bold text-ink-900">Forgot your password?</h1>
          <p className="mt-2 text-sm text-ink-500">
            Enter your email and we'll send a verification code to reset your password.
          </p>
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                required
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              {isSending ? 'Sending…' : 'Send code'}
            </button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <>
          <h1 className="font-display text-2xl font-bold text-ink-900">Enter the code</h1>
          <p className="mt-2 text-sm text-ink-500">
            We sent a 6-digit code to <span className="font-semibold text-ink-700">{email}</span>.
          </p>
          <div className="mt-6 flex justify-between gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                inputMode="numeric"
                maxLength={1}
                className="h-14 w-12 rounded-lg border border-ink-900/12 text-center font-mono text-xl font-bold outline-none focus:border-cobalt-400"
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={isVerifying || digits.some((d) => d === '')}
            className="mt-6 w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
          >
            {isVerifying ? 'Verifying…' : 'Verify code'}
          </button>
          <button
            onClick={() => sendOtp({ email, activity_id: activityId }).unwrap().catch((err: unknown) => {
              const message = (err as { data?: { message?: string } })?.data?.message;
              toast.danger(message ?? 'Failed to resend code.');
            })}
            className="mt-3 text-sm font-semibold text-cobalt-600"
          >
            Resend code
          </button>
        </>
      )}

      {step === 'password' && (
        <>
          <h1 className="font-display text-2xl font-bold text-ink-900">Set new password</h1>
          <p className="mt-2 text-sm text-ink-500">Choose a strong password for your account.</p>
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400"
              />
            </div>
            <button
              type="submit"
              disabled={isResetting}
              className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              {isResetting ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        </>
      )}

      <Link to="/onboarding/login" className="mt-4 text-center text-sm font-semibold text-ink-500 hover:text-ink-800">
        Back to sign in
      </Link>
    </div>
  );
}
