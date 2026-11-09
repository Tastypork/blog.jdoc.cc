import { HONEYPOT_FIELD } from "../../src/lib/site";
import { redirect } from "./_shared/http";
import { normalizeEmail } from "./_shared/payload";
import { resendClient, resendConfirmationIfPending } from "./_shared/subscribers";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const form = await req.formData().catch(() => null);
    const honeypot = form ? String(form.get(HONEYPOT_FIELD) ?? "").trim() !== "" : false;
    const email = form ? normalizeEmail(form.get("email")) : null;
    if (!honeypot && email) await resendConfirmationIfPending(resendClient(), email);
    return redirect("/verification-sent");
  } catch (error) {
    console.error("resend verification failed:", error instanceof Error ? error.message : "unknown");
    return new Response("Could not finish", { status: 500 });
  }
};

export const config = {
  path: "/api/verify/resend"
};
