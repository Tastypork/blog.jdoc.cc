import { HONEYPOT_FIELD } from "../../src/lib/site";
import { json } from "./_shared/http";
import { readNewsletter } from "./_shared/payload";
import { readSignedJson } from "./_shared/signature";
import { resendClient, storePendingSubscriber } from "./_shared/subscribers";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const signed = await readSignedJson(req);
    if (signed instanceof Response) return signed;
    const signup = readNewsletter(signed, HONEYPOT_FIELD);
    if (signup.kind === "newsletter") {
      await storePendingSubscriber(resendClient(), signup.email, signup.submissionId);
    }
    return json({ ok: true });
  } catch (error) {
    console.error("subscribe failed:", error instanceof Error ? error.message : "unknown");
    return new Response("Could not finish", { status: 500 });
  }
};

export const config = {
  path: "/api/subscribers"
};
