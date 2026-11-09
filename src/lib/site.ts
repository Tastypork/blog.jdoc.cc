export const SITE = {
  name: "CrossWords",
  tagline: "Blog by Joshua O'Callaghan",
  description:
    "CrossWords is a blog by Joshua O'Callaghan with honest, scripture-grounded thoughts on who Jesus is, waiting in faith, and walking with Christ.",
  url: "https://blog.jdoc.cc",
  author: {
    name: "Joshua O'Callaghan",
    url: "https://jocal.dev"
  },
  locale: "en_US",
  /** Browser chrome. Follows the page, not the steel-blue accent. */
  themeColor: {
    light: "#ffffff",
    dark: "#141414"
  }
} as const;

export const NEWSLETTER_FORM = "newsletter";
export const CONTACT_FORM = "contact";
/** Honeypot field name shared by every form on this site (see form-spam-protection skill). */
export const HONEYPOT_FIELD = "fax";

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Phoenix",
    ...options
  }).format(date);
}

export function formatDateTime(date: Date): string {
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Phoenix",
    timeZoneName: "short"
  }).format(date);
  return `${formatDate(date)}, ${time}`;
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
