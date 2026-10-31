import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/** How many essays the homepage shows. The full list lives at /posts. */
export const LATEST_ON_HOME = 3;

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Newest published posts, capped for the homepage cards. */
export async function getLatestPosts(limit = LATEST_ON_HOME): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

/** Oldest first: the order the essays were written, and the order on the original index. */
export async function getPostsInReadingOrder(): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return [...posts].reverse();
}

export function postUrl(post: Post): string {
  return `/${post.id}`;
}
