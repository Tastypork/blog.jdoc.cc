import { SITE } from "../../../src/lib/site";

const font = "Poppins, Helvetica, Arial, sans-serif";

export function confirmationLetter(confirmUrl: string): { subject: string; html: string; text: string } {
  const subject = "Confirm your CrossWords email";
  const text = [
    "Joshua here.",
    "",
    "Confirm this address and I'll send you a note when a new post goes up.",
    "",
    confirmUrl,
    "",
    "This link expires in 48 hours. If you didn't ask for this, you can ignore it."
  ].join("\n");
  const html = layout({
    preheader: "Confirm this address and I'll write when a new post goes up.",
    body: [
      paragraph("Joshua here."),
      paragraph("Confirm this address and I'll send you a note when a new post goes up."),
      button(confirmUrl, "Confirm this address"),
      note("This link expires in 48 hours. If you didn't ask for this, you can ignore it.")
    ].join("")
  });
  return { subject, html, text };
}

export function postLetter(post: { title: string; excerpt: string; url: string }): {
  subject: string;
  html: string;
  text: string;
  previewText: string;
} {
  const title = post.title.replaceAll(/\s+/g, " ").trim();
  const excerpt = post.excerpt.trim();
  const subject = title;
  const text = [
    "A new post is up.",
    "",
    title,
    "",
    excerpt,
    "",
    post.url,
    "",
    "If you'd rather not get these, unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}"
  ].join("\n");
  const html = layout({
    preheader: excerpt || "A new post is up.",
    body: [
      eyebrow("A new post is up"),
      heading(title),
      excerpt ? paragraph(excerpt) : "",
      button(post.url, "Read it"),
      note(`If you'd rather not get these, <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#727272;text-decoration:underline;">unsubscribe</a>.`)
    ].join("")
  });
  return { subject, html, text, previewText: excerpt.slice(0, 140) };
}

function layout(parts: { preheader: string; body: string }): string {
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>CrossWords</title>",
    "</head>",
    `<body style="margin:0;padding:0;background:#f7f7f7;">`,
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(parts.preheader)}</div>`,
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;margin:0;padding:0;">',
    "<tr>",
    '<td align="center" style="padding:32px 16px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;">',
    '<tr><td style="height:4px;background:#7e96b8;font-size:0;line-height:0;">&nbsp;</td></tr>',
    `<tr><td style="padding:28px 32px 0;font-family:${font};font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#7e96b8;">${escapeHtml(SITE.name)}</td></tr>`,
    `<tr><td style="padding:8px 32px 0;font-family:${font};font-size:13px;line-height:1.5;color:#727272;">${escapeHtml(SITE.tagline)}</td></tr>`,
    `<tr><td style="padding:24px 32px 8px;font-family:${font};font-size:16px;line-height:1.7;color:#292929;">${parts.body}</td></tr>`,
    `<tr><td style="padding:8px 32px 32px;font-family:${font};font-size:13px;line-height:1.5;color:#727272;"><a href="${escapeHtml(SITE.url)}" style="color:#727272;text-decoration:underline;">${escapeHtml(SITE.url.replace(/^https:\/\//, ""))}</a></td></tr>`,
    "</table>",
    "</td>",
    "</tr>",
    "</table>",
    "</body>",
    "</html>"
  ].join("");
}

function eyebrow(value: string): string {
  return `<p style="margin:0 0 8px;font-family:${font};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#7e96b8;">${escapeHtml(value)}</p>`;
}

function heading(value: string): string {
  return `<h1 style="margin:0 0 16px;font-family:${font};font-size:28px;line-height:1.25;font-weight:600;color:#292929;">${escapeHtml(value)}</h1>`;
}

function paragraph(value: string): string {
  return `<p style="margin:0 0 16px;font-family:${font};font-size:16px;line-height:1.7;color:#292929;">${escapeHtml(value)}</p>`;
}

function note(html: string): string {
  return `<p style="margin:20px 0 0;font-family:${font};font-size:13px;line-height:1.6;color:#727272;">${html}</p>`;
}

function button(href: string, label: string): string {
  const url = escapeHtml(href);
  const text = escapeHtml(label);
  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0;">',
    "<tr>",
    `<td bgcolor="#333333" style="background:#333333;">`,
    `<a href="${url}" style="display:inline-block;padding:14px 22px;font-family:${font};font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;text-decoration:none;background:#333333;">${text}</a>`,
    "</td>",
    "</tr>",
    "</table>"
  ].join("");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
