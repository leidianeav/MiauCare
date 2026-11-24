import type { SingularSpecies } from "../types/miaucare";
import { sanitizeText } from "./security";

const SPECIES_MAP: Record<string, SingularSpecies> = {
  "cão": "Cão",
  cao: "Cão",
  "cães": "Cão",
  caes: "Cão",
  gato: "Gato",
  gatos: "Gato",
  ave: "Ave",
  aves: "Ave",
  coelho: "Coelho",
  coelhos: "Coelho",
  roedor: "Roedor",
  roedores: "Roedor",
  peixe: "Peixe",
  peixes: "Peixe",
};

export function normalizeSpecies(species: string): SingularSpecies | string {
  const key = String(species || "").trim().toLowerCase();
  return SPECIES_MAP[key] ?? sanitizeText(species, 30);
}

export const SPECIES_ICONS: Record<string, string> = {
  Aves: "🦜",
  "Cães": "🐕",
  Coelhos: "🐇",
  Gatos: "🐈",
  Peixes: "🐟",
  Roedores: "🐭",
  Ave: "🦜",
  "Cão": "🐕",
  Coelho: "🐇",
  Gato: "🐈",
  Peixe: "🐟",
  Roedor: "🐭",
};

export const PRESET: Record<SingularSpecies, Array<{ cat: string; text: string }>> = {
  "Cão": [
    { cat: "Alimentação", text: "Potes lavados, água fresca trocada e ração servida na medida certa" },
    { cat: "Passeio", text: "Passeio realizado com guia e peitoral ajustados com segurança" },
    { cat: "Higiene", text: "Fezes e urina recolhidas (tapetes/quintal) e patas higienizadas" },
    { cat: "Saúde", text: "Medicação administrada (se prescrita) e avaliação de apetite/fezes" },
    { cat: "Segurança", text: "Brincadeiras realizadas e portas/portões conferidos antes de sair" },
  ],
  Gato: [
    { cat: "Higiene", text: "Caixa de areia limpa (torrões e fezes removidos) e substrato reposto" },
    { cat: "Alimentação", text: "Potes/fontes lavados, água renovada e ração ou sachê servidos" },
    { cat: "Enriquecimento", text: "Sessão de brincadeiras e enriquecimento respeitando o ritmo do gato" },
    { cat: "Saúde", text: "Checagem de saúde (urina normal, ausência de vômitos ou estresse)" },
    { cat: "Segurança", text: "Telas de proteção e portas conferidas antes do encerramento" },
  ],
  Ave: [
    { cat: "Alimentação", text: "Bebedouro lavado, água trocada e sementes/ração/frutas repostas" },
    { cat: "Higiene", text: "Papel do fundo da gaiola trocado e restos perecíveis removidos" },
    { cat: "Segurança", text: "Gaiola protegida de correntes de vento, sol forte e predadores" },
    { cat: "Saúde", text: "Observação clínica (ave ativa, penas alinhadas e sem apatia)" },
  ],
  Coelho: [
    { cat: "Alimentação", text: "Feno fresco à vontade, água limpa e porção de ração/folhas servida" },
    { cat: "Higiene", text: "Bandeja sanitária higienizada e granulado/tapete trocado" },
    { cat: "Exercício", text: "Tempo de exercício fora do recinto em área segura e sem fios" },
    { cat: "Saúde", text: "Conferência digestiva (produção normal de fezes e bom apetite)" },
  ],
  Roedor: [
    { cat: "Alimentação", text: "Bico do bebedouro testado, água renovada e ração/feno repostos" },
    { cat: "Higiene", text: "Áreas úmidas da forração removidas e restos frescos descartados" },
    { cat: "Ambiente", text: "Temperatura e ventilação do ambiente verificadas (proteção contra calor)" },
    { cat: "Saúde", text: "Checagem visual de olhos, pelagem e nível de atividade" },
  ],
  Peixe: [
    { cat: "Alimentação", text: "Ração ofertada na quantidade exata orientada (Regra dos 2 minutos)" },
    { cat: "Equipamentos", text: "Filtro, bomba de oxigênio, termostato e luzes conferidos" },
    { cat: "Qualidade da Água", text: "Temperatura no termômetro checada e água límpida/sem odor" },
    { cat: "Saúde", text: "Contagem dos peixes e observação de nado e aparência saudável" },
  ],
};
