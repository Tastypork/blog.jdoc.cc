import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { postsToAnnounce, type FeedPost } from "../src/lib/feed";
import { toKnownBroadcast } from "../netlify/functions/_shared/subscribers";

const cutoff = Date.parse("2026-11-01T00:00:00.000-07:00");
const post: FeedPost = {
  slug: "faithfulness",
  title: "Faithfulness",
  excerpt: "A study",
  url: "https://blog.jdoc.cc/faithfulness",
  pubDate: "2026-11-17T15:00:00.000Z"
};

describe("toKnownBroadcast", () => {
  it("treats a scheduled status as already handled", () => {
    const known = toKnownBroadcast({
      id: "bcast_scheduled",
      name: "post/faithfulness",
      status: "scheduled",
      scheduled_at: "2026-11-25T12:00:00.000Z"
    });
    assert.equal(known.status, "scheduled");
    assert.deepEqual(postsToAnnounce([post], [known], cutoff), []);
  });

  it("does not mistake a draft that already has a send time for an unsent draft", () => {
    const known = toKnownBroadcast({
      id: "bcast_draft",
      name: "post/faithfulness",
      status: "draft",
      scheduled_at: "2026-11-25T12:00:00.000Z"
    });
    assert.equal(known.status, "scheduled");
    assert.equal(known.scheduledAt, "2026-11-25T12:00:00.000Z");
    assert.deepEqual(postsToAnnounce([post], [known], cutoff), []);
  });

  it("keeps a real draft sendable", () => {
    const known = toKnownBroadcast({
      id: "bcast_draft",
      name: "post/faithfulness",
      status: "draft",
      scheduled_at: null
    });
    assert.equal(known.status, "draft");
    assert.deepEqual(postsToAnnounce([post], [known], cutoff), [
      { post, action: "send-draft", broadcastId: "bcast_draft" }
    ]);
  });

  it("keeps queued and sent broadcasts from being created again", () => {
    for (const status of ["queued", "sent", "canceled"]) {
      const known = toKnownBroadcast({ id: `bcast_${status}`, name: "post/faithfulness", status, scheduled_at: null });
      assert.deepEqual(postsToAnnounce([post], [known], cutoff), []);
    }
  });

  it("does not recreate a broadcast with an unrecognized status", () => {
    const known = toKnownBroadcast({ id: "bcast_new", name: "post/faithfulness", status: "processing" });
    assert.equal(known.status, "other");
    assert.deepEqual(postsToAnnounce([post], [known], cutoff), []);
  });

  it("treats a blank send time as unset", () => {
    const known = toKnownBroadcast({
      id: "bcast_draft",
      name: "post/faithfulness",
      status: "draft",
      scheduled_at: "  "
    });
    assert.equal(known.scheduledAt, null);
    assert.equal(known.status, "draft");
  });
});
