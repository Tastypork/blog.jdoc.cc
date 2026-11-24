import { Resend } from "resend";
import { SITE } from "../../../src/lib/site";
import { requireEnv } from "./http";
import { confirmationLetter, postLetter } from "./letters";
import { signVerifyToken } from "./token";
import type { Announcement, BroadcastStatus, KnownBroadcast } from "../../../src/lib/feed";
import { broadcastName } from "../../../src/lib/feed";
import { mailDelivery } from "../../../src/lib/send-window";

type ResendError = {
  message: string;
  statusCode: number | null;
  name: string;
};

type StoredContact = {
  unsubscribed: boolean;
};

export function resendClient(): Resend {
  return new Resend(requireEnv("RESEND_API_KEY"));
}

export async function storePendingSubscriber(resend: Resend, email: string, submissionId: string | null): Promise<void> {
  const contact = await ensureContact(resend, email);
  const inSegment = await contactInSegment(resend, email, requireEnv("RESEND_SEGMENT_ID"));
  if (inSegment && !contact.unsubscribed) return;
  await sendConfirmationEmail(resend, email, submissionId);
}

export async function resendConfirmationIfPending(resend: Resend, email: string): Promise<void> {
  const contact = await getContact(resend, email);
  if (!contact) return;
  const inSegment = await contactInSegment(resend, email, requireEnv("RESEND_SEGMENT_ID"));
  if (inSegment) return;
  await sendConfirmationEmail(resend, email, null);
}

export async function confirmSubscription(resend: Resend, email: string): Promise<void> {
  const existing = await getContact(resend, email);
  if (!existing) {
    const created = await resend.contacts.create({ email, unsubscribed: false });
    if (created.error) {
      const again = await getContact(resend, email);
      if (!again) throw resendFailure(created.error);
    }
  } else if (existing.unsubscribed) {
    const updated = await resend.contacts.update({ email, unsubscribed: false });
    if (updated.error) throw resendFailure(updated.error);
  }

  const topics = await resend.contacts.topics.update({
    email,
    topics: [{ id: requireEnv("RESEND_TOPIC_ID"), subscription: "opt_in" }]
  });
  if (topics.error) throw resendFailure(topics.error);

  const segmentId = requireEnv("RESEND_SEGMENT_ID");
  if (await contactInSegment(resend, email, segmentId)) return;
  const added = await resend.contacts.segments.add({ email, segmentId });
  if (added.error && !(await contactInSegment(resend, email, segmentId))) throw resendFailure(added.error);
}

const BROADCAST_STATUSES = ["draft", "sent", "queued", "scheduled", "canceled"] as const;

export function toKnownBroadcast(item: {
  id: string;
  name: string;
  status: string;
  scheduled_at?: string | null;
}): KnownBroadcast {
  const scheduledAt = item.scheduled_at?.trim() || null;
  const known = (BROADCAST_STATUSES as readonly string[]).includes(item.status);
  let status: BroadcastStatus;
  if (item.status === "draft" && scheduledAt) status = "scheduled";
  else if (known) status = item.status as BroadcastStatus;
  else status = "other";
  return { id: item.id, name: item.name, status, scheduledAt };
}

export async function listBroadcastNames(resend: Resend): Promise<KnownBroadcast[]> {
  const found: KnownBroadcast[] = [];
  let after: string | undefined;
  for (let page = 0; page < 20; page += 1) {
    const { data, error } = await resend.broadcasts.list(after ? { limit: 100, after } : { limit: 100 });
    if (error || !data) throw resendFailure(error ?? emptyListError());
    found.push(...data.data.map((item) => toKnownBroadcast(item)));
    if (!data.has_more) return found;
    const cursor = data.data.at(-1)?.id;
    if (!cursor) throw new Error("Resend list missing cursor");
    after = cursor;
  }
  throw new Error("Resend list did not end");
}

export async function sendAnnouncement(resend: Resend, announcement: Announcement, now = new Date()): Promise<void> {
  const delivery = mailDelivery(now);
  const name = broadcastName(announcement.post.slug);
  if (announcement.action === "send-draft") {
    if (!announcement.broadcastId) throw new Error("Draft broadcast was missing an id");
    const sent = delivery.scheduledAt
      ? await resend.broadcasts.send(announcement.broadcastId, { scheduledAt: delivery.scheduledAt })
      : await resend.broadcasts.send(announcement.broadcastId);
    if (sent.error) throw resendFailure(sent.error);
    console.log(`broadcast ${name} mailAt=${delivery.scheduledAt ?? "now"}`);
    return;
  }

  const letter = postLetter(announcement.post);
  const from = requireEnv("RESEND_FROM");
  const payload = {
    name,
    segmentId: requireEnv("RESEND_SEGMENT_ID"),
    topicId: requireEnv("RESEND_TOPIC_ID"),
    from,
    replyTo: from,
    subject: letter.subject,
    html: letter.html,
    text: letter.text,
    ...(letter.previewText ? { previewText: letter.previewText } : {}),
    send: true as const
  };
  const created = await resend.broadcasts.create(
    delivery.scheduledAt ? { ...payload, scheduledAt: delivery.scheduledAt } : payload
  );
  if (created.error) throw resendFailure(created.error);
  console.log(`broadcast ${name} mailAt=${delivery.scheduledAt ?? "now"}`);
}

async function sendConfirmationEmail(resend: Resend, email: string, submissionId: string | null): Promise<void> {
  const delivery = mailDelivery(new Date());
  const token = await signVerifyToken(email, requireEnv("LINK_SECRET"), delivery.tokenFrom);
  const url = new URL("/api/verify", SITE.url);
  url.searchParams.set("token", token);
  const letter = confirmationLetter(url.toString());
  const from = requireEnv("RESEND_FROM");
  const sent = await resend.emails.send(
    {
      from,
      replyTo: from,
      to: email,
      subject: letter.subject,
      html: letter.html,
      text: letter.text,
      ...(delivery.scheduledAt ? { scheduledAt: delivery.scheduledAt } : {})
    },
    submissionId ? { idempotencyKey: `verify/${submissionId}` } : undefined
  );
  if (!sent.error) {
    console.log(`confirmation mailAt=${delivery.scheduledAt ?? "now"}`);
    return;
  }
  if (sent.error.name === "invalid_idempotent_request" || sent.error.name === "concurrent_idempotent_requests") return;
  throw resendFailure(sent.error);
}

async function ensureContact(resend: Resend, email: string): Promise<StoredContact> {
  const existing = await getContact(resend, email);
  if (existing) return existing;
  const created = await resend.contacts.create({ email, unsubscribed: false });
  if (!created.error) return { unsubscribed: false };
  const again = await getContact(resend, email);
  if (again) return again;
  throw resendFailure(created.error);
}

async function getContact(resend: Resend, email: string): Promise<StoredContact | null> {
  const { data, error } = await resend.contacts.get({ email });
  if (error) {
    if (isNotFound(error)) return null;
    throw resendFailure(error);
  }
  return { unsubscribed: data.unsubscribed };
}

async function contactInSegment(resend: Resend, email: string, segmentId: string): Promise<boolean> {
  let after: string | undefined;
  for (let page = 0; page < 20; page += 1) {
    const { data, error } = await resend.contacts.segments.list(after ? { email, limit: 100, after } : { email, limit: 100 });
    if (error) {
      if (isNotFound(error)) return false;
      throw resendFailure(error);
    }
    if (!data) throw new Error("Resend list was empty");
    if (data.data.some((segment) => segment.id === segmentId)) return true;
    if (!data.has_more) return false;
    const cursor = data.data.at(-1)?.id;
    if (!cursor) throw new Error("Resend list missing cursor");
    after = cursor;
  }
  throw new Error("Resend list did not end");
}

function isNotFound(error: ResendError): boolean {
  return error.name === "not_found" || error.statusCode === 404;
}

function resendFailure(error: ResendError): Error {
  return new Error(`Resend ${error.name} (${error.statusCode ?? "unknown"})`);
}

function emptyListError(): ResendError {
  return { message: "empty", name: "application_error", statusCode: null };
}
