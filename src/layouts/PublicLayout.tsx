import { Link, Outlet } from "react-router-dom";
import { Waves } from "lucide-react";
import { SandboxBanner } from "../components/SandboxBanner";
import { useApp } from "../lib/AppContext";

export function PublicLayout() {
  const { env } = useApp();

  return (
    <div className="min-h-screen bg-paper">
      <SandboxBanner />
      <header className="flex items-center justify-between border-b border-ink-900/6 bg-white/70 px-5 py-4 backdrop-blur sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sandbox">
            <Waves size={17} strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            CryptoFlow
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/order/lookup" className="hidden text-sm font-semibold text-ink-600 hover:text-ink-900 sm:block">
            Track an order
          </Link>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              env === "sandbox" ? "bg-sandbox-light text-sandbox-dim" : "bg-success-light text-success"
            }`}
          >
            {env === "sandbox" ? "Sandbox" : "Live"}
          </span>
          <Link
            to="/onboarding/signup"
            className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            For merchants
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
