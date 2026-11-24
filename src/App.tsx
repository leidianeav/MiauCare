import { useState, useEffect } from "react";
import type { AuthModalMode, CourseProgress, FontScale, NavPage, PetItem, UserProfile } from "./types/miaucare";
import { BrandLogo } from "./components/BrandLogo";
import { AuthModal } from "./components/AuthModal";
import { HomeView } from "./views/HomeView";
import { LoggedHomeView } from "./views/LoggedHomeView";
import { WorkspaceView } from "./views/WorkspaceView";
import { MyPetsView } from "./views/MyPetsView";
import { ChatView } from "./views/ChatView";
import { CourseView } from "./views/CourseView";
import { ProfileView } from "./views/ProfileView";

let _petSeq = 10;

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState<NavPage>("home");
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>("normal");
  const [speechOn, setSpeechOn] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    name: "Usuário MiauCare",
    email: "usuario@miaucare.com.br",
    verified: true,
    phone: "",
    age: 28,
    profileImg: "",
    hideContactUntilBooking: true,
  });

  const [pets, setPets] = useState<PetItem[]>([
    {
      id: 1,
      name: "Mia",
      species: "Gatos",
      breed: "SRD",
      age: "3 anos",
      specialCare: "Fonte de água sempre limpa e telas conferidas.",
    },
  ]);

  const [courseProgress, setCourseProgress] = useState<CourseProgress>({
    done: [],
    examScore: null,
    examPassed: false,
    authCode: null,
    completedAt: null,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const navigateSafe = (targetPage: NavPage) => {
    const privatePages: NavPage[] = ["workspace", "pets", "chat", "profile"];
    if (!isAuthenticated && privatePages.includes(targetPage)) {
      setAuthModal("login");
      showToast("Entre com seu e-mail e senha para acessar essa área.");
      return;
    }
    setPage(targetPage);
  };

  const handleAuthSuccess = (payload: { name?: string; email: string }) => {
    setUser((prev) => ({
      ...prev,
      name: payload.name || prev.name,
      email: payload.email,
    }));
    setIsAuthenticated(true);
    setAuthModal(null);
    setPage("home");
    showToast(
      authModal === "register"
        ? "Cadastro concluído com e-mail e senha."
        : "Login realizado com sucesso."
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPage("home");
    showToast("Sessão encerrada. Exibindo página inicial pública.");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.remove("font-lg", "font-xl");
    if (fontScale === "lg") document.documentElement.classList.add("font-lg");
    if (fontScale === "xl") document.documentElement.classList.add("font-xl");
  }, [fontScale]);

  useEffect(() => {
    if (!speechOn || !("speechSynthesis" in window)) return;
    const onHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest("button, a, h1, h2, h3, p, label");
      if (!el) return;
      const txt = (el.textContent || "").trim();
      if (!txt || txt.length > 180) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(txt);
      utter.lang = "pt-BR";
      window.speechSynthesis.speak(utter);
    };
    document.addEventListener("mouseover", onHover);
    return () => {
      document.removeEventListener("mouseover", onHover);
      window.speechSynthesis.cancel();
    };
  }, [speechOn]);

  const handleModuleDone = (id: number) => {
    setCourseProgress((prev) =>
      prev.done.includes(id) ? prev : { ...prev, done: [...prev.done, id] }
    );
  };

  const handleExamComplete = (
    score: number,
    passed: boolean,
    authCode: string,
    completedAt: string
  ) => {
    setCourseProgress((prev) => ({
      ...prev,
      examScore: score,
      examPassed: passed,
      authCode: passed ? authCode : prev.authCode,
      completedAt: passed ? completedAt : prev.completedAt,
    }));
  };

  const publicNav: Array<[NavPage, string]> = [
    ["home", "Início"],
    ["course", "Curso Pet Sitter"],
  ];

  const loggedNav: Array<[NavPage, string]> = [
    ["home", "Início"],
    ["workspace", "Atendimentos"],
    ["pets", `Pets (${pets.length})`],
    ["chat", "Chat"],
    ["course", `Curso (${courseProgress.done.length}/7)`],
    ["profile", "Perfil"],
  ];

  const navItems = isAuthenticated ? loggedNav : publicNav;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setPage("home")}
            aria-label="Página inicial MiauCare"
            className="text-lg font-extrabold"
          >
            <BrandLogo />
          </button>

          <nav className="flex gap-1 flex-wrap items-center">
            {navItems.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => navigateSafe(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  page === key
                    ? "bg-purple-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}

            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setAuthModal("login")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-800 hover:bg-purple-100"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModal("register")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-700 text-white hover:bg-purple-800"
                >
                  Cadastrar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700"
              >
                Sair
              </button>
            )}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setHighContrast((v) => !v)}
              title="Alto contraste"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                highContrast
                  ? "bg-purple-700 text-white border-purple-700"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              Contraste
            </button>
            <button
              type="button"
              onClick={() =>
                setFontScale((s) => (s === "normal" ? "lg" : s === "lg" ? "xl" : "normal"))
              }
              title="Tamanho da fonte"
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200"
            >
              A+ ({fontScale})
            </button>
            <button
              type="button"
              onClick={() => {
                setSpeechOn((v) => !v);
                showToast(
                  !speechOn ? "Leitura por cursor ativada." : "Leitura por cursor desativada."
                );
              }}
              title="Leitura em voz alta ao passar o cursor"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                speechOn
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              Voz
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div
          role="status"
          className="fixed top-16 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg no-print"
        >
          {toast}
        </div>
      )}

      {authModal && (
        <AuthModal
          mode={authModal}
          defaultEmail={user.email}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <main className="flex-1 p-4 sm:p-6">
        {page === "home" && !isAuthenticated && (
          <HomeView
            onOpenCourse={() => setPage("course")}
            onOpenLogin={() => setAuthModal("login")}
            onOpenRegister={() => setAuthModal("register")}
          />
        )}

        {page === "home" && isAuthenticated && (
          <LoggedHomeView
            currentUser={user}
            pets={pets}
            doneCount={courseProgress.done.length}
            examPassed={courseProgress.examPassed}
            onNavigate={navigateSafe}
            onLogout={handleLogout}
          />
        )}

        {page === "workspace" && isAuthenticated && (
          <WorkspaceView
            currentUser={user}
            onToast={showToast}
            onBack={() => setPage("home")}
          />
        )}

        {page === "pets" && isAuthenticated && (
          <MyPetsView
            pets={pets}
            onAdd={(p) => setPets((prev) => [...prev, { ...p, id: ++_petSeq }])}
            onDelete={(id) => setPets((prev) => prev.filter((p) => p.id !== id))}
            onBack={() => setPage("home")}
            onToast={showToast}
          />
        )}

        {page === "chat" && isAuthenticated && (
          <ChatView onBack={() => setPage("home")} onToast={showToast} />
        )}

        {page === "course" && (
          <CourseView
            currentUser={user}
            isAuthenticated={isAuthenticated}
            progress={courseProgress}
            onModuleDone={handleModuleDone}
            onExamComplete={handleExamComplete}
            onRequireLogin={() => setAuthModal("login")}
            onBack={() => setPage("home")}
            onToast={showToast}
          />
        )}

        {page === "profile" && isAuthenticated && (
          <ProfileView
            currentUser={user}
            onSave={(upd) => setUser((prev) => ({ ...prev, ...upd }))}
            onBack={() => setPage("home")}
            onToast={showToast}
          />
        )}
      </main>
    </div>
  );
}

export default App;
