import { useEffect, useState } from "react";
import { MessageCircle, Minus, Paperclip, Send, X } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { useLocation } from "react-router-dom";

interface Msg {
  id: number;
  from: "user" | "agent" | "system";
  text: string;
}

const PROMPTS: Record<string, string> = {
  "/order": "Having trouble sending the deposit? We can help.",
  "/verification": "Not sure what we need? We can explain.",
  "/payouts": "We can help investigate what happened.",
};

export function ChatWidget() {
  const { chatOpen, setChatOpen } = useApp();
  const location = useLocation();
  const [showProactive, setShowProactive] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "system", text: "Agent Maya joined the conversation" },
    { id: 2, from: "agent", text: "Hi! I'm Maya from CryptoFlow support. What can I help with today?" },
  ]);
  const [draft, setDraft] = useState("");
  const [shareContext, setShareContext] = useState(true);

  const proactiveText = Object.entries(PROMPTS).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1];

  useEffect(() => {
    if (!proactiveText || chatOpen) return;
    const t = setTimeout(() => setShowProactive(true), 2200);
    const hide = setTimeout(() => setShowProactive(false), 10200);
    return () => {
      clearTimeout(t);
      clearTimeout(hide);
    };
  }, [proactiveText, chatOpen, location.pathname]);

  function send() {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: draft }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "agent", text: "Got it — looking into that now, one moment." },
      ]);
    }, 900);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {showProactive && !chatOpen && proactiveText && (
        <button
          onClick={() => {
            setChatOpen(true);
            setShowProactive(false);
          }}
          className="max-w-[220px] animate-rise rounded-xl rounded-br-sm bg-white px-4 py-3 text-left text-sm text-ink-800 shadow-glow"
        >
          {proactiveText}
        </button>
      )}

      {chatOpen && (
        <div className="flex h-[560px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-xl2 border border-ink-900/10 bg-white shadow-glow animate-rise">
          <div className="flex items-center justify-between bg-ink-900 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">CryptoFlow Support</p>
              <p className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Maya · online
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setChatOpen(false)} className="rounded p-1.5 hover:bg-white/10" aria-label="Minimize">
                <Minus size={16} />
              </button>
              <button onClick={() => setChatOpen(false)} className="rounded p-1.5 hover:bg-white/10" aria-label="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="border-b border-ink-900/8 bg-paper-dim px-4 py-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink-600">Sharing with support</span>
              <button
                onClick={() => setShareContext((s) => !s)}
                className="font-semibold text-cobalt-600"
              >
                {shareContext ? "Sharing" : "Not sharing"}
              </button>
            </div>
            {shareContext && (
              <p className="mt-1 text-ink-500">
                Current page: <span className="font-mono">{location.pathname}</span>
              </p>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) =>
              m.from === "system" ? (
                <p key={m.id} className="text-center text-xs text-ink-400">{m.text}</p>
              ) : (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                      m.from === "user"
                        ? "rounded-br-sm bg-cobalt-500 text-white"
                        : "rounded-bl-sm bg-paper-dim text-ink-800"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-ink-900/8 p-3">
            <button className="rounded-lg p-2 text-ink-400 hover:bg-ink-900/5" aria-label="Attach file">
              <Paperclip size={18} />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border border-ink-900/10 bg-paper px-3 py-2 text-sm outline-none focus:border-cobalt-400"
            />
            <button
              onClick={send}
              className="rounded-lg bg-cobalt-500 p-2 text-white hover:bg-cobalt-600"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {!chatOpen && (
        <button
          onClick={() => {
            setChatOpen(true);
            setShowProactive(false);
          }}
          className="grid h-14 w-14 place-items-center rounded-full bg-cobalt-500 text-white shadow-glow transition hover:scale-105 hover:bg-cobalt-600"
          aria-label="Open support chat"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
