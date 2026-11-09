const encoder = new TextEncoder();
const TOKEN_TTL_SECONDS = 48 * 60 * 60;

export async function signVerifyToken(email: string, secret: string, now = Date.now()): Promise<string> {
  const payload = encodeBase64Url(
    encoder.encode(
      JSON.stringify({
        email,
        purpose: "verify",
        exp: Math.floor(now / 1000) + TOKEN_TTL_SECONDS
      })
    )
  );
  const signature = encodeBase64Url(new Uint8Array(await hmacSha256(secret, payload)));
  return `${payload}.${signature}`;
}

export async function readVerifyToken(token: string, secret: string, now = Date.now()): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expected = new Uint8Array(await hmacSha256(secret, payload));
  const actual = decodeBase64Url(signature);
  if (!actual || !fixedEqual(actual, expected)) return null;

  let data: { email?: unknown; purpose?: unknown; exp?: unknown };
  try {
    data = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload) ?? new Uint8Array()));
  } catch {
    return null;
  }
  if (data.purpose !== "verify" || typeof data.email !== "string" || typeof data.exp !== "number") return null;
  if (data.exp * 1000 <= now) return null;
  return data.email;
}

async function hmacSha256(secret: string, value: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ]);
  return crypto.subtle.sign("HMAC", key, encoder.encode(value));
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
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
