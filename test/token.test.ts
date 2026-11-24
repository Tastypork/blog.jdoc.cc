import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mailDelivery } from "../src/lib/send-window";
import { confirmationLetter } from "../netlify/functions/_shared/letters";
import { VERIFY_LINK_TTL_HOURS, VERIFY_LINK_TTL_SECONDS, readVerifyToken, signVerifyToken } from "../netlify/functions/_shared/token";

const secret = "test-link-secret";

describe("confirmation link lifetime", () => {
  it("says the same 48 hours the token enforces", () => {
    assert.equal(VERIFY_LINK_TTL_HOURS, 48);
    const letter = confirmationLetter("https://blog.jdoc.cc/api/verify?token=abc");
    const sentence = `This link expires in ${VERIFY_LINK_TTL_HOURS} hours.`;
    assert.ok(letter.text.includes(sentence));
    assert.ok(letter.html.includes(sentence));
  });

  it("stays valid for 48 hours after a morning delivery scheduled the evening before", async () => {
    const requestedAt = new Date("2026-11-25T00:30:00.000Z");
    const delivery = mailDelivery(requestedAt);
    assert.equal(delivery.scheduledAt, "2026-11-25T12:00:00.000Z");

    const scheduled = await signVerifyToken("reader@example.com", secret, delivery.tokenFrom);
    const ifClockStartedAtRequest = await signVerifyToken("reader@example.com", secret, requestedAt.getTime());
    const oldExpiry = requestedAt.getTime() + VERIFY_LINK_TTL_SECONDS * 1000;
    const deliveryExpiry = delivery.tokenFrom + VERIFY_LINK_TTL_SECONDS * 1000;

    assert.equal(await readVerifyToken(ifClockStartedAtRequest, secret, oldExpiry), null);
    assert.equal(await readVerifyToken(scheduled, secret, oldExpiry), "reader@example.com");
    assert.equal(await readVerifyToken(scheduled, secret, deliveryExpiry - 1), "reader@example.com");
    assert.equal(await readVerifyToken(scheduled, secret, deliveryExpiry), null);
  });
});
