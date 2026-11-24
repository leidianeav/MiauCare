import { useState, type FormEvent, type ChangeEvent } from "react";
import type { PetCategoryPlural, PetItem } from "../types/miaucare";
import { moderateImageFile } from "../utils/moderation";
import { isSafeMediaUrl, sanitizeText } from "../utils/security";
import { SPECIES_ICONS } from "../utils/species";

interface MyPetsViewProps {
  pets: PetItem[];
  onAdd: (pet: Omit<PetItem, "id">) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
  onToast: (msg: string) => void;
}

const PET_SPECIES: readonly PetCategoryPlural[] = [
  "Aves",
  "Cães",
  "Coelhos",
  "Gatos",
  "Peixes",
  "Roedores",
];

export function MyPetsView({ pets, onAdd, onDelete, onBack, onToast }: MyPetsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<PetCategoryPlural>("Gatos");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [care, setCare] = useState("");
  const [photo, setPhoto] = useState("");

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mod = moderateImageFile(file);
    if (!mod.ok) {
      onToast(mod.reason || "Arquivo bloqueado.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const val = String(reader.result || "");
      if (isSafeMediaUrl(val)) setPhoto(val);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeText(name, 60);
    if (!cleanName) return;
    onAdd({
      name: cleanName,
      species,
      breed: sanitizeText(breed, 60),
      age: sanitizeText(age, 30),
      specialCare: sanitizeText(care, 300),
      photo: isSafeMediaUrl(photo) ? photo : undefined,
    });
    onToast(`Pet "${cleanName}" cadastrado.`);
    setName("");
    setBreed("");
    setAge("");
    setCare("");
    setPhoto("");
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="text-xs font-bold text-purple-700">
            ← Voltar
          </button>
          <h2 className="text-xl font-extrabold">Meus Pets</h2>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            + Cadastrar Pet
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900">Novo Pet</h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
              {photo && isSafeMediaUrl(photo) ? (
                <img src={photo} alt="Pré-visualização do pet" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl" aria-hidden="true">
                  {SPECIES_ICONS[species] ?? "🐾"}
                </span>
              )}
            </div>
            <label className="cursor-pointer bg-purple-50 text-purple-700 font-bold text-xs px-4 py-2.5 rounded-xl">
              Escolher foto
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Pet *"
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value as PetCategoryPlural)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs"
            >
              {PET_SPECIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Raça"
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Idade (ex: 2 anos)"
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <textarea
            rows={2}
            value={care}
            onChange={(e) => setCare(e.target.value)}
            placeholder="Cuidados especiais..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs">
              Salvar Pet
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="h-36 bg-slate-100 flex items-center justify-center overflow-hidden">
              {pet.photo && isSafeMediaUrl(pet.photo) ? (
                <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl" aria-hidden="true">
                  {SPECIES_ICONS[pet.species] ?? "🐾"}
                </span>
              )}
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">{sanitizeText(pet.name, 60)}</h4>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(pet.id);
                    onToast(`Pet "${pet.name}" removido.`);
                  }}
                  className="text-xs text-red-500 font-bold"
                >
                  Remover
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {pet.species} {pet.breed ? `· ${sanitizeText(pet.breed, 50)}` : ""}{" "}
                {pet.age ? `· ${sanitizeText(pet.age, 30)}` : ""}
              </p>
              {pet.specialCare && (
                <div className="mt-auto pt-2 bg-amber-50 border border-amber-100 rounded-xl p-2 text-[11px] text-amber-800">
                  <strong>Cuidados:</strong> {sanitizeText(pet.specialCare, 300)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
