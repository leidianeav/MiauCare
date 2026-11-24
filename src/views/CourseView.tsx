import { useState } from "react";
import type { CourseProgress, UserProfile } from "../types/miaucare";
import { BrandLogo } from "../components/BrandLogo";
import { sanitizeText } from "../utils/security";

interface CourseViewProps {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  progress: CourseProgress;
  onModuleDone: (id: number) => void;
  onExamComplete: (score: number, passed: boolean, authCode: string, completedAt: string) => void;
  onRequireLogin: () => void;
  onBack: () => void;
  onToast: (msg: string) => void;
}

interface CourseModuleItem {
  id: number;
  title: string;
  summary: string;
}

const COURSE_MODULES: readonly CourseModuleItem[] = [
  {
    id: 1,
    title: "Profissionalismo, Legislação e Ética",
    summary: "Lei Sansão (Lei nº 14.064/2020), prevenção de omissão e visita prévia obrigatória.",
  },
  {
    id: 2,
    title: "Nutrição Clínica e Biossegurança",
    summary: "Gatos dependem de taurina e arginina. Nunca ofereça lírio, chocolate, uva ou remédios humanos.",
  },
  {
    id: 3,
    title: "Cães — Comportamento e Passeios",
    summary: "Sinais de apaziguamento, peitoral seguro e evitar asfalto quente entre 10h e 16h.",
  },
  {
    id: 4,
    title: "Gatos — Manejo Cat Friendly",
    summary: "Se a cauda chicotear, pare o carinho. Caixa de areia limpa e nunca deixe sozinho por >24h.",
  },
  {
    id: 5,
    title: "Aves, Coelhos, Roedores e Peixes",
    summary: "Sem aerossóis para aves, feno à vontade sem alface para coelhos e Regra dos 2 min para peixes.",
  },
  {
    id: 6,
    title: "Emergências e Primeiros Socorros",
    summary: "Obstrução urinária e jejum >24h em gatos exigem veterinário imediato; em convulsões, cronometre.",
  },
  {
    id: 7,
    title: "FAQ dos Cuidadores",
    summary: "Não repita dose cuspida sem orientação e mantenha atendimentos individualizados.",
  },
];

const EXAM_QS = [
  {
    id: 1,
    q: "Qual a pena da Lei nº 14.064/2020 para maus-tratos a cães e gatos?",
    opts: ["Advertência e multa", "Reclusão de 2 a 5 anos, multa e proibição da guarda", "30 dias de serviços comunitários"],
    ans: 1,
  },
  {
    id: 2,
    q: "Qual a conduta correta na Regra dos 2 minutos com peixes?",
    opts: ["Desligar o filtro por 2 min", "Dar ração consumida em até 2 min e retirar sobras", "Trocar 20% da água a cada 2 min"],
    ans: 1,
  },
  {
    id: 3,
    q: "Por que nunca dar alface para coelhos?",
    opts: ["Causa diarreia severa e risco fatal", "Desgasta os dentes", "Muda a cor das orelhas"],
    ans: 0,
  },
];

export function CourseView({
  currentUser,
  isAuthenticated,
  progress,
  onModuleDone,
  onExamComplete,
  onRequireLogin,
  onBack,
  onToast,
}: CourseViewProps) {
  const [mode, setMode] = useState<"list" | "read" | "exam" | "result" | "cert">("list");
  const [activeMod, setActiveMod] = useState<CourseModuleItem>(COURSE_MODULES[0]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const allDone = COURSE_MODULES.every((m) => progress.done.includes(m.id));

  const submitExam = () => {
    if (Object.keys(answers).length < EXAM_QS.length) {
      onToast("Responda todas as questões da prova.");
      return;
    }
    const hits = EXAM_QS.filter((item) => answers[item.id] === item.ans).length;
    const score = Math.round((hits / EXAM_QS.length) * 100);
    const passed = score >= 80;
    const code = progress.authCode ?? `MC-2026-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString("pt-BR");
    onExamComplete(score, passed, code, dateStr);
    setMode("result");
  };

  if (mode === "read") {
    const done = progress.done.includes(activeMod.id);
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button type="button" onClick={() => setMode("list")} className="text-xs font-bold text-purple-700">
          ← Módulos
        </button>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-extrabold text-purple-900">
            Módulo {activeMod.id}: {activeMod.title}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{activeMod.summary}</p>
          <div className="pt-2 flex gap-3 flex-wrap">
            {isAuthenticated ? (
              !done ? (
                <button
                  type="button"
                  onClick={() => {
                    onModuleDone(activeMod.id);
                    onToast(`Módulo ${activeMod.id} concluído.`);
                  }}
                  className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Marcar como Concluído
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 py-2">Módulo Concluído</span>
              )
            ) : (
              <button
                type="button"
                onClick={onRequireLogin}
                className="bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Entrar para registrar progresso da prova e certificado
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "exam") {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button type="button" onClick={() => setMode("list")} className="text-xs font-bold text-purple-700">
          ← Módulos
        </button>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-extrabold text-purple-900">Avaliação Final (mínimo 80%)</h2>
          {EXAM_QS.map((item, idx) => (
            <div key={item.id} className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-slate-800">
                {idx + 1}. {item.q}
              </p>
              {item.opts.map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${item.id}`}
                    checked={answers[item.id] === oi}
                    onChange={() => setAnswers((p) => ({ ...p, [item.id]: oi }))}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={submitExam}
            className="bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-xs"
          >
            Enviar Avaliação
          </button>
        </div>
      </div>
    );
  }

  if (mode === "result") {
    const score = progress.examScore ?? 0;
    const passed = progress.examPassed;
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
        <h2 className="text-2xl font-extrabold">{passed ? "Aprovado(a)!" : "Tente novamente"}</h2>
        <p className="text-3xl font-extrabold text-purple-700">{score}%</p>
        <div className="flex justify-center gap-3">
          {passed && (
            <button
              type="button"
              onClick={() => setMode("cert")}
              className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
            >
              Ver Certificado
            </button>
          )}
          <button
            type="button"
            onClick={() => setMode("list")}
            className="bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            Voltar ao Curso
          </button>
        </div>
      </div>
    );
  }

  if (mode === "cert") {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center no-print">
          <button type="button" onClick={() => setMode("list")} className="text-xs font-bold text-purple-700">
            ← Módulos
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            Imprimir / PDF
          </button>
        </div>
        <div className="bg-white rounded-3xl border-4 border-purple-700 p-8 space-y-4">
          <div className="flex justify-between items-center">
            <BrandLogo className="text-lg" />
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              VERIFICADO
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-center text-purple-900">
            Pet Sitter Certificado MiauCare
          </h1>
          <p className="text-sm text-center text-slate-700">
            Certificamos que <strong>{sanitizeText(currentUser.name, 80)}</strong> concluiu o curso de{" "}
            <strong>40 horas</strong> com <strong>{progress.examScore ?? 100}%</strong> de aproveitamento.
          </p>
          <p className="text-xs text-slate-500 text-center">
            Código: <strong>{progress.authCode}</strong> · Emissão: {progress.completedAt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-7 text-white space-y-2">
        <h2 className="text-2xl font-extrabold">Curso Oficial Pet Sitter MiauCare</h2>
        <p className="text-xs text-purple-200">
          {isAuthenticated
            ? `Progresso: ${progress.done.length}/${COURSE_MODULES.length} módulos · 40h`
            : "Conteúdo aberto para consulta · Entre na conta para registrar conclusão e emitir certificado"}
        </p>
      </div>
      <div className="space-y-2.5">
        {COURSE_MODULES.map((m) => {
          const done = progress.done.includes(m.id);
          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs text-slate-400 font-bold">Módulo {m.id}</p>
                <p className="text-sm font-bold text-slate-900">{m.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveMod(m);
                  setMode("read");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white ${
                  done ? "bg-emerald-600" : "bg-purple-700"
                }`}
              >
                {done ? "Revisitar" : "Iniciar"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-bold text-sm text-slate-900">Avaliação Final</p>
          <p className="text-xs text-slate-500">
            {!isAuthenticated
              ? "Entre na conta para realizar a prova e gerar seu certificado."
              : allDone
                ? "Pronto para a prova!"
                : `Conclua todos os ${COURSE_MODULES.length} módulos.`}
          </p>
        </div>
        <div className="flex gap-2">
          {isAuthenticated && progress.examPassed && (
            <button
              type="button"
              onClick={() => setMode("cert")}
              className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Certificado
            </button>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              disabled={!allDone}
              onClick={() => {
                setAnswers({});
                setMode("exam");
              }}
              className="bg-purple-700 disabled:bg-slate-300 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Iniciar Prova
            </button>
          ) : (
            <button
              type="button"
              onClick={onRequireLogin}
              className="bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Entrar para fazer prova
            </button>
          )}
        </div>
      </div>
      <button type="button" onClick={onBack} className="text-xs font-bold text-slate-500 hover:text-purple-700">
        ← Voltar
      </button>
    </div>
  );
}
