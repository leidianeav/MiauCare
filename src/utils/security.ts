export function sanitizeText(value: unknown, maxLen = 400): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isSafeMediaUrl(url: unknown): url is string {
  if (!url || typeof url !== "string") return false;
  return (
    url.startsWith("data:image/") ||
    url.startsWith("data:video/") ||
    url.startsWith("https://")
  );
}

export function maskContact(contact: string): string {
  const clean = sanitizeText(contact, 80);
  if (!clean) return "Protegido até confirmação";
  if (clean.includes("@")) {
    const [user, domain] = clean.split("@");
    return `${user.slice(0, 2)}***@${domain}`;
  }
  const digits = clean.replace(/\D/g, "");
  if (digits.length >= 8) {
    return `(${digits.slice(0, 2)}) *****-${digits.slice(-4)}`;
  }
  return "Contato protegido";
}
