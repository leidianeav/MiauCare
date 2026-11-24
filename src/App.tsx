import React, { useEffect, useState } from "react";
import { AccessibilityFab, FontScaleOption } from "./components/AccessibilityFab";
import { AuthModal } from "./components/AuthModal";
import { BrandLogo } from "./components/BrandLogo";
import {
  ActiveView,
  ChatMessage,
  PetProfile,
  ServiceListing,
  UserProfileData,
} from "./types/miaucare";
import { ChatView } from "./views/ChatView";
import { CourseView } from "./views/CourseView";
import { HomeView } from "./views/HomeView";
import { LoggedHomeView } from "./views/LoggedHomeView";
import { MyPetsView } from "./views/MyPetsView";
import { ProfileView } from "./views/ProfileView";
import { WorkspaceView } from "./views/WorkspaceView";

const STORAGE_KEYS = {
  auth: "miaucare_auth_v1",
  profile: "miaucare_profile_v1",
  pets: "miaucare_pets_v1",
  listings: "miaucare_listings_v1",
  messages: "miaucare_messages_v1",
  completedModules: "miaucare_course_completed_v1",
};

const DEFAULT_PROFILE: UserProfileData = {
  name: "Usuário MiauCare",
  email: "usuario@miaucare.com.br",
  phone: "(34) 99999-9999",
  age: "28",
  city: "Uberlândia - MG",
  role: "Tutor",
  maskContactUntilConfirmation: true,
  bio: "Perfil cadastrado na plataforma MiauCare para cuidado domiciliar de pets.",
};

const INITIAL_PETS: PetProfile[] = [
  {
    id: "pet-1",
    name: "Mimi",
    species: "Gato",
    ageOrNotes: "2 anos · Caixa de areia limpa diariamente e sachê às 18h",
    observations: [
      {
        id: "obs-pet-1",
        text: "Prefere ambiente calmo na hora de trocar a água e a areia.",
        createdAt: "Hoje",
      },
    ],
  },
];

const INITIAL_LISTINGS: ServiceListing[] = [
  {
    id: "srv-1",
    title: "Cuidado Domiciliar para Gatos e Cães",
    species: "Gato",
    modality: "Atendimento em domicílio · Rotina diária",
    city: "Uberlândia - MG",
    rateLabel: "A combinar por visita",
    rating: 4.9,
    summary:
      "Visita no lar com troca de água e ração, limpeza de caixa de areia, enriquecimento ambiental e registro de visita.",
    checklist: [
      "Conferir portas, janelas e telas de proteção antes de abrir",
      "Higienizar comedouros, bebedouros e caixa de areia",
      "Registrar horário de chegada, alimentação e comportamento",
    ],
    observations: [],
  },
  {
    id: "srv-2",
    title: "Apoio para Pequenos Pets e Aquários",
    species: "Coelho",
    modality: "Rotina programada · Protocolo por espécie",
    city: "Uberlândia - MG",
    rateLabel: "A combinar por rotina",
    rating: 4.8,
    summary:
      "Acompanhamento de alimentação regrada, higiene do recinto e observação de bem-estar no ambiente familiar.",
    checklist: [
      "Verificar temperatura e ventilação do espaço do pet",
      "Repor feno, água limpa ou alimento conforme orientação",
      "Comunicar qualquer alteração de apetite ou postura",
    ],
    observations: [],
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "Central MiauCare",
    text: "Bem-vindo ao chat moderado. Evite compartilhar dados sensíveis antes da confirmação do atendimento.",
    timestamp: "09:00",
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadFromStorage<boolean>(STORAGE_KEYS.auth, false)
  );
  const [activeView, setActiveView] = useState<ActiveView>(() =>
    loadFromStorage<boolean>(STORAGE_KEYS.auth, false) ? "logged-home" : "home"
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfileData>(() =>
    loadFromStorage<UserProfileData>(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  );
  const [pets, setPets] = useState<PetProfile[]>(() =>
    loadFromStorage<PetProfile[]>(STORAGE_KEYS.pets, INITIAL_PETS)
  );
  const [listings, setListings] = useState<ServiceListing[]>(() =>
    loadFromStorage<ServiceListing[]>(STORAGE_KEYS.listings, INITIAL_LISTINGS)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage<ChatMessage[]>(STORAGE_KEYS.messages, INITIAL_MESSAGES)
  );
  const [completedModules, setCompletedModules] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEYS.completedModules, [])
  );

  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState<FontScaleOption>("normal");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(isAuthenticated));
    } catch {
      // Ignora erro de armazenamento local
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    } catch {
      // Ignora erro de armazenamento local
    }
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.pets, JSON.stringify(pets));
    } catch {
      // Ignora erro de armazenamento local
    }
  }, [pets]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.listings, JSON.stringify(listings));
    } catch {
      // Ignora erro de armazenamento local
    }
  }, [listings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    } catch {
      // Ignora erro de armazenamento local
    }
  }, [messages]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.completedModules,
        JSON.stringify(completedModules)
      );
    } catch {
      // Ignora erro de armazenamento local
    }
  }, [completedModules]);

  const speakText = (text: string) => {
    if (!voiceEnabled && !text) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  };

  const notify = (message: string) => {
    setStatusBanner(message);
    if (voiceEnabled) {
      speakText(message);
    }
  };

  const handleNavigate = (view: ActiveView) => {
    if (view !== "home" && !isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAnunciar = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setActiveView("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthSuccess = (email: string, name?: string) => {
    setProfile((prev) => ({
      ...prev,
      email: email.trim() || prev.email,
      name: name && name.trim() ? name.trim() : prev.name,
    }));
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    setActiveView("logged-home");
    notify("Acesso confirmado. Bem-vindo ao ambiente logado do MiauCare.");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView("home");
    notify("Você saiu da conta.");
  };

  const handleDeleteAccount = () => {
    setIsAuthenticated(false);
    setProfile(DEFAULT_PROFILE);
    setPets([]);
    setMessages(INITIAL_MESSAGES);
    setCompletedModules([]);
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignora erro de armazenamento local
      }
    });
    setActiveView("home");
    setStatusBanner("Conta excluída com sucesso.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="no-print sticky top-0 z-40 border-b border-purple-900/20 bg-purple-800 text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <BrandLogo
            onClick={() =>
              setActiveView(isAuthenticated ? "logged-home" : "home")
            }
            showSvrBadge={true}
            className="text-white"
          />

          {!isAuthenticated ? (
            <nav
              aria-label="Navegação principal"
              className="flex flex-wrap items-center gap-2"
            >
              <button
                type="button"
                onClick={() => handleNavigate("home")}
                className="rounded-lg border border-white/30 bg-purple-900/50 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-purple-950"
              >
                Início
              </button>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="rounded-lg border border-white bg-white px-4 py-2 text-sm font-bold text-purple-900 transition hover:bg-purple-50"
              >
                Entrar / Criar conta
              </button>
            </nav>
          ) : (
            <nav
              aria-label="Navegação do usuário logado"
              className="flex flex-wrap items-center gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                onClick={() => handleNavigate("logged-home")}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  activeView === "logged-home"
                    ? "border-white bg-white text-purple-900"
                    : "border-white/30 bg-purple-900/40 text-white hover:bg-purple-950"
                }`}
              >
                Início
              </button>

              <button
                type="button"
                onClick={handleOpenAnunciar}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  activeView === "workspace"
                    ? "border-white bg-white text-purple-900"
                    : "border-white/30 bg-purple-900/40 text-white hover:bg-purple-950"
                }`}
              >
                Anunciar
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("workspace")}
                className="rounded-lg border border-white/30 bg-purple-900/40 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-purple-950"
              >
                Atendimentos
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("my-pets")}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  activeView === "my-pets"
                    ? "border-white bg-white text-purple-900"
                    : "border-white/30 bg-purple-900/40 text-white hover:bg-purple-950"
                }`}
              >
                Pets ({pets.length})
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("chat")}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  activeView === "chat"
                    ? "border-white bg-white text-purple-900"
                    : "border-white/30 bg-purple-900/40 text-white hover:bg-purple-950"
                }`}
              >
                Chat
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("course")}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  activeView === "course"
                    ? "border-white bg-white text-purple-900"
                    : "border-white/30 bg-purple-900/40 text-white hover:bg-purple-950"
                }`}
              >
                Curso ({completedModules.length}/7)
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("profile")}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  activeView === "profile"
                    ? "border-white bg-white text-purple-900"
                    : "border-white/30 bg-purple-900/40 text-white hover:bg-purple-950"
                }`}
              >
                Perfil
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-white/40 bg-purple-950 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-black/40"
              >
                Sair
              </button>
            </nav>
          )}
        </div>
      </header>

      {statusBanner && (
        <div
          role="status"
          className="no-print border-b border-purple-200 bg-purple-50 px-4 py-2.5 text-purple-950"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm font-medium">
            <span>{statusBanner}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="rounded-md border border-purple-300 bg-white px-2.5 py-1 text-xs font-semibold text-purple-900 hover:bg-purple-100"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {!isAuthenticated || activeView === "home" ? (
          <HomeView
            listings={listings}
            onOpenAuth={() => setAuthModalOpen(true)}
            onNavigateSection={(sectionId) => {
              const target = document.getElementById(sectionId);
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        ) : activeView === "logged-home" ? (
          <LoggedHomeView
            profile={profile}
            petsCount={pets.length}
            completedModulesCount={completedModules.length}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : activeView === "workspace" ? (
          <WorkspaceView
            listings={listings}
            onAddListing={(newListing) => {
              setListings((prev) => [newListing, ...prev]);
              notify("Anúncio e rotina cadastrados com sucesso.");
            }}
            onAddListingObservation={(listingId, text) => {
              setListings((prev) =>
                prev.map((item) =>
                  item.id === listingId
                    ? {
                        ...item,
                        observations: [
                          ...item.observations,
                          {
                            id: `obs-${Date.now()}`,
                            text,
                            createdAt: new Date().toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          },
                        ],
                      }
                    : item
                )
              );
              notify("Observação registrada.");
            }}
            onReturn={() => handleNavigate("logged-home")}
          />
        ) : activeView === "my-pets" ? (
          <MyPetsView
            pets={pets}
            onAddPet={(pet) => {
              setPets((prev) => [...prev, pet]);
              notify(`Pet "${pet.name}" adicionado com sucesso.`);
            }}
            onAddPetObservation={(petId, text) => {
              setPets((prev) =>
                prev.map((pet) =>
                  pet.id === petId
                    ? {
                        ...pet,
                        observations: [
                          ...pet.observations,
                          {
                            id: `obs-${Date.now()}`,
                            text,
                            createdAt: new Date().toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          },
                        ],
                      }
                    : pet
                )
              );
              notify("Observação do pet registrada.");
            }}
            onReturn={() => handleNavigate("logged-home")}
          />
        ) : activeView === "chat" ? (
          <ChatView
            messages={messages}
            senderName={profile.name}
            onSendMessage={(msg) => {
              setMessages((prev) => [...prev, msg]);
              notify("Mensagem enviada no chat.");
            }}
            onReturn={() => handleNavigate("logged-home")}
          />
        ) : activeView === "course" ? (
          <CourseView
            completedModules={completedModules}
            onToggleModule={(moduleId) => {
              setCompletedModules((prev) =>
                prev.includes(moduleId)
                  ? prev.filter((id) => id !== moduleId)
                  : [...prev, moduleId]
              );
              notify("Progresso do curso atualizado.");
            }}
            onReturn={() => handleNavigate("logged-home")}
          />
        ) : (
          <ProfileView
            profile={profile}
            onSaveProfile={(updated) => {
              setProfile(updated);
              notify("Dados do perfil salvos com sucesso.");
            }}
            onDeleteAccount={handleDeleteAccount}
            onReturn={() => handleNavigate("logged-home")}
          />
        )}
      </main>

      <AccessibilityFab
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
        onSpeakText={speakText}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;