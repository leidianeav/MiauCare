export interface ModerationResult {
  flagged: boolean;
  reasons: string[];
  sanitizedText: string;
}

const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    reason: "Possível CPF informado na mensagem",
  },
  {
    pattern: /\b(senha|password|pin|c[oó]digo\s+do\s+alarme)\b/i,
    reason: "Referência a senha ou código de acesso",
  },
  {
    pattern: /\b(chave\s+pix|pix|cart[aã]o\s+de\s+cr[eé]dito|cvv)\b/i,
    reason: "Referência a dados financeiros ou de pagamento",
  },
  {
    pattern: /\b(chave\s+de\s+casa|c[oó]pia\s+da\s+chave)\b/i,
    reason: "Referência a chaves de acesso ao imóvel",
  },
];

export function moderateMessageText(rawText: string): ModerationResult {
  const sanitizedText = rawText.replace(/\s+/g, " ").trim();
  const reasons: string[] = [];

  for (const item of SENSITIVE_PATTERNS) {
    if (item.pattern.test(sanitizedText)) {
      reasons.push(item.reason);
    }
  }

  return {
    flagged: reasons.length > 0,
    reasons,
    sanitizedText,
  };
}