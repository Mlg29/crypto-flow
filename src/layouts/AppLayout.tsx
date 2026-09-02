import { NavLink, Outlet, Link } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Code2,
  LayoutDashboard,
  Receipt,
  Send,
  Waves,
  ChevronDown,
} from "lucide-react";
import { SandboxBanner } from "../components/SandboxBanner";
import { useApp } from "../lib/AppContext";
import { useState } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { to: "/dashboard/payouts", label: "Payouts", icon: Send },
  { to: "/dashboard/developers", label: "Developers", icon: Code2 },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppLayout() {
  const { env, toggleEnv } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <SandboxBanner />
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink-900/6 bg-white px-4 py-5 lg:flex">
          <Link to="/dashboard" className="mb-8 flex items-center gap-2 px-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sandbox">
              <Waves size={17} strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink-900">
              CryptoFlow
            </span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-cobalt-500/10 text-cobalt-700"
                      : "text-ink-600 hover:bg-ink-900/[0.04] hover:text-ink-900"
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-ink-900/6 pt-4">
            <Link to="/" className="block px-3 text-sm font-medium text-ink-500 hover:text-ink-800">
              Docs &amp; help
            </Link>
            <button
              onClick={toggleEnv}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-bold ${
                env === "sandbox"
                  ? "border-sandbox/30 bg-sandbox-light text-sandbox-dim"
                  : "border-success/25 bg-success-light text-success"
              }`}
            >
              {env === "sandbox" ? "Sandbox mode" : "Live mode"}
              <span className="rounded-full bg-white/70 px-2 py-0.5">Switch</span>
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-ink-900/6 bg-white px-5 py-3.5 sm:px-8">
            <div className="lg:hidden flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink-900 text-sandbox">
                <Waves size={14} />
              </span>
              <span className="font-display text-base font-bold text-ink-900">CryptoFlow</span>
            </div>
            <div className="hidden text-sm text-ink-500 lg:block">
              Northwind Studio <span className="mx-1.5 text-ink-300">·</span> merchant workspace
            </div>
            <div className="flex items-center gap-3">
              <button className="relative rounded-full p-2 text-ink-500 hover:bg-ink-900/5" aria-label="Notifications">
                <Bell size={19} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-ink-900/8 py-1 pl-1 pr-2.5 hover:bg-ink-900/[0.03]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-cobalt-500 text-xs font-bold text-white">
                    NW
                  </span>
                  <ChevronDown size={14} className="text-ink-500" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-lg border border-ink-900/8 bg-white py-1 shadow-soft">
                    {["Settings", "Team", "Billing", "Sign out"].map((it) => (
                      <button
                        key={it}
                        className="block w-full px-3.5 py-2 text-left text-sm text-ink-700 hover:bg-ink-900/[0.04]"
                      >
                        {it}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="px-5 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-ink-900/8 bg-white py-2 lg:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 text-[10px] font-semibold ${
                isActive ? "text-cobalt-600" : "text-ink-400"
              }`
            }
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
