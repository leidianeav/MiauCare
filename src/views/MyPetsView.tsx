import React, { useState } from "react";
import { PetProfile, SpeciesType } from "../types/miaucare";

interface MyPetsViewProps {
  pets: PetProfile[];
  onAddPet: (pet: PetProfile) => void;
  onAddPetObservation: (petId: string, text: string) => void;
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

export const MyPetsView: React.FC<MyPetsViewProps> = ({
  pets,
  onAddPet,
  onAddPetObservation,
  onReturn,
}) => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<SpeciesType>("Gato");
  const [ageOrNotes, setAgeOrNotes] = useState("");
  const [obsInputs, setObsInputs] = useState<Record<string, string>>({});

  const handleSubmitPet = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    const newPet: PetProfile = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      species,
      ageOrNotes:
        ageOrNotes.trim() || "Rotina domiciliar cadastrada pelo tutor",
      observations: [],
    };

    onAddPet(newPet);
    setName("");
    setAgeOrNotes("");
  };

  const handleSavePetObs = (petId: string) => {
    const text = (obsInputs[petId] || "").trim();
    if (!text) return;
    onAddPetObservation(petId, text);
    setObsInputs((prev) => ({ ...prev, [petId]: "" }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Meus Pets</h1>
          <p className="mt-1 text-sm text-slate-600">
            Cadastre seus animais, registre cuidados de rotina e grave
            observações importantes.
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
            onSubmit={handleSubmitPet}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900">Cadastrar Pet</h2>

            <div>
              <label
                htmlFor="pet-name"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Nome do pet
              </label>
              <input
                id="pet-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Thor"
                required
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="pet-species"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Espécie
              </label>
              <select
                id="pet-species"
                value={species}
                onChange={(e) => setSpecies(e.target.value as SpeciesType)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
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
                htmlFor="pet-notes"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Idade e cuidados habituais
              </label>
              <textarea
                id="pet-notes"
                rows={3}
                value={ageOrNotes}
                onChange={(e) => setAgeOrNotes(e.target.value)}
                placeholder="Ex.: 3 anos · Alimentação às 8h e 19h, sem restrições"
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
                Confirmar Pet
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-5 lg:col-span-7">
          {pets.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Nenhum pet cadastrado no momento. Utilize o formulário ao lado
              para adicionar o primeiro pet.
            </div>
          ) : (
            pets.map((pet) => (
              <article
                key={pet.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {pet.name}
                  </h3>
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-900">
                    {pet.species}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-700">{pet.ageOrNotes}</p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <label
                    htmlFor={`obs-pet-${pet.id}`}
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
                  >
                    Observações Gravadas do Pet
                  </label>

                  {pet.observations.length > 0 && (
                    <ul className="mb-3 space-y-1.5">
                      {pet.observations.map((obs) => (
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
                      id={`obs-pet-${pet.id}`}
                      type="text"
                      value={obsInputs[pet.id] || ""}
                      onChange={(e) =>
                        setObsInputs((prev) => ({
                          ...prev,
                          [pet.id]: e.target.value,
                        }))
                      }
                      placeholder="Escreva uma observação para gravar..."
                      className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSavePetObs(pet.id)}
                      className="rounded-lg border border-purple-900 bg-purple-800 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-900"
                    >
                      Gravar Observação
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
};