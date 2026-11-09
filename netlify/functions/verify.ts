import { normalizeEmail } from "./_shared/payload";
import { redirect, requireEnv } from "./_shared/http";
import { confirmSubscription, resendClient } from "./_shared/subscribers";
import { readVerifyToken } from "./_shared/token";

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const token = new URL(req.url).searchParams.get("token") ?? "";
  try {
    const email = normalizeEmail(await readVerifyToken(token, requireEnv("LINK_SECRET")));
    if (!email) return redirect("/verify-expired");
    await confirmSubscription(resendClient(), email);
    return redirect("/verified");
  } catch (error) {
    console.error("verify failed:", error instanceof Error ? error.message : "unknown");
    return new Response("Could not finish", { status: 500 });
  }
};

export const config = {
  path: "/api/verify"
};
