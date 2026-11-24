import type { ModerationResult } from "../types/miaucare";

const SWEAR_PT: readonly string[] = [
  "merda", "porra", "caralho", "fdp", "foda", "fodase", "filho da puta", "puta que pariu",
  "otario", "otária", "cuzao", "cuzão", "buceta", "arrombado", "arrombada",
  "desgraca", "desgraça", "idiota", "imbecil", "retardado", "retardada",
  "vadia", "vagabundo", "vagabunda", "safado", "safada", "cretino", "cretina",
  "lixo", "palhaço", "palhaco", "inutil", "inútil", "estupido", "estúpido",
];

function normalizeForFilter(input: string): string {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, " ");
}

export function containsSwear(text: string): boolean {
  const norm = normalizeForFilter(text);
  return SWEAR_PT.some((word) => {
    const wn = normalizeForFilter(word);
    return wn.length > 0 && norm.includes(wn);
  });
}

const IMG_BAD: readonly string[] = [
  "nude", "naked", "nsfw", "porn", "xxx", "explicit", "lewd", "erotic", "topless", "adult_content",
];

export function moderateImageFile(file: File | undefined | null): ModerationResult {
  const name = String(file?.name || "").toLowerCase();
  if (IMG_BAD.some((token) => name.includes(token))) {
    return {
      ok: false,
      reason: "Conteúdo potencialmente impróprio detectado. Envio bloqueado pela política MiauCare.",
    };
  }
  if ((file?.size || 0) > 50 * 1024 * 1024) {
    return {
      ok: false,
      reason: "Arquivo muito grande. Máximo permitido: 50 MB.",
    };
  }
  return { ok: true };
}
