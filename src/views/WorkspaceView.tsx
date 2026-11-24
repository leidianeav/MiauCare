import React, { useState } from "react";
import { ServiceListing, SpeciesType } from "../types/miaucare";

interface WorkspaceViewProps {
  listings: ServiceListing[];
  onAddListing: (listing: ServiceListing) => void;
  onAddListingObservation: (listingId: string, text: string) => void;
  onReturn: () => void;
}

const SPECIES_OPTIONS: SpeciesType[] = [
  "Gato",
  "Cão",
  "Ave",
  "Coelho",
  "Roedor",
  "Peixe",
];

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  listings,
  onAddListing,
  onAddListingObservation,
  onReturn,
}) => {
  const [title, setTitle] = useState("");
  const [species, setSpecies] = useState<SpeciesType>("Gato");
  const [modality, setModality] = useState("Atendimento em domicílio · Rotina diária");
  const [city, setCity] = useState("Uberlândia - MG");
  const [rateLabel, setRateLabel] = useState("A combinar por visita");
  const [summary, setSummary] = useState("");
  const [checklistText, setChecklistText] = useState(
    "Conferir portas e janelas\nTrocar água e alimento\nRegistrar observações da visita"
  );
  const [obsInputs, setObsInputs] = useState<Record<string, string>>({});

  const handleCreateListing = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const parsedChecklist = checklistText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const newItem: ServiceListing = {
      id: `srv-${Date.now()}`,
      title: title.trim(),
      species,
      modality: modality.trim() || "Atendimento em domicílio",
      city: city.trim() || "Uberlândia - MG",
      rateLabel: rateLabel.trim() || "A combinar",
      rating: 5.0,
      summary: summary.trim(),
      checklist:
        parsedChecklist.length > 0
          ? parsedChecklist
          : ["Conferir bem-estar e ambiente do pet"],
      observations: [],
    };

    onAddListing(newItem);
    setTitle("");
    setSummary("");
  };

  const handleSaveObservation = (listingId: string) => {
    const text = (obsInputs[listingId] || "").trim();
    if (!text) return;
    onAddListingObservation(listingId, text);
    setObsInputs((prev) => ({ ...prev, [listingId]: "" }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Anunciar e Atendimentos
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Publique rotinas de cuidado, acompanhe checklists e grave
            observações dos atendimentos.
          </p>
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
        >
          Retornar
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <form
            onSubmit={handleCreateListing}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900">Novo Anúncio</h2>

            <div>
              <label
                htmlFor="srv-title"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Título do anúncio
              </label>
              <input
                id="srv-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Cuidado diário para gatos no lar"
                required
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="srv-species"
                  className="mb-1 block text-sm font-semibold text-slate-800"
                >
                  Espécie principal
                </label>
                <select
                  id="srv-species"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as SpeciesType)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
                >
                  {SPECIES_OPTIONS.map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="srv-city"
                  className="mb-1 block text-sm font-semibold text-slate-800"
                >
                  Cidade
                </label>
                <input
                  id="srv-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="srv-modality"
                  className="mb-1 block text-sm font-semibold text-slate-800"
                >
                  Modalidade
                </label>
                <input
                  id="srv-modality"
                  type="text"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="srv-rate"
                  className="mb-1 block text-sm font-semibold text-slate-800"
                >
                  Valor / Condição
                </label>
                <input
                  id="srv-rate"
                  type="text"
                  value={rateLabel}
                  onChange={(e) => setRateLabel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="srv-summary"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Descrição da rotina
              </label>
              <textarea
                id="srv-summary"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Descreva os cuidados prestados e combinados da visita."
                required
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="srv-checklist"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Checklist (um item por linha)
              </label>
              <textarea
                id="srv-checklist"
                rows={3}
                value={checklistText}
                onChange={(e) => setChecklistText(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onReturn}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                Retornar
              </button>
              <button
                type="submit"
                className="rounded-lg border border-purple-900 bg-purple-800 px-5 py-2 text-sm font-bold text-white hover:bg-purple-900"
              >
                Confirmar Anúncio
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-5 lg:col-span-7">
          {listings.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-purple-800">
                <span>
                  {item.species} · {item.modality}
                </span>
                <span>{item.city}</span>
              </div>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-1.5 text-sm text-slate-700">{item.summary}</p>

              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Checklist de Execução
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {item.checklist.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-bold text-purple-800">✓</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <label
                  htmlFor={`obs-srv-${item.id}`}
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
                >
                  Observações Gravadas do Atendimento
                </label>

                {item.observations.length > 0 && (
                  <ul className="mb-3 space-y-1.5">
                    {item.observations.map((obs) => (
                      <li
                        key={obs.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
                      >
                        <span className="font-semibold text-purple-900">
                          [{obs.createdAt}]
                        </span>{" "}
                        {obs.text}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id={`obs-srv-${item.id}`}
                    type="text"
                    value={obsInputs[item.id] || ""}
                    onChange={(e) =>
                      setObsInputs((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    placeholder="Escreva uma observação para gravar..."
                    className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveObservation(item.id)}
                    className="rounded-lg border border-purple-900 bg-purple-800 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-900"
                  >
                    Gravar Observação
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};