import { announceCutoff, postsToAnnounce, readFeed } from "../../src/lib/feed";
import { SITE } from "../../src/lib/site";
import { notifyDiscord } from "./_shared/discord";
import { json, optionalEnv } from "./_shared/http";
import { readDeploy } from "./_shared/payload";
import { readSignedJson } from "./_shared/signature";
import { listBroadcastNames, resendClient, sendAnnouncement } from "./_shared/subscribers";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const signed = await readSignedJson(req);
    if (signed instanceof Response) return signed;

    const deploy = readDeploy(signed);
    if (!deploy || deploy.state !== "ready" || deploy.context !== "production") {
      return json({ skipped: "not-production" });
    }
    if (!deploy.origin) return new Response("Missing deploy URL", { status: 500 });

    const feedUrl = new URL("/feed.json", deploy.origin);
    const feedResponse = await fetch(feedUrl, { signal: AbortSignal.timeout(10_000) });
    if (!feedResponse.ok) throw new Error(`Feed responded ${feedResponse.status}`);
    const posts = readFeed(await feedResponse.json(), SITE.url);

    const resend = resendClient();
    const broadcasts = await listBroadcastNames(resend);
    const announcements = postsToAnnounce(posts, broadcasts, announceCutoff(optionalEnv("ANNOUNCE_AFTER")));
    const dryRun = new URL(req.url).searchParams.get("dry_run") === "1";
    if (dryRun) {
      return json({
        posts: announcements.map((item) => ({
          slug: item.post.slug,
          action: item.action
        }))
      });
    }

    // Discord uses this same list and does not check who confirmed email.
    // Mail still goes out when Discord rejects the post. YukiBot ignores a slug it already announced.
    const discord: string[] = [];
    const discordFailed: string[] = [];
    for (const announcement of announcements) {
      try {
        await notifyDiscord(announcement.post);
        discord.push(announcement.post.slug);
      } catch (error) {
        discordFailed.push(announcement.post.slug);
        console.error("discord failed:", error instanceof Error ? error.message : "unknown");
      }
      await sendAnnouncement(resend, announcement);
    }
    return json({
      sent: announcements.map((item) => item.post.slug),
      discord,
      ...(discordFailed.length > 0 ? { discordFailed } : {})
    });
  } catch (error) {
    console.error("notify failed:", error instanceof Error ? error.message : "unknown");
    return new Response("Could not finish", { status: 500 });
  }
};

export const config = {
  path: "/api/notify"
};
