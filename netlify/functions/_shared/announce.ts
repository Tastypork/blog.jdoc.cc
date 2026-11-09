import { announceCutoff, postsToAnnounce, readFeed } from "../../../src/lib/feed";
import { SITE } from "../../../src/lib/site";
import { notifyDiscord } from "./discord";
import { optionalEnv } from "./http";
import { listBroadcastNames, resendClient, sendAnnouncement } from "./subscribers";

export type AnnounceResult = {
  posts: number;
  cutoff: string;
  sent: string[];
  discord: string[];
  discordFailed: string[];
};

/** Announce every new post in the live feed. Discord and email are separate. */
export async function announceReadyDeploy(origin: string, send = true): Promise<AnnounceResult> {
  const feedUrl = new URL("/feed.json", origin);
  const feedResponse = await fetch(feedUrl, { signal: AbortSignal.timeout(10_000) });
  if (!feedResponse.ok) throw new Error(`Feed responded ${feedResponse.status}`);
  const posts = readFeed(await feedResponse.json(), SITE.url);

  const resend = resendClient();
  const broadcasts = await listBroadcastNames(resend);
  const cutoff = optionalEnv("ANNOUNCE_AFTER") ?? "default";
  const announcements = postsToAnnounce(posts, broadcasts, announceCutoff(cutoff === "default" ? undefined : cutoff));
  console.log(
    `announce posts=${posts.length} announce=${announcements.map((item) => item.post.slug).join(",") || "none"} cutoff=${cutoff}`
  );

  const discord: string[] = [];
  const discordFailed: string[] = [];
  if (send) {
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
  }

  return {
    posts: posts.length,
    cutoff,
    sent: announcements.map((item) => item.post.slug),
    discord,
    discordFailed
  };
}
