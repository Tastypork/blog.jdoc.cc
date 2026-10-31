---
name: website-launch-audit
description: Audit an Astro business website before client review or launch for content, SEO, accessibility, responsiveness, functionality, and build issues.
---
# Website launch audit

1. Inspect routes, layout, components, package scripts, metadata, and available tests.
2. Run the production build and other relevant configured checks; report exact outcomes.
3. Check for missing titles/descriptions, broken internal links, placeholder text, empty alt text where meaningful alt is needed, heading problems, and missing canonical/social metadata where appropriate.
4. Review responsive behavior, navigation, CTA targets, keyboard access, focus visibility, form labels, validation, and reduced-motion behavior.
5. Review images for appropriate sizing and descriptive alt text; identify obvious performance issues without inventing lab scores.
6. Verify business facts and local SEO details against client-provided information only. Flag unknowns rather than making them up.
7. Report findings as Blocker, High, Medium, or Low with file/route evidence and suggested fixes.
8. Fix issues only if asked to fix them; otherwise provide the prioritized report first.
9. Never claim a browser test, accessibility scan, or performance test ran if it did not.

# AI Crawler and LLM Discoverability

- Check whether the project would benefit from an `/llms.txt` file.
- If appropriate, create a concise, human-maintained `/llms.txt` at the site's public root, so it is served at `https://example.com/llms.txt`.
- Include the site's name, a short description, and links to its most useful public pages or documentation.
- Use absolute canonical URLs on the production domain.
- Keep the file accurate as pages and URLs change.
- Do not confuse `llms.txt` with `robots.txt`: `robots.txt` provides crawler access instructions, while `llms.txt` is a proposed convention for helping LLM tools discover useful site content.
- Do not claim that `llms.txt` guarantees indexing, citation, or AI search visibility.
- Do not treat `llms.txt` as a substitute for crawlable HTML, useful content, sitemap.xml, or appropriate robots directives.
