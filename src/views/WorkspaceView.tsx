import { useState, useRef, useEffect, useCallback } from "react";
import type { CareJob, ChecklistTask, JobMessage, UserProfile } from "../types/miaucare";
import { containsSwear, moderateImageFile } from "../utils/moderation";
import { isSafeMediaUrl, sanitizeText } from "../utils/security";
import { normalizeSpecies, PRESET, SPECIES_ICONS } from "../utils/species";

interface WorkspaceViewProps {
  currentUser: UserProfile;
  onToast: (msg: string) => void;
  onBack: () => void;
}

let _seq = 1000;
const uid = () => ++_seq;
const nowTime = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function makeTasks(species: string, doneIdx: number[] = []): ChecklistTask[] {
  const norm = normalizeSpecies(species) as keyof typeof PRESET;
  return (PRESET[norm] ?? []).map((p, i) => ({
    id: uid(),
    text: p.text,
    cat: p.cat,
    done: doneIdx.includes(i),
    doneAt: doneIdx.includes(i) ? "Hoje, 09:15" : undefined,
  }));
}

function createInitialJobs(user: UserProfile): CareJob[] {
  const fmtDate = (d: Date) => d.toLocaleDateString("pt-BR");
  const d = (offset: number) => {
    const x = new Date();
    x.setDate(x.getDate() + offset);
    return fmtDate(x);
  };
  return [
    {
      id: 1,
      petName: "Thor",
      petSpecies: "Cão",
      petBreed: "Golden Retriever",
      tutor: "Patrícia Alves",
      tutorEmail: "patricia@miaucare.com.br",
      tutorPhone: "(34) 99123-4567",
      petsitter: user.name,
      petsitterEmail: user.email,
      petsitterPhone: user.phone || "",
      startDate: d(1),
      endDate: d(2),
      status: "active",
      tasks: makeTasks("Cão", [0]),
      messages: [
        {
          id: uid(),
          author: "Patrícia Alves",
          authorEmail: "patricia@miaucare.com.br",
          text: "Olá! Tudo certo com o Thor hoje?",
          timestamp: "08:15",
          hidden: false,
        },
        {
          id: uid(),
          author: user.name,
          authorEmail: user.email,
          text: "Tudo ótimo! Água fresca trocada e passeio programado.",
          timestamp: "08:32",
          hidden: false,
        },
      ],
      notes: "",
      entryTime: "09:00",
      exitTime: "09:45",
    },
    {
      id: 2,
      petName: "Mia",
      petSpecies: "Gato",
      petBreed: "Persa",
      tutor: user.name,
      tutorEmail: user.email,
      tutorPhone: user.phone || "",
      petsitter: "Camila Duarte",
      petsitterEmail: "camila@miaucare.com.br",
      petsitterPhone: "(34) 99234-5678",
      startDate: d(0),
      endDate: d(4),
      status: "active",
      tasks: makeTasks("Gato", [0, 1]),
      messages: [
        {
          id: uid(),
          author: "Camila Duarte",
          authorEmail: "camila@miaucare.com.br",
          text: "Caixa de areia limpa e sachê servido!",
          timestamp: "10:30",
          hidden: false,
        },
      ],
      notes: "",
      entryTime: "10:15",
      exitTime: "10:50",
    },
  ];
}

export function WorkspaceView({ currentUser, onToast, onBack }: WorkspaceViewProps) {
  const storageKey = `miaucare_ws_${currentUser.email || currentUser.name}`;
  const [jobs, setJobs] = useState<CareJob[]>(() => {
    try {
      const s = localStorage.getItem(storageKey);
      if (s) {
        const p = JSON.parse(s);
        if (Array.isArray(p)) return p;
      }
    } catch {}
    return createInitialJobs(currentUser);
  });

  const [selId, setSelId] = useState<number | null>(null);
  const [tab, setTab] = useState<"checklist" | "chat">("checklist");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCat, setNewTaskCat] = useState("Personalizado");
  const [chatText, setChatText] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(jobs));
    } catch {}
  }, [jobs, storageKey]);

  const updJob = useCallback((id: number, fn: (j: CareJob) => CareJob) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? fn(j) : j)));
  }, []);

  const matchUser = (email?: string, name?: string) =>
    Boolean(
      (currentUser.email && email && email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (name && name === currentUser.name)
    );

  const selJob = jobs.find((j) => j.id === selId) ?? null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selJob?.messages?.length, tab]);

  if (!selJob) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-7 text-white">
          <h2 className="text-2xl font-extrabold">Painel de Atendimentos</h2>
          <p className="text-purple-200 text-sm mt-1">
            Gerencie checklists, ficha diária e mensagens moderadas (sem áudio)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => {
            const normSp = normalizeSpecies(j.petSpecies);
            const done = j.tasks.filter((t) => t.done).length;
            const pct = j.tasks.length ? Math.round((done / j.tasks.length) * 100) : 0;
            const isT = matchUser(j.tutorEmail, j.tutor);
            return (
              <div key={j.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl" aria-hidden="true">
                      {SPECIES_ICONS[normSp] ?? "🐾"}
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">{sanitizeText(j.petName, 50)}</p>
                      <p className="text-xs text-slate-500">
                        {normSp} · {sanitizeText(j.petBreed, 50)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    Ativo
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>
                    Tutor: <strong>{sanitizeText(j.tutor, 60)}</strong>
                  </p>
                  <p>
                    Cuidador(a): <strong>{sanitizeText(j.petsitter, 60)}</strong>
                  </p>
                  <p className="text-purple-700 font-bold">
                    {isT ? "Você é o Tutor" : "Você é o(a) Cuidador(a)"}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Checklist</span>
                    <span>
                      {done}/{j.tasks.length} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelId(j.id);
                    setTab("checklist");
                  }}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  Abrir Atendimento →
                </button>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={onBack} className="text-xs text-slate-500 hover:text-purple-700 font-semibold">
          ← Voltar ao Início
        </button>
      </div>
    );
  }

  const normSelSp = normalizeSpecies(selJob.petSpecies);
  const isTutor = matchUser(selJob.tutorEmail, selJob.tutor);
  const isPetsitter = matchUser(selJob.petsitterEmail, selJob.petsitter);
  const doneCount = selJob.tasks.filter((t) => t.done).length;
  const cats = Array.from(new Set(selJob.tasks.map((t) => t.cat)));

  const toggleTask = (taskId: number) => {
    if (!isTutor && !isPetsitter) return;
    updJob(selJob.id, (j) => ({
      ...j,
      tasks: j.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done, doneAt: !t.done ? nowTime() : undefined } : t
      ),
    }));
  };

  const addTask = () => {
    const cleanText = sanitizeText(newTaskText, 180);
    if (!cleanText) return;
    updJob(selJob.id, (j) => ({
      ...j,
      tasks: [
        ...j.tasks,
        {
          id: uid(),
          text: cleanText,
          cat: sanitizeText(newTaskCat, 40) || "Personalizado",
          done: false,
        },
      ],
    }));
    setNewTaskText("");
    onToast("Tarefa adicionada ao checklist.");
  };

  const sendJobMsg = (partial: Omit<JobMessage, "id" | "timestamp" | "hidden">) => {
    const isSwear = partial.text ? containsSwear(partial.text) : false;
    const msg: JobMessage = {
      ...partial,
      id: uid(),
      timestamp: nowTime(),
      hidden: isSwear,
    };
    if (isSwear) onToast("Mensagem bloqueada pelo filtro de conduta.");
    updJob(selJob.id, (j) => ({ ...j, messages: [...j.messages, msg] }));
  };

  const handleMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mod = moderateImageFile(file);
    if (!mod.ok) {
      onToast(mod.reason || "Arquivo bloqueado.");
      e.target.value = "";
      return;
    }
    onToast("Verificando mídia...");
    await new Promise((r) => setTimeout(r, 500));
    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = String(reader.result || "");
      if (!isSafeMediaUrl(resultUrl)) {
        onToast("Tipo de arquivo não permitido.");
        return;
      }
      const type = file.type.startsWith("video/") ? "video" : "image";
      sendJobMsg({
        author: currentUser.name,
        authorEmail: currentUser.email,
        media: { type, url: resultUrl, name: sanitizeText(file.name, 80) },
      });
      onToast("Mídia enviada.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {lightboxSrc && isSafeMediaUrl(lightboxSrc) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center no-print"
          onClick={() => setLightboxSrc(null)}
        >
          <img src={lightboxSrc} alt="Visualização ampliada" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}

      <button type="button" onClick={() => setSelId(null)} className="text-xs text-slate-500 hover:text-purple-700 font-semibold">
        ← Meu Painel
      </button>

      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-5 text-white space-y-2">
        <h2 className="text-xl font-extrabold">
          {SPECIES_ICONS[normSelSp] ?? "🐾"} {sanitizeText(selJob.petName, 50)} — {normSelSp}{" "}
          {sanitizeText(selJob.petBreed, 50)}
        </h2>
        <p className="text-xs text-purple-200">
          {isTutor ? `Cuidador(a): ${sanitizeText(selJob.petsitter, 60)}` : `Tutor: ${sanitizeText(selJob.tutor, 60)}`} ·{" "}
          {selJob.startDate}
        </p>
      </div>

      <div className="flex gap-2 bg-white rounded-2xl border border-slate-200 p-1.5 no-print">
        <button
          type="button"
          onClick={() => setTab("checklist")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
            tab === "checklist" ? "bg-purple-700 text-white" : "text-slate-600"
          }`}
        >
          Checklist ({doneCount}/{selJob.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("chat")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
            tab === "chat" ? "bg-purple-700 text-white" : "text-slate-600"
          }`}
        >
          Chat ({selJob.messages.filter((m) => !m.hidden).length})
        </button>
      </div>

      {tab === "checklist" ? (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap items-center no-print">
            <label className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5">
              Entrada:
              <input
                type="time"
                value={selJob.entryTime}
                onChange={(e) => updJob(selJob.id, (j) => ({ ...j, entryTime: e.target.value }))}
                className="font-bold bg-transparent outline-none"
              />
            </label>
            <label className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5">
              Saída:
              <input
                type="time"
                value={selJob.exitTime}
                onChange={(e) => updJob(selJob.id, (j) => ({ ...j, exitTime: e.target.value }))}
                className="font-bold bg-transparent outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl"
            >
              Imprimir Ficha Diária
            </button>
          </div>

          {cats.map((cat) => (
            <div key={cat} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-700 uppercase">{cat}</div>
              <ul className="divide-y divide-slate-100">
                {selJob.tasks
                  .filter((t) => t.cat === cat)
                  .map((t) => (
                    <li key={t.id} className="flex items-start gap-3 p-3.5">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="mt-1 w-4 h-4 accent-purple-700"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${t.done ? "line-through text-slate-400" : "text-slate-800"}`}>{t.text}</p>
                        {t.done && t.doneAt && (
                          <p className="text-[11px] text-emerald-600">Concluído às {t.doneAt}</p>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {isTutor && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 no-print">
              <p className="text-xs font-bold text-slate-700">+ Nova tarefa</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Descrição da tarefa..."
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  value={newTaskCat}
                  onChange={(e) => setNewTaskCat(e.target.value)}
                  placeholder="Categoria"
                  className="sm:w-36 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={addTask}
                  className="bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5">
            <p className="text-xs font-extrabold text-slate-700 uppercase">Observações da Visita</p>
            <textarea
              rows={3}
              value={selJob.notes}
              onChange={(e) =>
                updJob(selJob.id, (j) => ({ ...j, notes: sanitizeText(e.target.value, 600) }))
              }
              placeholder="Anotações gerais..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="space-y-2.5 max-h-80 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
            {selJob.messages.map((m) => {
              const isMe = matchUser(m.authorEmail, m.author);
              if (m.hidden && !isMe) {
                return (
                  <p key={m.id} className="text-xs italic text-slate-400">
                    Mensagem indisponível
                  </p>
                );
              }
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-slate-400">
                    {isMe ? "Você" : sanitizeText(m.author, 50)} · {m.timestamp}
                  </span>
                  {m.hidden ? (
                    <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs px-3 py-2 rounded-xl italic">
                      Mensagem ocultada pelo filtro de conduta
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs px-3.5 py-2 rounded-2xl text-xs ${
                        isMe ? "bg-purple-700 text-white" : "bg-white border border-slate-200 text-slate-800"
                      }`}
                    >
                      {m.text && <p>{sanitizeText(m.text, 500)}</p>}
                      {m.media?.type === "image" && isSafeMediaUrl(m.media.url) && (
                        <img
                          src={m.media.url}
                          alt={m.media.name}
                          onClick={() => setLightboxSrc(m.media!.url)}
                          className="mt-1 rounded-lg max-w-[200px] cursor-zoom-in"
                        />
                      )}
                      {m.media?.type === "video" && isSafeMediaUrl(m.media.url) && (
                        <video src={m.media.url} controls className="mt-1 rounded-lg max-w-[200px]" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && chatText.trim()) {
                  sendJobMsg({
                    author: currentUser.name,
                    authorEmail: currentUser.email,
                    text: sanitizeText(chatText, 500),
                  });
                  setChatText("");
                }
              }}
              placeholder="Digite uma mensagem (sem áudio)..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaFile} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Anexar imagem ou vídeo"
              className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-xs font-bold"
            >
              Anexar
            </button>
            <button
              type="button"
              onClick={() => {
                if (chatText.trim()) {
                  sendJobMsg({
                    author: currentUser.name,
                    authorEmail: currentUser.email,
                    text: sanitizeText(chatText, 500),
                  });
                  setChatText("");
                }
              }}
              className="bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
