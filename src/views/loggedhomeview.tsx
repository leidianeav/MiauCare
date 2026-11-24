import type { NavPage, PetItem, UserProfile } from "../types/miaucare";
import { CourseScrollBanner } from "../components/coursescrollbanner";
import { maskContact, sanitizeText } from "../utils/security";

interface LoggedHomeViewProps {
  currentUser: UserProfile;
  pets: PetItem[];
  doneCount: number;
  examPassed: boolean;
  onNavigate: (page: NavPage) => void;
  onLogout: () => void;
}

export function LoggedHomeView({
  currentUser,
  pets,
  doneCount,
  examPassed,
  onNavigate,
  onLogout,
}: LoggedHomeViewProps) {
  const safeName = sanitizeText(currentUser.name, 80);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs bg-white/15 px-3 py-1 rounded-full font-semibold">
            Visão do Usuário Cadastrado · {safeName}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs bg-white/10 hover:bg-white/20 text-purple-100 font-bold px-3 py-1 rounded-full transition"
          >
            Sair da conta
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
          Central de Atendimentos e Cuidados MiauCare
        </h1>
        <p className="text-sm text-purple-200 max-w-2xl">
          Acesse seus atendimentos, cadastre pets, acompanhe mensagens moderadas, avance no curso e gerencie sua privacidade.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate("workspace")}
            className="bg-white hover:bg-purple-50 text-purple-900 font-extrabold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Meus Atendimentos
          </button>
          <button
            type="button"
            onClick={() => onNavigate("pets")}
            className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Meus Pets ({pets.length})
          </button>
          <button
            type="button"
            onClick={() => onNavigate("chat")}
            className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Mensagens
          </button>
          <button
            type="button"
            onClick={() => onNavigate("course")}
            className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Curso ({doneCount}/7)
          </button>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Perfil e LGPD
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
          <p className="font-bold text-slate-900">Checklist e Ficha Diária</p>
          <p className="text-xs text-slate-500">
            Execute tarefas por espécie, registre horários e imprima a ficha de acompanhamento.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("workspace")}
            className="text-xs font-bold text-purple-700 pt-1"
          >
            Abrir Atendimentos →
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
          <p className="font-bold text-slate-900">Pets Cadastrados</p>
          <p className="text-xs text-slate-500">
            {pets.length} pet(s) registrado(s) com instruções de rotina e cuidados especiais.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("pets")}
            className="text-xs font-bold text-purple-700 pt-1"
          >
            Gerenciar Pets →
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
          <p className="font-bold text-slate-900">Proteção de Contato</p>
          <p className="text-xs text-slate-500">
            Contato: {maskContact(currentUser.phone || currentUser.email)}
          </p>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="text-xs font-bold text-purple-700 pt-1"
          >
            Configurar Perfil →
          </button>
        </div>
      </section>

      <CourseScrollBanner
        variant="inline"
        doneCount={doneCount}
        examPassed={examPassed}
        isAuthenticated={true}
        onOpenCourse={() => onNavigate("course")}
      />

      <CourseScrollBanner
        variant="floating"
        doneCount={doneCount}
        examPassed={examPassed}
        isAuthenticated={true}
        onOpenCourse={() => onNavigate("course")}
      />
    </div>
  );
}
