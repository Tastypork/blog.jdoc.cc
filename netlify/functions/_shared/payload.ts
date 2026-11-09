const EMAIL =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return null;
  return email;
}

export type NewsletterSignup =
  | { kind: "ignore" }
  | { kind: "newsletter"; email: string; submissionId: string | null };

export function readNewsletter(value: unknown, honeypotField: string): NewsletterSignup {
  if (!value || typeof value !== "object") return { kind: "ignore" };
  const record = value as Record<string, unknown>;
  const data = record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>) : {};
  const formName = text(record.form_name) ?? text(data["form-name"]) ?? text(data.form_name);
  if (formName !== "newsletter") return { kind: "ignore" };
  const honeypot = text(data[honeypotField]) ?? "";
  if (honeypot.trim() !== "") return { kind: "ignore" };
  const email = normalizeEmail(data.email ?? record.email);
  if (!email) return { kind: "ignore" };
  return { kind: "newsletter", email, submissionId: submissionId(record.id) };
}

export function readDeploy(value: unknown): { state: string; context: string; origin: string | null } | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.state !== "string" || typeof record.context !== "string") return null;
  return {
    state: record.state,
    context: record.context,
    origin: httpsOrigin(record.deploy_ssl_url) ?? httpsOrigin(record.ssl_url) ?? httpsOrigin(record.url)
  };
}

function submissionId(value: unknown): string | null {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,200}$/.test(value)) return null;
  return value;
}

function text(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function httpsOrigin(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}
