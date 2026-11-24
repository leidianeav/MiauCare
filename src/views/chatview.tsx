import { useState, useRef, useEffect } from "react";
import { containsSwear } from "../utils/moderation";
import { sanitizeText } from "../utils/security";

interface ChatViewProps {
  onBack: () => void;
  onToast: (msg: string) => void;
}

interface ThreadMessage {
  id: number;
  from: "me" | "other";
  text: string;
  time: string;
  hidden: boolean;
}

interface ChatThread {
  id: number;
  withName: string;
  subject: string;
  tag: "atendimento" | "vaga";
  unread: number;
  messages: ThreadMessage[];
}

const INITIAL_THREADS: readonly ChatThread[] = [
  {
    id: 1,
    withName: "Camila Duarte",
    subject: "Hospedagem · Mia & Loki",
    tag: "atendimento",
    unread: 1,
    messages: [{ id: 1, from: "other", text: "Olá! Tudo certo com a hospedagem?", time: "14:30", hidden: false }],
  },
  {
    id: 2,
    withName: "Beatriz Lima",
    subject: "Vaga · Piu (Calopsita)",
    tag: "vaga",
    unread: 0,
    messages: [{ id: 1, from: "other", text: "Tenho experiência com calopsitas.", time: "09:05", hidden: false }],
  },
];

let _msgSeq = 200;
const nextMsgId = () => ++_msgSeq;
const nowTime = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export function ChatView({ onBack, onToast }: ChatViewProps) {
  const [threads, setThreads] = useState<ChatThread[]>([...INITIAL_THREADS]);
  const [activeId, setActiveId] = useState<number>(1);
  const [mobileThread, setMobileThread] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages?.length]);

  const send = () => {
    const trimmed = sanitizeText(input, 500);
    if (!trimmed) return;
    const hidden = containsSwear(trimmed);
    if (hidden) onToast("Mensagem bloqueada pelo filtro de conduta.");
    setThreads((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? {
              ...t,
              unread: 0,
              messages: [
                ...t.messages,
                { id: nextMsgId(), from: "me", text: trimmed, time: nowTime(), hidden },
              ],
            }
          : t
      )
    );
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (mobileThread ? setMobileThread(false) : onBack())}
            className="text-xs font-bold text-purple-700"
          >
            ← {mobileThread ? "Conversas" : "Voltar"}
          </button>
          <h2 className="text-xl font-extrabold">Mensagens</h2>
        </div>
        <span className="text-[11px] text-slate-500">Moderação ativa · Sem envio de áudio</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex h-[65vh]">
        <div
          className={`${
            mobileThread ? "hidden md:flex" : "flex"
          } w-full md:w-64 border-r border-slate-100 flex-col shrink-0`}
        >
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveId(t.id);
                setMobileThread(true);
              }}
              className={`w-full text-left px-4 py-3 border-b border-slate-50 ${
                active.id === t.id ? "bg-purple-50" : "hover:bg-slate-50"
              }`}
            >
              <p className="text-xs font-bold text-slate-900">{t.withName}</p>
              <p className="text-[11px] text-slate-500 truncate">{t.subject}</p>
            </button>
          ))}
        </div>

        <div className={`${!mobileThread ? "hidden md:flex" : "flex"} flex-1 flex-col min-w-0`}>
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900">{active.withName}</p>
            <p className="text-[11px] text-slate-500">{active.subject}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                {m.hidden ? (
                  <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs px-3 py-2 rounded-xl italic">
                    Mensagem ocultada pelo filtro de conduta
                  </div>
                ) : (
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-xs ${
                      m.from === "me" ? "bg-purple-700 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-purple-200" : "text-slate-400"}`}>
                      {m.time}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
            />
            <button
              type="button"
              onClick={send}
              disabled={!input.trim()}
              className="bg-purple-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
