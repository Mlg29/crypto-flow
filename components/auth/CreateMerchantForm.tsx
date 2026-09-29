"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateMerchantMutation, useGetAllCountriesQuery, useSendOtpMutation, useVerifyOtpMutation } from "@/lib/api/auth";
import { setCredentials } from "@/lib/store/authSlice";
import { useAppDispatch } from "@/lib/store";
import { getCookie } from "@/lib/cookie";
import { errorMessage, toast } from "@/lib/toast";
import { AuthShell } from "./AuthShell";
import { OtpStep } from "./OtpStep";
import { Notice, PasswordField, SelectField, Spinner, TextField, passwordScore } from "./fields";


export function CreateMerchantForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: countries, isLoading: loadingCountries, isError: countriesError, refetch } = useGetAllCountriesQuery();
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [createMerchant, { isLoading: creating }] = useCreateMerchantMutation();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [activityId, setActivityId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const sortedCountries = useMemo(() => [...(countries ?? [])].sort((a, b) => a.name.localeCompare(b.name)), [countries]);
  const strongEnough = passwordScore(password) >= 3;
  const canSubmit = businessName.trim() && countryId && email && strongEnough && agreed && !sending;

  async function handleForm(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const res = await sendOtp({ email, activity_type: "verify_email" }).unwrap();
      setActivityId(res.data.activity_id);
      setStep("otp");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not send the verification code. Please try again."));
    }
  }

  async function handleVerify(otp: string) {
    try {
      await verifyOtp({ otp, activity_id: activityId }).unwrap();
      const res = await createMerchant({ business_name: businessName.trim(), country_id: countryId, email, password }).unwrap();
      dispatch(setCredentials({
        accessToken: res.data.access_token,
        refreshToken: getCookie("refresh_token") ?? undefined,
        email,
        accountId: res.data.merchant.owner_id,
        merchantId: res.data.merchant.id,
      }));
      toast.success(`${res.data.merchant.business_name} is ready.`);
      router.push("/dashboard");
      return true;
    } catch (err) {
      toast.danger(errorMessage(err, "Verification failed. Please try again."));
      return false;
    }
  }

  async function handleResend() {
    try {
      const res = await sendOtp({ email, activity_id: activityId, activity_type: "verify_email" }).unwrap();
      setActivityId(res.data.activity_id);
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not resend the code."));
    }
  }

  if (step === "otp") {
    return (
      <AuthShell title="Verify your email" sub="One last step before we create your merchant account.">
        <OtpStep email={email} verifying={verifying || creating} resending={sending} verifyLabel="Verify and become a merchant" onVerify={handleVerify} onResend={handleResend} onBack={() => setStep("form")} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your merchant account"
      sub={<>Already have one? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleForm} className="flex flex-col gap-4">
        <TextField label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Adebayo Foods Ltd" autoComplete="organization" required />
        <SelectField
          label="Country of registration"
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
          disabled={loadingCountries || countriesError}
          required
        >
          <option value="" disabled>{loadingCountries ? "Loading countries…" : "Select a country"}</option>
          {sortedCountries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </SelectField>
        {countriesError ? (
          <Notice tone="negative">Could not load countries. <button type="button" onClick={() => refetch()} className="font-semibold underline">Try again</button></Notice>
        ) : null}
        <TextField label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" autoComplete="email" required />
        <PasswordField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" showStrength required />
        <label className="flex items-start gap-3 text-sm leading-6 text-ink-muted">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-4 accent-[var(--brand)]" />
          <span>I agree to the CryptoFlow Terms of Service and Privacy Policy, and confirm I am authorised to open an account for this business.</span>
        </label>
        <Button type="submit" size="lg" block disabled={!canSubmit}>
          {sending ? <><Spinner />Sending code</> : "Become a merchant"}
        </Button>
        {password && !strongEnough ? <p className="text-center text-[13px] text-ink-muted">Use 8+ characters with a mix of capitals, numbers or symbols.</p> : null}
      </form>
    </AuthShell>
  );
}
