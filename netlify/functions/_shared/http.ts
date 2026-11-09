import { SITE } from "../../../src/lib/site";

export function requireEnv(name: string): string {
  const value = Netlify.env.get(name)?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = Netlify.env.get(name)?.trim();
  return value || undefined;
}

export function redirect(path: string): Response {
  return Response.redirect(new URL(path, SITE.url).href, 303);
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
