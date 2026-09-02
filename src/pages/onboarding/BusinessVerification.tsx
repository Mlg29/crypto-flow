import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Clock, Plus, Upload } from "lucide-react";

const STEPS = ["Business information", "Beneficial owners", "Supporting documents", "Review & submit"];

export function BusinessVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [owners, setOwners] = useState([{ id: 1, name: "" }]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
        <Clock size={13} /> About 15–20 minutes · progress saves automatically
      </div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">Verify your business</h1>

      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                i < step ? "bg-success text-white" : i === step ? "bg-cobalt-500 text-white" : "bg-ink-900/8 text-ink-400"
              }`}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </span>
            {i < STEPS.length - 1 && <span className={`h-0.5 flex-1 ${i < step ? "bg-success" : "bg-ink-900/8"}`} />}
          </li>
        ))}
      </ol>
      <p className="mb-4 text-sm font-semibold text-ink-800">{STEPS[step]}</p>

      <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 shadow-soft">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Legal business name" span2 />
            <TextField label="Registration number" />
            <TextField label="Jurisdiction" />
            <TextField label="Tax ID (EIN / VAT)" />
            <TextField label="Registered address" span2 />
            <TextField label="Business email" />
            <TextField label="Business phone" />
            <SelectField label="Industry" options={["Software", "Retail", "Consulting", "Gaming", "Other"]} />
            <SelectField label="Expected monthly volume" options={["<$10k", "$10k–$100k", "$100k–$1M", "$1M+"]} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {owners.map((o, i) => (
              <div key={o.id} className="rounded-lg border border-ink-900/10 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Owner {i + 1}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Full legal name" />
                  <TextField label="Date of birth" type="date" />
                  <TextField label="Nationality" />
                  <TextField label="Ownership %" type="number" />
                </div>
                <UploadZone label="Upload ID document" compact />
              </div>
            ))}
            <button
              onClick={() => setOwners([...owners, { id: Date.now(), name: "" }])}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt-600"
            >
              <Plus size={15} /> Add another owner
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <UploadZone label="Certificate of incorporation" />
            <UploadZone label="Articles of association" />
            <UploadZone label="Proof of address" />
            <UploadZone label="Recent bank statement" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-ink-900/[0.03] p-4 text-sm text-ink-700">
              <p className="font-semibold text-ink-900">Review your submission</p>
              <p className="mt-1 text-ink-500">
                All sections completed. You can go back and edit any section before submitting.
              </p>
            </div>
            <label className="flex items-start gap-2.5 text-sm text-ink-700">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-ink-900/25 text-cobalt-500" />
              I confirm this information is accurate and complete
            </label>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="rounded-lg border border-ink-900/12 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]"
            >
              Back
            </button>
          )}
          <button
            onClick={() => (step < STEPS.length - 1 ? setStep((s) => s + 1) : navigate("/onboarding/verification"))}
            className="flex-1 rounded-lg bg-cobalt-500 py-2.5 text-sm font-bold text-white hover:bg-cobalt-600"
          >
            {step < STEPS.length - 1 ? "Continue" : "Submit for review"}
          </button>
        </div>
      </div>
      <button className="mt-4 text-sm font-semibold text-ink-500 hover:text-ink-800">
        Save and continue later
      </button>
    </div>
  );
}

function TextField({ label, span2, ...props }: { label: string; span2?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</label>
      <input {...props} className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400" />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</label>
      <select className="w-full rounded-lg border border-ink-900/12 px-3.5 py-2.5 text-sm outline-none focus:border-cobalt-400">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function UploadZone({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</label>
      <div
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-900/15 text-ink-400 hover:border-cobalt-400 hover:text-cobalt-500 ${
          compact ? "py-4" : "py-8"
        }`}
      >
        <Upload size={16} />
        <span className="text-sm font-medium">Drag a file here or click to browse</span>
      </div>
    </div>
  );
}
