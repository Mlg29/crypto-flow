import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, ShieldCheck, Waves, Wallet } from "lucide-react";

const INDUSTRIES = ["E-commerce", "Marketplaces", "SaaS & web services", "Payroll teams", "Gaming", "Trading platforms"];

const SECURITY_FEATURES = [
  { icon: KeyRound, title: "Two-factor authentication", body: "An extra layer of protection against unauthorized account access." },
  { icon: ShieldCheck, title: "Role-based access", body: "Assign teammates the exact level of access their job needs." },
  { icon: Wallet, title: "Payout whitelisting", body: "Send payouts only to pre-approved, trusted addresses." },
];

export function SignUp() {
  const navigate = useNavigate();
  const [strength, setStrength] = useState(0);
  const [agreed, setAgreed] = useState(false);

  function checkStrength(v: string) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setStrength(s);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
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
              Custodial wallets, invoicing, and bulk payouts — purpose-built for
              teams that move value across chains at scale.
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

      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-ink-900">Create your Merchant Platform account</h1>
          <p className="mt-1.5 text-sm text-ink-500">Business verification typically takes about 15 minutes.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/onboarding/verify-email");
            }}
            className="mt-6 space-y-4"
          >
            <Field label="Work email" type="email" placeholder="you@business.com" required />
            <Field
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              required
              onChange={(e) => checkStrength(e.target.value)}
            />
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < strength
                      ? strength <= 1
                        ? "bg-danger"
                        : strength <= 2
                        ? "bg-warning"
                        : "bg-success"
                      : "bg-ink-900/8"
                  }`}
                />
              ))}
            </div>
            <Field label="Business name" placeholder="Northwind Studio" required />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Jurisdiction
              </label>
              <select className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400">
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Nigeria</option>
                <option>Singapore</option>
                <option>Germany</option>
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
            <button
              type="submit"
              disabled={!agreed}
              className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600 disabled:opacity-40"
            >
              Create account
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link to="/dashboard" className="font-semibold text-cobalt-600">
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
