"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLoginMutation, useSendOtpMutation, useVerifyOtpMutation } from "@/lib/api/auth";
import { merchantApi } from "@/lib/api/merchant";
import { setCredentials, setMerchant } from "@/lib/store/authSlice";
import { useAppDispatch } from "@/lib/store";
import { getCookie } from "@/lib/cookie";
import { errorMessage, toast } from "@/lib/toast";
import { AuthShell } from "./AuthShell";
import { OtpStep } from "./OtpStep";
import { PasswordField, Spinner, TextField } from "./fields";

/** Only allow redirects back into the dashboard. */
function safeNext(v: string | null) {
  return v && v.startsWith("/dashboard") ? v : "/dashboard";
}

/**
 * Log in:
 * 1. POST /account/login       { email, password }
 * 2. POST /account/otp/send    { email, activity_type: "verify_session" }
 * 3. POST /account/otp/verify  { otp, activity_id }
 * 4. GET  /merchants           -> pick the first merchant
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activityId, setActivityId] = useState("");
  const creds = useRef<{ accessToken: string; refreshToken?: string; email: string; accountId: string } | null>(null);
  const [finishing, setFinishing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      const { access_token, account } = res.data;
      creds.current = { accessToken: access_token, refreshToken: getCookie("refresh_token") ?? undefined, email: account.email, accountId: account.id };
      dispatch(setCredentials(creds.current));
      const otp = await sendOtp({ email: account.email, activity_type: "verify_session" }).unwrap();
      setActivityId(otp.data.activity_id);
      setStep("otp");
    } catch (err) {
      toast.danger(errorMessage(err, "Log in failed. Check your email and password."));
    }
  }

  async function handleVerify(otp: string) {
    try {
      if (creds.current) dispatch(setCredentials(creds.current));
      await verifyOtp({ otp, activity_id: activityId }).unwrap();
      setFinishing(true);
      try {
        const m = await dispatch(merchantApi.endpoints.getMerchants.initiate()).unwrap();
        const merchant = m.data?.merchants?.[0];
        if (merchant) dispatch(setMerchant({ merchantId: merchant.id, accountId: creds.current?.accountId }));
      } catch {
        /* the dashboard shell retries this */
      }
      router.push(safeNext(params.get("next")));
      return true;
    } catch (err) {
      setFinishing(false);
      toast.danger(errorMessage(err, "That code did not work. Please try again."));
      return false;
    }
  }

  async function handleResend() {
    try {
      const res = await sendOtp({ email, activity_id: activityId, activity_type: "verify_session" }).unwrap();
      setActivityId(res.data.activity_id);
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.danger(errorMessage(err, "Could not resend the code."));
    }
  }

  if (step === "otp") {
    return (
      <AuthShell title="Verify this session" sub="For your security, every new sign-in is confirmed by email.">
        <OtpStep email={email} verifying={verifying || finishing} resending={sending} onVerify={handleVerify} onResend={handleResend} onBack={() => setStep("form")} />
      </AuthShell>
    );
  }

  const busy = loggingIn || sending;
  return (
    <AuthShell
      title="Welcome back"
      sub={<>New to CryptoFlow? <Link href="/create-merchant" className="font-semibold text-brand hover:underline">Become a merchant</Link></>}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" autoComplete="email" required />
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          required
          trailing={<Link href="/forgot-password" className="text-[13px] font-semibold text-brand hover:underline">Forgot password?</Link>}
        />
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? <><Spinner />{loggingIn ? "Logging in" : "Sending code"}</> : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
