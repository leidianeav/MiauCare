import React, { useState } from "react";
import { ChatMessage } from "../types/miaucare";

interface ChatViewProps {
  messages: ChatMessage[];
  senderName: string;
  onSendMessage: (message: ChatMessage) => void;
  onReturn: () => void;
}

const SENSITIVE_PATTERNS = [
  /cpf/i,
  /rg/i,
  /senha/i,
  /pix/i,
  /cart[aã]o\s+de\s+cr[eé]dito/i,
  /chave\s+de\s+casa/i,
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  senderName,
  onSendMessage,
  onReturn,
}) => {
  const [draft, setDraft] = useState("");
  const [warning, setWarning] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    const hasSensitiveTerm = SENSITIVE_PATTERNS.some((rx) => rx.test(trimmed));
    if (hasSensitiveTerm) {
      setWarning(
        "Atenção: evite enviar senhas, documentos ou chaves de acesso no chat. Confirme os combinados com segurança."
      );
    } else {
      setWarning(null);
    }

    const now = new Date();
    const timestamp = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    onSendMessage({
      id: `msg-${Date.now()}`,
      sender: senderName || "Usuário MiauCare",
      text: trimmed,
      timestamp,
      flagged: hasSensitiveTerm,
    });

    setDraft("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Chat Moderado
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Combine horários, rotina do pet e registros de visita com
              segurança.
            </p>
          </div>
          <button
            type="button"
            onClick={onReturn}
            className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
          >
            Retornar
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-xs font-medium text-purple-950">
          Moderação ativa: combine primeiro os detalhes da rotina pelo chat e
          proteja dados pessoais sensíveis.
        </div>

        <div
          aria-live="polite"
          className="mt-5 max-h-96 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-3.5 text-sm ${
                msg.flagged
                  ? "border-amber-300 bg-amber-50 text-slate-900"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-800">{msg.sender}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="mt-1.5 leading-relaxed">{msg.text}</p>
              {msg.flagged && (
                <p className="mt-1.5 text-xs font-semibold text-amber-800">
                  Mensagem sinalizada pelo filtro preventivo de dados sensíveis.
                </p>
              )}
            </div>
          ))}
        </div>

        {warning && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-950"
          >
            {warning}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label
              htmlFor="chat-input"
              className="mb-1 block text-sm font-semibold text-slate-800"
            >
              Escrever mensagem
            </label>
            <input
              id="chat-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Digite sua mensagem sobre rotina, horários ou cuidados..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onReturn}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Retornar
            </button>
            <button
              type="submit"
              className="rounded-lg border border-purple-900 bg-purple-800 px-5 py-2 text-sm font-bold text-white hover:bg-purple-900"
            >
              Confirmar Envio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};