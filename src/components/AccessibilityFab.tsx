import React, { useEffect, useState } from "react";

export type FontScaleOption = "normal" | "lg" | "xl";

interface AccessibilityFabProps {
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontScale: FontScaleOption;
  onChangeFontScale: (scale: FontScaleOption) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onSpeakText: (text: string) => void;
}

export const AccessibilityFab: React.FC<AccessibilityFabProps> = ({
  highContrast,
  onToggleHighContrast,
  fontScale,
  onChangeFontScale,
  voiceEnabled,
  onToggleVoice,
  onSpeakText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-lg", "font-xl");
    if (fontScale === "lg") {
      root.classList.add("font-lg");
    } else if (fontScale === "xl") {
      root.classList.add("font-xl");
    }
  }, [fontScale]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [highContrast]);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="no-print fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div
          role="dialog"
          aria-label="Menu de Acessibilidade"
          className="w-72 rounded-xl border border-slate-300 bg-white p-4 text-slate-900 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-sm font-bold text-slate-900">Acessibilidade</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200"
              >
                Recolher
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsDismissed(true);
                }}
                aria-label="Ocultar menu de acessibilidade"
                className="rounded-md border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <button
              type="button"
              onClick={onToggleHighContrast}
              aria-pressed={highContrast}
              className={`w-full rounded-lg border px-3 py-2 text-left font-semibold transition ${
                highContrast
                  ? "border-purple-800 bg-purple-700 text-white"
                  : "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
              }`}
            >
              Alto Contraste: {highContrast ? "Ativado" : "Desativado"}
            </button>

            <div>
              <span className="mb-1 block text-xs font-semibold text-slate-700">
                Tamanho da Fonte
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeFontScale("normal")}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                    fontScale === "normal"
                      ? "border-purple-800 bg-purple-700 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Padrão
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFontScale("lg")}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                    fontScale === "lg"
                      ? "border-purple-800 bg-purple-700 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFontScale("xl")}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                    fontScale === "xl"
                      ? "border-purple-800 bg-purple-700 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  A++
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <button
                type="button"
                onClick={onToggleVoice}
                aria-pressed={voiceEnabled}
                className={`w-full rounded-lg border px-3 py-2 text-left font-semibold transition ${
                  voiceEnabled
                    ? "border-purple-800 bg-purple-700 text-white"
                    : "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                }`}
              >
                Leitura por Voz: {voiceEnabled ? "Ativada" : "Desativada"}
              </button>

              <button
                type="button"
                onClick={() =>
                  onSpeakText(
                    "MiauCare: plataforma de cuidado domiciliar para pets com segurança, privacidade e checklists por espécie."
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-center text-xs font-semibold text-slate-900 hover:bg-slate-200"
              >
                Ouvir Resumo da Tela
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Abrir opções de acessibilidade"
        className="inline-flex items-center gap-2 rounded-full border border-purple-900 bg-purple-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <span aria-hidden="true">♿</span>
        <span>Acessibilidade</span>
      </button>
    </div>
  );
};