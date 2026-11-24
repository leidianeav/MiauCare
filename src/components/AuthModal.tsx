import { useState, type FormEvent } from "react";
import type { AuthModalMode } from "../types/miaucare";
import { isValidEmail, sanitizeText } from "../utils/security";

interface AuthModalProps {
  mode: Exclude<AuthModalMode, null>;
  defaultEmail?: string;
  onClose: () => void;
  onSuccess: (payload: { name?: string; email: string }) => void;
}

export function AuthModal({ mode, defaultEmail = "", onClose, onSuccess }: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = sanitizeText(email, 100).toLowerCase();
    const cleanName = sanitizeText(name, 80).replace(/\s+/g, " ");

    if (!isValidEmail(cleanEmail)) {
      setError("Informe um endereço de e-mail válido.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (mode === "register") {
      if (cleanName.split(" ").length < 2 || cleanName.length < 5) {
        setError("Informe seu nome completo (nome e sobrenome).");
        return;
      }
      if (password !== confirmPassword) {
        setError("As senhas não coincidem. Confira os dois campos.");
        return;
      }
    }

    setError("");
    onSuccess({
      name: mode === "register" ? cleanName : undefined,
      email: cleanEmail,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "register" ? "Criar conta com e-mail e senha" : "Entrar com e-mail e senha"}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 no-print"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            {mode === "register" ? "Criar Conta MiauCare" : "Entrar na Conta"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de autenticação"
            className="text-slate-400 hover:text-slate-700 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Acesso e cadastro exclusivos por e-mail e senha. Sem login ou cadastro por Facebook ou Gmail.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome completo</label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {mode === "register" ? "Criar senha" : "Senha"}
            </label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar senha</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            {mode === "register" ? "Concluir Cadastro" : "Entrar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
