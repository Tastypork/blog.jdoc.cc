# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary readers are Joshua's friends and people in his circle (church, young adults, family). The blog is written as a personal, semi-internal journal that happens to be public; strangers who arrive through a shared link are welcome but not the design target. Readers are typically on a phone, reading one post at a time after someone sent it to them, or returning when a new post is announced by email.

## Product Purpose

CrossWords is Joshua O'Callaghan's personal blog of scripture-grounded reflections: who Jesus is, how to keep faith while waiting on an unanswered prayer, and what the Christian walk actually looks like day to day. Success is a friend reading a post all the way through, feeling personally addressed, and either replying to Joshua or subscribing for the next one.

## Positioning

Not devotional content from an institution. Every post is Joshua speaking in the first person out of his own life (including a 2020 motorcycle accident and spinal cord injury he is still praying through), citing specific verses and translations, and closing with a direct invitation to talk to him. The mechanism is candor plus citation: personal testimony backed by chapter-and-verse.

## Operating Context

- Three published essays, each 900 to 1,400 words, written September 2024. More will follow irregularly.
- Posts quote scripture frequently, inline, with translation labels (NIV, ESV, AMP). Pull quotes repeat a key sentence from the essay.
- Readers reach Joshua through a contact form on each post and a newsletter sign-up on the index and on each post. Both are Netlify Forms. A subscriber gets a confirmation email, and only a confirmed address receives new-post mail through Resend.
- Author also runs a personal/professional site at jocal.dev; the blog links there for attribution only.

## Capabilities and Constraints

- Static Astro 5 site, Markdown content collection, deployed on Netlify at https://blog.jdoc.cc. No client framework; vanilla JS only where interaction requires it.
- Forms: newsletter (email) and contact (name, email, message). Both need honeypot + Netlify reCAPTCHA checkbox. Newsletter success is `/thanks` and requires an email confirmation before post mail. Contact success is `/thank-you`. The resend-confirmation form posts to a site function, so it has the honeypot and not the Netlify reCAPTCHA widget. Live submission can only be verified after a Netlify deploy with form detection enabled.
- New-post mail: Resend stores contacts and sends broadcasts to the confirmed segment. A production deploy sends each new post once, then POSTs that post to YukiBot. YukiBot ignores a slug it already announced.
- Existing URLs `/jesus-christ`, `/waiting-faith`, `/walking-christ` must keep working; legacy `.html` paths redirect.
- No comments, no analytics.
- Author photos are the only imagery: three travel photos used as post heroes (Oregon coast dock, Phoenix desert road, Medellin hillside), Joshua's headshot, and a posterized photo of him reading a red Bible. No stock imagery is to be invented as fact about Joshua.

## Brand Commitments

- Name: CrossWords. Tagline: "Blog by Joshua O'Callaghan". Author is always named in full.
- Voice: first person, warm, direct, unpolished in a good way; speaks to a friend, not a congregation. Scripture is quoted exactly, with translation.
- Visual identity stays the existing blog: white page, Poppins, steel blue `#7e96b8`, the graffiti wordmark with the distressed cross, and the photo banner. Do not replace it with a crossword-puzzle, newspaper, or other theme. See `DESIGN.md`.
- Footer carries a small "Web design done by Jocal®" credit linking to https://jocal.dev.

## Evidence on Hand

- `src/content/posts/*.md`: the three essays, verbatim from the original site, with original publish timestamps (MST).
- `src/assets/posts/*.jpg`: Joshua's own hero photos (1024px wide, from the original site).
- `src/assets/brand/crosswords-logo*.png`, `cw-bg*.jpg`: previous identity assets, kept for reference only. The nav always uses the graffiti wordmark.
- No testimonials, subscriber counts, or readership figures exist; none may be claimed.

## Product Principles

1. The essay is the product. Everything on a post page serves uninterrupted reading on a phone.
2. Sound like Joshua. Interface copy is first person and plain; no church-brochure or SaaS tone.
3. Scripture is typographically distinct and always attributed; a reader can scan a post by its verses.
4. Every post ends in a conversation: contact and subscribe are a natural close, never a popup.
5. Light enough to load on a bad connection: no frameworks, optimized images, self-hosted fonts.

## Accessibility & Inclusion

Author uses a wheelchair; the site should be fully keyboard and screen-reader operable as a matter of principle. Respect `prefers-reduced-motion`. Body text at a comfortable size with strong contrast for long reads.
