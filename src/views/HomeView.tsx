import React, { useState } from "react";
import { ServiceListing, SpeciesType } from "../types/miaucare";

interface HomeViewProps {
  listings: ServiceListing[];
  onOpenAuth: () => void;
  onNavigateSection: (sectionId: string) => void;
}

const SPECIES_FILTERS: Array<"Todos" | SpeciesType> = [
  "Todos",
  "Gato",
  "Cão",
  "Ave",
  "Coelho",
  "Roedor",
  "Peixe",
];

export const HomeView: React.FC<HomeViewProps> = ({
  listings,
  onOpenAuth,
  onNavigateSection,
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<"Todos" | SpeciesType>(
    "Todos"
  );

  const filteredListings =
    selectedSpecies === "Todos"
      ? listings
      : listings.filter((item) => item.species === selectedSpecies);

  return (
    <div className="flex flex-col">
      {/* Seção principal pública */}
      <section
        id="inicio-publico"
        className="border-b border-slate-200 bg-gradient-to-b from-purple-900 to-purple-800 px-4 py-12 text-white"
      >
        <div className="mx-auto max-w-6xl">
          <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
            Cuidado Domiciliar · Privacidade e Segurança (LGPD)
          </span>

          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Cuidado domiciliar confiável para pets no conforto da própria casa
          </h1>

          <p className="mt-3 max-w-2xl text-base text-purple-100">
            Conecte tutores e cuidadores com checklists por espécie, mensagens
            moderadas e proteção de dados pessoais. Tudo organizado para manter
            a rotina e reduzir o estresse do animal.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAuth}
              className="rounded-lg border border-white bg-white px-5 py-2.5 text-sm font-bold text-purple-900 transition hover:bg-purple-50"
            >
              Acessar Plataforma
            </button>
            <button
              type="button"
              onClick={() => onNavigateSection("classificados-publicos")}
              className="rounded-lg border border-white/40 bg-purple-950/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-950"
            >
              Ver Classificados
            </button>
          </div>
        </div>
      </section>

      {/* Classificados e modalidades de cuidado (miolo limpo, sem bloco de segurança aqui) */}
      <section
        id="classificados-publicos"
        className="mx-auto w-full max-w-6xl px-4 py-12"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Classificados e Modalidades de Cuidado
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Filtre por espécie para visualizar os formatos de atendimento
              disponíveis.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filtrar classificados por espécie"
            className="flex flex-wrap gap-2"
          >
            {SPECIES_FILTERS.map((species) => {
              const active = selectedSpecies === species;
              return (
                <button
                  key={species}
                  type="button"
                  onClick={() => setSelectedSpecies(species)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "border-purple-900 bg-purple-800 text-white"
                      : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {species === "Todos"
                    ? "Todos"
                    : species === "Gato"
                    ? "Gatos"
                    : species === "Cão"
                    ? "Cães"
                    : species === "Ave"
                    ? "Aves"
                    : species === "Coelho"
                    ? "Coelhos"
                    : species === "Roedor"
                    ? "Roedores"
                    : "Peixes"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {filteredListings.map((listing) => (
            <article
              key={listing.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-purple-800">
                  <span>{listing.modality}</span>
                  <span>Avaliação verificada · {listing.rating.toFixed(1)} ★</span>
                </div>

                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {listing.title}
                </h3>

                <p className="mt-2 text-sm text-slate-700">{listing.summary}</p>

                <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                  {listing.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-purple-800">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-500">
                  {listing.city} · {listing.rateLabel}
                </span>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="rounded-lg border border-purple-900 bg-purple-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-900"
                >
                  Interagir na Conta
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Rodapé completo com bloco de segurança, sublinks públicos, Sobre nós e Contate-nos */}
      <footer
        id="rodape-publico"
        className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-200"
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* Pilares de Segurança movidos para o rodapé */}
          <div
            id="seguranca-privacidade"
            className="grid gap-6 border-b border-slate-800 pb-10 md:grid-cols-3"
          >
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <h3 className="text-base font-bold text-white">
                Segurança do Usuário
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Mensagens com filtro de conduta, verificação de arquivos e
                comunicação organizada sem exposição indevida.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <h3 className="text-base font-bold text-white">
                Segurança de Dados (LGPD)
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Coleta mínima necessária, contatos diretos mascarados até
                confirmação do serviço e sanitização de entradas.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <h3 className="text-base font-bold text-white">
                Classificados Claros
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Anúncios filtráveis por espécie com critérios objetivos e
                respeito à privacidade dos participantes.
              </p>
            </div>
          </div>

          {/* Sublinks públicos, Sobre nós e Contate-nos */}
          <div className="grid gap-8 pt-10 md:grid-cols-3">
            <div id="sobre-nos">
              <h3 className="text-base font-bold text-white">Sobre nós</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                O MiauCare é um projeto acadêmico da disciplina de Interface
                Homem-Máquina (UNIUBE), focado em usabilidade, acessibilidade,
                clareza de navegação e cuidado domiciliar responsável para
                animais de estimação.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Navegação Pública
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection("inicio-publico")}
                    className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-left font-medium text-slate-100 hover:bg-slate-700"
                  >
                    Início Público
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection("classificados-publicos")}
                    className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-left font-medium text-slate-100 hover:bg-slate-700"
                  >
                    Classificados por Espécie
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection("seguranca-privacidade")}
                    className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-left font-medium text-slate-100 hover:bg-slate-700"
                  >
                    Segurança e LGPD
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection("sobre-nos")}
                    className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-left font-medium text-slate-100 hover:bg-slate-700"
                  >
                    Sobre nós
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection("contate-nos")}
                    className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-left font-medium text-slate-100 hover:bg-slate-700"
                  >
                    Contate-nos
                  </button>
                </li>
              </ul>
            </div>

            <div id="contate-nos">
              <h3 className="text-base font-bold text-white">Contate-nos</h3>
              <p className="mt-2 text-sm text-slate-300">
                Dúvidas, sugestões ou solicitações relacionadas à plataforma e à
                privacidade dos dados:
              </p>
              <p className="mt-3 text-sm font-semibold text-purple-300">
                E-mail: contato@miaucare.com.br
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="rounded-lg border border-purple-500 bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600"
                >
                  Entrar ou Criar Conta
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
            MiauCare · Projeto de Interface Homem-Máquina (UNIUBE) ·
            contato@miaucare.com.br
          </div>
        </div>
      </footer>
    </div>
  );
};