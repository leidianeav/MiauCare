import { useState } from "react";
import { CourseScrollBanner } from "../components/coursescrollbanner";
import { SPECIES_ICONS } from "../utils/species";

interface HomeViewProps {
  onOpenCourse: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

interface PublicClassified {
  id: string;
  title: string;
  region: string;
  species: string[];
  badge: string;
  summary: string;
}

const PUBLIC_CLASSIFIEDS: readonly PublicClassified[] = [
  {
    id: "c1",
    title: "Cuidado Domiciliar para Gatos e Cães",
    region: "Atendimento em domicílio · Rotina diária",
    species: ["Gatos", "Cães"],
    badge: "Avaliação verificada · 4.9 ★",
    summary:
      "Visita no lar com troca de água e ração, limpeza de caixa de areia, enriquecimento ambiental e registro de visita.",
  },
  {
    id: "c2",
    title: "Apoio para Pequenos Pets e Aquários",
    region: "Rotina programada · Protocolo por espécie",
    species: ["Aves", "Coelhos", "Peixes"],
    badge: "Checklist técnico",
    summary:
      "Acompanhamento de alimentação regrada, higiene do recinto e observação de bem-estar no ambiente familiar.",
  },
  {
    id: "c3",
    title: "Passeios Seguros e Monitorados",
    region: "Horários planejados · Conforto térmico",
    species: ["Cães"],
    badge: "Guia e peitoral conferidos",
    summary:
      "Passeios em horários adequados, foco em segurança no trajeto, hidratação e leitura de sinais do cão.",
  },
];

export function HomeView({ onOpenCourse, onOpenLogin, onOpenRegister }: HomeViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");
  const [notice, setNotice] = useState<string>("");

  const filters = ["Todos", "Gatos", "Cães", "Aves", "Coelhos", "Peixes"];
  const filteredAds =
    selectedFilter === "Todos"
      ? PUBLIC_CLASSIFIEDS
      : PUBLIC_CLASSIFIEDS.filter((item) => item.species.includes(selectedFilter));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 text-white space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-white/15 px-3 py-1 rounded-full font-semibold">
            Página Inicial Pública · MiauCare
          </span>
          <span className="text-xs bg-emerald-400/20 text-emerald-100 px-3 py-1 rounded-full font-semibold">
            Privacidade e Segurança por Padrão (LGPD)
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight max-w-3xl">
          Cuidado domiciliar confiável para pets no conforto da própria casa
        </h1>
        <p className="text-sm sm:text-base text-purple-100 max-w-2xl leading-relaxed">
          Conecte tutores e cuidadores com checklists por espécie, mensagens moderadas e proteção de dados pessoais. Tudo pensado para manter a rotina e reduzir o estresse do animal.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenRegister}
            className="bg-white hover:bg-purple-50 text-purple-900 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl transition"
          >
            Criar Conta com E-mail
          </button>
          <button
            type="button"
            onClick={onOpenLogin}
            className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition"
          >
            Entrar
          </button>
          <a
            href="#classificados-publicos"
            className="bg-indigo-950/50 hover:bg-indigo-950/75 text-purple-100 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition border border-white/15"
          >
            Ver Classificados
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <p className="font-extrabold text-slate-900">Segurança do Usuário</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mensagens com filtro de conduta, verificação de arquivos e comunicação organizada sem exposição indevida.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <p className="font-extrabold text-slate-900">Segurança de Dados (LGPD)</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Coleta mínima necessária, contatos diretos mascarados até confirmação do serviço e sanitização de entradas.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <p className="font-extrabold text-slate-900">Classificados Claros</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Anúncios filtráveis por espécie com critérios objetivos e respeito à privacidade dos participantes.
          </p>
        </div>
      </section>

      <section id="classificados-publicos" className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Classificados e Modalidades de Cuidado</h2>
            <p className="text-xs text-slate-500">
              Filtre por espécie para visualizar os formatos de atendimento disponíveis.
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setSelectedFilter(f);
                  setNotice("");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedFilter === f
                    ? "bg-purple-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {notice && (
          <div className="bg-purple-50 border border-purple-200 text-purple-900 text-xs rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <span>{notice}</span>
            <button
              type="button"
              onClick={onOpenLogin}
              className="bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl shrink-0"
            >
              Entrar na Conta
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredAds.map((ad) => (
            <article
              key={ad.id}
              className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                    {ad.badge}
                  </span>
                  <span className="text-sm" aria-hidden="true">
                    {ad.species.map((s) => SPECIES_ICONS[s] ?? "🐾").join(" ")}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{ad.title}</h3>
                <p className="text-[11px] text-slate-500">{ad.region}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{ad.summary}</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotice(`Para interagir com "${ad.title}", entre com seu e-mail e senha ou crie uma conta.`)
                }
                className="w-full bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs py-2.5 rounded-xl transition"
              >
                Interagir na Conta →
              </button>
            </article>
          ))}
        </div>
      </section>

      <CourseScrollBanner
        variant="inline"
        doneCount={0}
        examPassed={false}
        isAuthenticated={false}
        onOpenCourse={onOpenCourse}
      />

      <CourseScrollBanner
        variant="floating"
        doneCount={0}
        examPassed={false}
        isAuthenticated={false}
        onOpenCourse={onOpenCourse}
      />
    </div>
  );
}
