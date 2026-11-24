import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { postsToAnnounce, type BroadcastStatus, type FeedPost, type KnownBroadcast } from "../src/lib/feed";

const cutoff = Date.parse("2026-11-01T00:00:00.000-07:00");

const post: FeedPost = {
  slug: "faithfulness",
  title: "Faithfulness",
  excerpt: "A study",
  url: "https://blog.jdoc.cc/faithfulness",
  pubDate: "2026-11-17T15:00:00.000Z"
};

function broadcast(status: BroadcastStatus, scheduledAt: string | null = null, name = "post/faithfulness"): KnownBroadcast {
  return { id: "bcast_1", name, status, scheduledAt };
}

describe("postsToAnnounce", () => {
  it("creates a broadcast when the slug has none", () => {
    assert.deepEqual(postsToAnnounce([post], [], cutoff), [{ post, action: "create" }]);
  });

  it("sends an unscheduled draft", () => {
    assert.deepEqual(postsToAnnounce([post], [broadcast("draft")], cutoff), [
      { post, action: "send-draft", broadcastId: "bcast_1" }
    ]);
  });

  for (const status of ["sent", "queued", "scheduled", "canceled", "other"] as const) {
    it(`does not announce again when the broadcast is ${status}`, () => {
      assert.deepEqual(postsToAnnounce([post], [broadcast(status)], cutoff), []);
    });
  }

  it("does not recreate a draft that already has a send time", () => {
    const scheduled = broadcast("draft", "2026-11-25T12:00:00.000Z");
    assert.deepEqual(postsToAnnounce([post], [scheduled], cutoff), []);
  });

  it("does not recreate a slug that already has a scheduled broadcast beside a draft", () => {
    const named = [broadcast("scheduled", "2026-11-25T12:00:00.000Z"), broadcast("draft")];
    assert.deepEqual(postsToAnnounce([post], named, cutoff), []);
  });

  it("ignores a broadcast for a different slug", () => {
    assert.deepEqual(postsToAnnounce([post], [broadcast("sent", null, "post/other")], cutoff), [
      { post, action: "create" }
    ]);
  });

  it("skips a post published before the cutoff", () => {
    const older = { ...post, slug: "older", pubDate: "2026-10-01T15:00:00.000Z" };
    assert.deepEqual(postsToAnnounce([older], [], cutoff), []);
  });
});
