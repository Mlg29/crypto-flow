import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock3, FileWarning, PartyPopper, XCircle, FlaskConical } from "lucide-react";
import type { KybStatus } from "../../lib/types";
import { useApp } from "../../lib/AppContext";

const OPTIONS: { id: KybStatus; label: string }[] = [
  { id: "not_started", label: "Not started" },
  { id: "submitted", label: "Submitted" },
  { id: "needs_more_info", label: "Needs more info" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export function VerificationStatus() {
  const navigate = useNavigate();
  const { env } = useApp();
  const [status, setStatus] = useState<KybStatus>("submitted");

  return (
    <div className="mx-auto max-w-lg px-5 py-14 sm:px-8">
      {status === "not_started" && (
        <StatusCard icon={<Clock3 size={26} />} tone="neutral" title="Complete your application" body="You haven't finished verifying your business yet. It takes about 15 minutes.">
          <Link to="/onboarding/verify" className="w-full rounded-xl bg-cobalt-500 py-3 text-center text-sm font-bold text-white hover:bg-cobalt-600">
            Complete your application
          </Link>
        </StatusCard>
      )}

      {status === "submitted" && (
        <StatusCard icon={<Clock3 size={26} />} tone="warning" title="Under review" body="Typically 1–3 business days. We'll email you the moment there's an update.">
          <div className="w-full rounded-lg bg-ink-900/[0.03] p-4 text-left text-sm text-ink-600">
            <p className="font-semibold text-ink-800">What happens next</p>
            <ol className="mt-2 space-y-1.5 list-decimal pl-4">
              <li>Our team reviews your submitted documents</li>
              <li>We may request additional information</li>
              <li>You'll get an email once a decision is made</li>
            </ol>
          </div>
          <button className="w-full text-sm font-semibold text-cobalt-600">Contact support</button>
        </StatusCard>
      )}

      {status === "needs_more_info" && (
        <StatusCard icon={<FileWarning size={26} />} tone="warning" title="We need a bit more information" body="A couple of items need your attention before we can continue.">
          <div className="w-full space-y-2 text-left">
            {["Proof of address is unclear — please re-upload", "Beneficial owner ID has expired"].map((t) => (
              <div key={t} className="rounded-lg border border-warning/25 bg-warning-light px-3.5 py-2.5 text-sm text-ink-700">
                {t}
              </div>
            ))}
          </div>
          <button className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600">
            Resubmit documents
          </button>
        </StatusCard>
      )}

      {status === "approved" && (
        <StatusCard icon={<PartyPopper size={26} />} tone="success" title="You're verified" body="Your merchant account is fully unlocked.">
          <div className="w-full space-y-2 text-left text-sm">
            {["Create your first custodial wallet", "Generate your first API key", "Send a test payout in sandbox"].map((t) => (
              <label key={t} className="flex items-center gap-2.5 rounded-lg border border-ink-900/8 px-3.5 py-2.5">
                <input type="checkbox" className="h-4 w-4 rounded border-ink-900/25 text-cobalt-500" />
                {t}
              </label>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full rounded-xl bg-cobalt-500 py-3 text-sm font-bold text-white hover:bg-cobalt-600"
          >
            Go to dashboard
          </button>
        </StatusCard>
      )}

      {status === "rejected" && (
        <StatusCard icon={<XCircle size={26} />} tone="danger" title="Application not approved" body="We're unable to approve your business for a CryptoFlow merchant account at this time.">
          <div className="w-full rounded-lg bg-danger-light p-4 text-left text-sm text-ink-700">
            <p className="font-semibold text-danger">Reason</p>
            <p className="mt-1">Registered jurisdiction is currently unsupported.</p>
          </div>
          <button className="w-full rounded-xl border border-ink-900/15 py-3 text-sm font-bold text-ink-700 hover:bg-ink-900/[0.04]">
            Learn about appeals
          </button>
        </StatusCard>
      )}

      {env === "sandbox" && (
        <div className="mt-8 rounded-xl2 border border-sandbox/25 bg-sandbox-light p-4">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-sandbox-dim">
            <FlaskConical size={14} /> Sandbox devtools — preview any status
          </p>
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setStatus(o.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  status === o.id ? "bg-sandbox-dim text-white" : "bg-white text-sandbox-dim"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusCard({
  icon,
  tone,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  tone: "neutral" | "warning" | "success" | "danger";
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  const toneStyles = {
    neutral: "bg-ink-900/5 text-ink-700",
    warning: "bg-warning-light text-warning",
    success: "bg-success-light text-success",
    danger: "bg-danger-light text-danger",
  }[tone];

  return (
    <div className="flex flex-col items-center rounded-xl2 border border-ink-900/8 bg-white p-8 text-center shadow-soft">
      <div className={`mb-4 grid h-14 w-14 place-items-center rounded-full ${toneStyles}`}>{icon}</div>
      <h1 className="font-display text-xl font-bold text-ink-900">{title}</h1>
      <p className="mt-2 text-sm text-ink-500">{body}</p>
      <div className="mt-6 flex w-full flex-col items-center gap-3">{children}</div>
    </div>
  );
}
