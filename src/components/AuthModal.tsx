import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string, name?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg("Informe um endereço de e-mail válido para continuar.");
      return;
    }

    if (trimmedPassword.length < 4) {
      setErrorMsg("Informe uma senha com pelo menos 4 caracteres.");
      return;
    }

    if (mode === "register" && name.trim().length < 2) {
      setErrorMsg("Informe seu nome completo para criar a conta.");
      return;
    }

    setErrorMsg(null);
    onAuthSuccess(trimmedEmail, mode === "register" ? name.trim() : undefined);
    setPassword("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900">
            {mode === "login" ? "Entrar na Conta" : "Criar Conta com E-mail"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-200"
          >
            Retornar
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-purple-800 text-white shadow-sm"
                : "text-slate-700 hover:bg-white"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-purple-800 text-white shadow-sm"
                : "text-slate-700 hover:bg-white"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Nome completo
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="mb-1 block text-sm font-semibold text-slate-800"
            >
              E-mail
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1 block text-sm font-semibold text-slate-800"
            >
              Senha
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-800"
            >
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Retornar
            </button>
            <button
              type="submit"
              className="rounded-lg border border-purple-900 bg-purple-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-900"
            >
              {mode === "login" ? "Confirmar Entrada" : "Confirmar Cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};