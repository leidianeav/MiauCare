import { SpeciesType } from "../types/miaucare";

export const ALL_SPECIES: SpeciesType[] = [
  "Gato",
  "Cão",
  "Ave",
  "Coelho",
  "Roedor",
  "Peixe",
];

export function formatSpeciesLabel(species: SpeciesType): string {
  switch (species) {
    case "Gato":
      return "Gato (Felino)";
    case "Cão":
      return "Cão (Canino)";
    case "Ave":
      return "Ave";
    case "Coelho":
      return "Coelho";
    case "Roedor":
      return "Roedor";
    case "Peixe":
      return "Peixe";
    default:
      return species;
  }
}

export function getSpeciesPluralLabel(species: SpeciesType): string {
  switch (species) {
    case "Gato":
      return "Gatos";
    case "Cão":
      return "Cães";
    case "Ave":
      return "Aves";
    case "Coelho":
      return "Coelhos";
    case "Roedor":
      return "Roedores";
    case "Peixe":
      return "Peixes";
    default:
      return species;
  }
}