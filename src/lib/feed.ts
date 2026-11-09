import { SITE } from "./site";

export type FeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  pubDate: string;
  /** Present when the post set one. */
  kicker?: string;
};

export type KnownBroadcast = {
  id: string;
  name: string;
  status: "draft" | "sent" | "queued";
};

export type Announcement = {
  post: FeedPost;
  action: "create" | "send-draft";
  broadcastId?: string;
};

/** America/Phoenix is UTC−7 all year. Posts before this local day are not announced. */
export const DEFAULT_ANNOUNCE_AFTER = "2026-11-09";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function broadcastName(slug: string): string {
  return `post/${slug}`;
}

export function toFeedPost(post: {
  id: string;
  title: string;
  excerpt: string;
  pubDate: Date;
  kicker?: string;
}): FeedPost {
  const kicker = readKicker(post.kicker);
  return {
    slug: post.id,
    title: post.title,
    excerpt: post.excerpt,
    url: new URL(`/${post.id}`, SITE.url).href,
    pubDate: post.pubDate.toISOString(),
    ...(kicker ? { kicker } : {})
  };
}

export function announceCutoff(value: string | undefined): number {
  const day = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : DEFAULT_ANNOUNCE_AFTER;
  const cutoff = Date.parse(`${day}T00:00:00-07:00`);
  if (Number.isFinite(cutoff)) return cutoff;
  return Date.parse(`${DEFAULT_ANNOUNCE_AFTER}T00:00:00-07:00`);
}

export function readFeed(value: unknown, siteUrl: string): FeedPost[] {
  if (!Array.isArray(value)) throw new Error("Feed was not a list");
  return value.map((item) => readFeedPost(item, siteUrl));
}

/**
 * Posts that still need an email. A broadcast named for the slug means it was
 * already sent, unless that broadcast is still a draft.
 */
export function postsToAnnounce(posts: FeedPost[], broadcasts: KnownBroadcast[], cutoffMs: number): Announcement[] {
  return posts
    .filter((post) => {
      const published = Date.parse(post.pubDate);
      return Number.isFinite(published) && published >= cutoffMs;
    })
    .sort((a, b) => Date.parse(a.pubDate) - Date.parse(b.pubDate))
    .flatMap((post): Announcement[] => {
      const named = broadcasts.filter((broadcast) => broadcast.name === broadcastName(post.slug));
      if (named.some((broadcast) => broadcast.status !== "draft")) return [];
      const draft = named.find((broadcast) => broadcast.status === "draft");
      if (draft) return [{ post, action: "send-draft", broadcastId: draft.id }];
      return [{ post, action: "create" }];
    });
}

function readFeedPost(value: unknown, siteUrl: string): FeedPost {
  if (!value || typeof value !== "object") throw new Error("Feed item was not an object");
  const record = value as Record<string, unknown>;
  if (typeof record.slug !== "string" || !SLUG.test(record.slug)) throw new Error("Feed slug was invalid");
  if (typeof record.title !== "string" || record.title.trim() === "") throw new Error("Feed title was empty");
  if (typeof record.excerpt !== "string") throw new Error("Feed excerpt was missing");
  if (typeof record.url !== "string" || !record.url.startsWith(`${siteUrl}/`)) throw new Error("Feed URL was invalid");
  if (typeof record.pubDate !== "string" || !Number.isFinite(Date.parse(record.pubDate))) {
    throw new Error("Feed date was invalid");
  }
  const kicker = readKicker(record.kicker);
  return {
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    url: record.url,
    pubDate: record.pubDate,
    ...(kicker ? { kicker } : {})
  };
}

function readKicker(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const kicker = value.trim();
  if (kicker === "" || kicker.length > 80) return undefined;
  return kicker;
}
