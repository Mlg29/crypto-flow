import { FlaskConical } from "lucide-react";
import { useApp } from "../lib/AppContext";

export function SandboxBanner() {
  const { env, toggleEnv } = useApp();
  if (env !== "sandbox") return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-sandbox px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
      <FlaskConical size={15} />
      <span>You're in sandbox mode. No real funds will move.</span>
      <button
        onClick={toggleEnv}
        className="ml-2 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold hover:bg-white/30"
      >
        Switch to live
      </button>
    </div>
  );
}
