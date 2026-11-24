import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SCHEDULE_LEAD_MS,
  SEND_TIME_ZONE,
  SEND_WINDOW_CLOSE_HOUR,
  SEND_WINDOW_OPEN_HOUR,
  SEND_WINDOW_RANGE_LABEL,
  isSendWindowOpen,
  mailDelivery,
  nextWindowOpen,
  scheduledSendAt
} from "../src/lib/send-window";

function phoenix(local: string): Date {
  const instant = new Date(`${local}-07:00`);
  if (Number.isNaN(instant.getTime())) throw new Error(`Bad Phoenix time ${local}`);
  return instant;
}

const edges: { local: string; open: boolean; next: string | null }[] = [
  { local: "2026-11-24T04:59:00.000", open: false, next: "2026-11-24T05:00:00.000" },
  { local: "2026-11-24T04:59:59.999", open: false, next: "2026-11-24T05:00:00.000" },
  { local: "2026-11-24T05:00:00.000", open: true, next: null },
  { local: "2026-11-24T05:00:00.001", open: true, next: null },
  { local: "2026-11-24T16:59:00.000", open: true, next: null },
  { local: "2026-11-24T16:59:59.999", open: true, next: null },
  { local: "2026-11-24T17:00:00.000", open: false, next: "2026-11-25T05:00:00.000" },
  { local: "2026-11-24T17:00:00.001", open: false, next: "2026-11-25T05:00:00.000" },
  { local: "2026-11-24T23:30:00.000", open: false, next: "2026-11-25T05:00:00.000" },
  { local: "2026-11-25T00:00:00.000", open: false, next: "2026-11-25T05:00:00.000" },
  { local: "2026-11-25T00:30:00.000", open: false, next: "2026-11-25T05:00:00.000" },
  { local: "2026-07-15T04:59:00.000", open: false, next: "2026-07-15T05:00:00.000" },
  { local: "2026-07-15T05:00:00.000", open: true, next: null },
  { local: "2026-07-15T16:59:00.000", open: true, next: null },
  { local: "2026-07-15T17:00:00.000", open: false, next: "2026-07-16T05:00:00.000" },
  { local: "2026-01-31T23:15:00.000", open: false, next: "2026-02-01T05:00:00.000" },
  { local: "2026-12-31T22:00:00.000", open: false, next: "2027-01-01T05:00:00.000" },
  { local: "2026-03-08T04:30:00.000", open: false, next: "2026-03-08T05:00:00.000" }
];

describe("Phoenix send window", () => {
  it("uses America/Phoenix and the 5:00 to 17:00 hours", () => {
    assert.equal(SEND_TIME_ZONE, "America/Phoenix");
    assert.equal(SEND_WINDOW_OPEN_HOUR, 5);
    assert.equal(SEND_WINDOW_CLOSE_HOUR, 17);
    assert.equal(SEND_WINDOW_RANGE_LABEL, "5:00 AM until 5:00 PM Phoenix time");
  });

  for (const edge of edges) {
    it(`${edge.local} Phoenix is ${edge.open ? "open" : "closed"}`, () => {
      const instant = phoenix(edge.local);
      assert.equal(isSendWindowOpen(instant), edge.open);
      const next = nextWindowOpen(instant);
      if (edge.next === null) {
        assert.equal(next, null);
        assert.equal(scheduledSendAt(instant), null);
        return;
      }
      const expected = phoenix(edge.next);
      assert.ok(next);
      assert.equal(next.toISOString(), expected.toISOString());
      const delay = next.getTime() - instant.getTime();
      assert.ok(delay > 0);
      assert.ok(delay <= 12 * 60 * 60 * 1000);
    });
  }

  it("schedules an evening request for exactly the next 5:00 AM", () => {
    const evening = phoenix("2026-11-24T17:00:00.000");
    assert.equal(scheduledSendAt(evening), phoenix("2026-11-25T05:00:00.000").toISOString());
    const beforeMidnight = phoenix("2026-11-24T23:30:00.000");
    assert.equal(scheduledSendAt(beforeMidnight), phoenix("2026-11-25T05:00:00.000").toISOString());
    const afterMidnight = phoenix("2026-11-25T00:30:00.000");
    assert.equal(scheduledSendAt(afterMidnight), phoenix("2026-11-25T05:00:00.000").toISOString());
  });

  it("keeps a last-minute schedule inside the window and at least a minute out", () => {
    const now = phoenix("2026-11-24T04:59:30.000");
    const scheduled = scheduledSendAt(now);
    assert.equal(scheduled, new Date(now.getTime() + SCHEDULE_LEAD_MS).toISOString());
    assert.equal(isSendWindowOpen(new Date(scheduled ?? "")), true);
    const open = nextWindowOpen(now);
    assert.ok(open);
    assert.ok(Date.parse(scheduled ?? "") >= open.getTime());
  });

  it("starts the confirmation clock at the scheduled delivery", () => {
    const evening = phoenix("2026-11-24T21:00:00.000");
    const delivery = mailDelivery(evening);
    assert.equal(delivery.scheduledAt, phoenix("2026-11-25T05:00:00.000").toISOString());
    assert.equal(delivery.tokenFrom, Date.parse(delivery.scheduledAt ?? ""));
    const daytime = phoenix("2026-11-24T08:00:00.000");
    const immediate = mailDelivery(daytime);
    assert.equal(immediate.scheduledAt, null);
    assert.equal(immediate.tokenFrom, daytime.getTime());
  });

  it("rejects an invalid instant", () => {
    assert.throws(() => isSendWindowOpen(new Date("nope")), /invalid/);
  });
});
