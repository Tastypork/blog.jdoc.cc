import { announceCutoff, postsToAnnounce, readFeed } from "../../../src/lib/feed";
import { SITE } from "../../../src/lib/site";
import { optionalEnv } from "./http";
import { listBroadcastNames, resendClient, sendAnnouncement } from "./subscribers";

export type AnnounceResult = {
  posts: number;
  cutoff: string;
  sent: string[];
};

/** Email confirmed subscribers about every new post in the live feed. */
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
    `announce posts=${posts.length} mail=${announcements.map((item) => item.post.slug).join(",") || "none"} cutoff=${cutoff}`
  );

  if (send) {
    for (const announcement of announcements) {
      await sendAnnouncement(resend, announcement);
    }
  }

  return {
    posts: posts.length,
    cutoff,
    sent: announcements.map((item) => item.post.slug)
  };
}
