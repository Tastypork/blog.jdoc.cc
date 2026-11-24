import { announceCutoff, postsToAnnounce, readFeed } from "../../../src/lib/feed";
import { SITE } from "../../../src/lib/site";
import { mailDelivery } from "../../../src/lib/send-window";
import { notifyDiscord } from "./discord";
import { optionalEnv } from "./http";
import { listBroadcastNames, resendClient, sendAnnouncement } from "./subscribers";

export type AnnounceResult = {
  posts: number;
  cutoff: string;
  sent: string[];
  discord: string[];
  discordFailed: string[];
  /** When Resend will release the broadcasts, or null when they go out now. */
  scheduledAt: string | null;
};

/**
 * Email confirmed subscribers about posts that do not already have a broadcast.
 * Outside 5:00 AM to 5:00 PM Phoenix time, Resend holds that mail until the next 5:00 AM.
 * POST every post on or after the cutoff to YukiBot. YukiBot drops a slug it already announced,
 * so an email that already went out can still reach Discord. The Discord ping is not held for the mail window.
 */
export async function announceReadyDeploy(origin: string, send = true): Promise<AnnounceResult> {
  const feedUrl = new URL("/feed.json", origin);
  const feedResponse = await fetch(feedUrl, { signal: AbortSignal.timeout(10_000) });
  if (!feedResponse.ok) throw new Error(`Feed responded ${feedResponse.status}`);
  const posts = readFeed(await feedResponse.json(), SITE.url);

  const resend = resendClient();
  const broadcasts = await listBroadcastNames(resend);
  const cutoff = optionalEnv("ANNOUNCE_AFTER") ?? "default";
  const cutoffMs = announceCutoff(cutoff === "default" ? undefined : cutoff);
  const announcements = postsToAnnounce(posts, broadcasts, cutoffMs);
  const discordPosts = posts
    .filter((post) => {
      const published = Date.parse(post.pubDate);
      return Number.isFinite(published) && published >= cutoffMs;
    })
    .sort((left, right) => Date.parse(left.pubDate) - Date.parse(right.pubDate));
  console.log(
    `announce posts=${posts.length} mail=${announcements.map((item) => item.post.slug).join(",") || "none"} discord=${discordPosts.map((post) => post.slug).join(",") || "none"} cutoff=${cutoff}`
  );

  const discord: string[] = [];
  const discordFailed: string[] = [];
  let scheduledAt: string | null = null;
  if (send) {
    for (const post of discordPosts) {
      try {
        const status = await notifyDiscord(post);
        if (status === "posted") discord.push(post.slug);
        else console.log(`discord already posted: ${post.slug}`);
      } catch (error) {
        discordFailed.push(post.slug);
        console.error("discord failed:", error instanceof Error ? error.message : "unknown");
      }
    }
    const mailedAt = new Date();
    if (announcements.length > 0) scheduledAt = mailDelivery(mailedAt).scheduledAt;
    for (const announcement of announcements) {
      await sendAnnouncement(resend, announcement, mailedAt);
    }
  } else if (announcements.length > 0) {
    scheduledAt = mailDelivery(new Date()).scheduledAt;
  }

  return {
    posts: posts.length,
    cutoff,
    sent: announcements.map((item) => item.post.slug),
    discord,
    discordFailed,
    scheduledAt
  };
}
