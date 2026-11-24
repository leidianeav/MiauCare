import { useState, useEffect } from "react";

interface CourseScrollBannerProps {
  doneCount?: number;
  totalModules?: number;
  examPassed?: boolean;
  isAuthenticated?: boolean;
  onOpenCourse: () => void;
  variant?: "inline" | "floating";
}

export function CourseScrollBanner({
  doneCount = 0,
  totalModules = 7,
  examPassed = false,
  isAuthenticated = false,
  onOpenCourse,
  variant = "floating",
}: CourseScrollBannerProps) {
  const [visible, setVisible] = useState(variant === "inline");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (variant !== "floating" || dismissed) return;
    const onScroll = () => setVisible(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant, dismissed]);

  if (dismissed || (variant === "floating" && !visible)) return null;

  const pct = Math.round((doneCount / totalModules) * 100);
  const subtitle = !isAuthenticated
    ? "7 módulos técnicos para cães, gatos, aves, coelhos, roedores e peixes · Prova e certificado"
    : examPassed
      ? "Certificado ativo · Formação concluída (40h)"
      : `${doneCount}/${totalModules} módulos concluídos · Prova e certificado`;

  const ctaLabel = !isAuthenticated
    ? "Conhecer o Curso →"
    : examPassed
      ? "Ver Certificado"
      : doneCount > 0
        ? "Continuar Curso →"
        : "Acessar Curso →";

  if (variant === "inline") {
    return (
      <section className="my-6 rounded-3xl bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/15 px-3 py-0.5 rounded-full">
              Formação Oficial · 40h
            </span>
            <h3 className="text-xl font-extrabold">Torne-se um Pet Sitter Certificado MiauCare</h3>
            <p className="text-xs sm:text-sm text-purple-200">{subtitle}</p>
            {isAuthenticated && (
              <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${examPassed ? 100 : pct}%` }}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenCourse}
            className="bg-white hover:bg-purple-50 text-purple-900 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow shrink-0"
          >
            {ctaLabel}
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-5 z-40 max-w-md ml-auto no-print">
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-3.5 shadow-xl border border-purple-400/30 flex items-center gap-3">
        <span className="text-xl shrink-0" aria-hidden="true">🎓</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold truncate">Curso Pet Sitter MiauCare</p>
          <p className="text-[11px] text-purple-200 truncate">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onOpenCourse}
          className="bg-white hover:bg-purple-50 text-purple-900 font-extrabold text-xs px-3 py-2 rounded-xl shrink-0"
        >
          {!isAuthenticated ? "Ver curso" : "Abrir"}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Fechar banner do curso"
          className="text-purple-200 hover:text-white px-1.5 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
