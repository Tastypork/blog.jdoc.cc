const encoder = new TextEncoder();

export async function verifyNetlifySignature(token: string, body: string, secret: string): Promise<boolean> {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;
  const [header, claims, signature] = parts;
  if (!header || !claims || !signature) return false;

  let headerJson: { alg?: string };
  try {
    headerJson = JSON.parse(decodeText(header));
  } catch {
    return false;
  }
  if (headerJson.alg !== "HS256") return false;

  const expected = new Uint8Array(await hmacSha256(secret, `${header}.${claims}`));
  const actual = decodeBase64Url(signature);
  if (!actual || !fixedEqual(actual, expected)) return false;

  let payload: { iss?: string; sha256?: string };
  try {
    payload = JSON.parse(decodeText(claims));
  } catch {
    return false;
  }
  if (payload.iss !== "netlify" || typeof payload.sha256 !== "string") return false;

  const hashed = await sha256Hex(body);
  const claim = payload.sha256.toLowerCase();
  if (claim.length !== hashed.length) return false;
  return fixedEqual(encoder.encode(claim), encoder.encode(hashed));
}

export async function readSignedJson(req: Request): Promise<unknown | Response> {
  const secret = Netlify.env.get("WEBHOOK_SECRET")?.trim();
  if (!secret) return new Response("Not configured", { status: 500 });
  const body = await req.text();
  const signature = req.headers.get("x-webhook-signature") ?? "";
  if (!(await verifyNetlifySignature(signature, body, secret))) {
    return new Response("Invalid signature", { status: 401 });
  }
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
}

async function hmacSha256(secret: string, value: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ]);
  return crypto.subtle.sign("HMAC", key, encoder.encode(value));
}

async function sha256Hex(value: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function decodeText(value: string): string {
  const bytes = decodeBase64Url(value);
  if (!bytes) throw new Error("Bad encoding");
  return new TextDecoder().decode(bytes);
}

function decodeBase64Url(value: string): Uint8Array | null {
  if (!/^[\w-]+$/.test(value)) return null;
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/") + pad;
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  } catch {
    return null;
  }
}

function fixedEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff |= left[index]! ^ right[index]!;
  return diff === 0;
}
