import { announceReadyDeploy } from "./_shared/announce";
import { json } from "./_shared/http";
import { readDeploy } from "./_shared/payload";
import { readSignedJson } from "./_shared/signature";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  console.log("notify called");
  try {
    const signed = await readSignedJson(req);
    if (signed instanceof Response) {
      console.error(`notify rejected: ${signed.status}`);
      return signed;
    }

    const deploy = readDeploy(signed);
    if (!deploy || deploy.state !== "ready" || deploy.context !== "production") {
      console.log("notify skipped: not-production");
      return json({ skipped: "not-production" });
    }
    if (!deploy.origin) return new Response("Missing deploy URL", { status: 500 });

    const dryRun = new URL(req.url).searchParams.get("dry_run") === "1";
    if (dryRun) {
      const result = await announceReadyDeploy(deploy.origin, false);
      return json({
        posts: result.sent.map((slug) => ({ slug })),
        cutoff: result.cutoff
      });
    }

    const result = await announceReadyDeploy(deploy.origin);
    console.log(`notify sent=${result.sent.join(",") || "none"} discord=${result.discord.join(",") || "none"}`);
    return json({
      sent: result.sent,
      discord: result.discord,
      ...(result.discordFailed.length > 0 ? { discordFailed: result.discordFailed } : {})
    });
  } catch (error) {
    console.error("notify failed:", error instanceof Error ? error.message : "unknown");
    return new Response("Could not finish", { status: 500 });
  }
};

export const config = {
  path: "/api/notify"
};
