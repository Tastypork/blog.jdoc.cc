import type { APIRoute } from "astro";
import { toFeedPost } from "../lib/feed";
import { getPublishedPosts } from "../lib/posts";

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const feed = posts.map((post) =>
    toFeedPost({
      id: post.id,
      title: post.data.title,
      excerpt: post.data.excerpt,
      pubDate: post.data.pubDate
    })
  );
  return new Response(JSON.stringify(feed), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
};
