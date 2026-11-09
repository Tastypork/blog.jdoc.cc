import type { FeedPost } from "../../../src/lib/feed";
import { requireEnv } from "./http";

/** Tell YukiBot to announce one post. YukiBot ignores a slug it already posted. */
export async function notifyDiscord(post: FeedPost): Promise<void> {
  const url = notifyUrl();
  const secret = requireEnv("YUKIBOT_NOTIFY_SECRET");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${secret}`
    },
    body: JSON.stringify({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      url: post.url
    }),
    signal: AbortSignal.timeout(8_000)
  });
  if (!response.ok) throw new Error(`YukiBot responded ${response.status}`);
}

function notifyUrl(): string {
  const raw = requireEnv("YUKIBOT_NOTIFY_URL");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("YUKIBOT_NOTIFY_URL was invalid");
  }
  if (url.protocol !== "https:") throw new Error("YUKIBOT_NOTIFY_URL was invalid");
  return url.href;
}
