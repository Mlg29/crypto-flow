import { Link, Outlet } from "react-router-dom";
import { Waves } from "lucide-react";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-paper">
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
            Track order
          </Link>
          <Link
            to="/onboarding/signup"
            className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Merchant Platform
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
