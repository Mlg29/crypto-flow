import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Env = "sandbox" | "live";

interface Toast {
  id: number;
  tone: "success" | "info" | "warning" | "danger";
  message: string;
}

interface AppState {
  env: Env;
  toggleEnv: () => void;
  toasts: Toast[];
  pushToast: (tone: Toast["tone"], message: string) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  chatPulse: boolean;
}

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [env, setEnv] = useState<Env>("sandbox");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPulse] = useState(true);

  const pushToast = useCallback((tone: Toast["tone"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tone, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const toggleEnv = useCallback(() => {
    setEnv((e) => (e === "sandbox" ? "live" : "sandbox"));
  }, []);

  return (
    <AppCtx.Provider value={{ env, toggleEnv, toasts, pushToast, chatOpen, setChatOpen, chatPulse }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
