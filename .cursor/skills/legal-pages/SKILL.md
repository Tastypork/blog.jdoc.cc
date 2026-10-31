---
name: legal-pages
description: Generate or update complete website Terms and Conditions, Privacy Policy, and Accessibility Statement pages using the provided templates.
---

# Legal Pages

## Templates
Read and follow these templates, relative to this skill directory:
- `../../tos_template.md`
- `../../privacy_template.md`
- `../../ada_template.md`

Use them as the structural and content baseline. Preserve relevant sections, but remove inapplicable template options, generator notes, and obsolete or contradictory material.

## Process
1. Inspect the repository, existing legal pages, Astro routes/components, footer, and available site/business context.
2. For each document, use the corresponding template to create or update the existing page. If a page already exists, update it in place; do not create duplicate routes or discard useful existing content without reason.
3. Fill in details from reliable project context and the website where possible. If a detail is unavailable, use clear, broadly applicable wording that covers common cases without asserting unverified facts. Prefer conditional language such as “may” and “where applicable” when practices depend on site features.
4. Do not leave template instructions, alternative options, bracketed placeholders, empty sections, generator credits, or unfinished boilerplate in the finished pages. Replace missing contact details with a practical general contact route already present on the site when available. If no route exists, add a concise contact method using the site's existing contact page or form; do not invent an email address, legal entity, physical address, or other factual detail. Use verified business information when available. Use generic information when specific business information is avaialable. Never invent legal entities, practices, certifications, compliance status, or guarantees.
5. Keep the documents complete, readable, and ready to publish as general-purpose baseline policies. Do not claim they are tailored legal advice or guarantee compliance. Do not invent specific data practices, security controls, certifications, legal jurisdictions, governing law, retention periods, or legal rights that cannot be responsibly stated. Use broad language where specifics are unknown.
6. Adapt the accessibility template to the actual type of organization and site. Do not claim that public-sector accessibility regulations apply unless supported by project context. Never claim a WCAG conformance level, audit, assessment, or accessibility status that has not been verified. Describe a reasonable accessibility commitment and a way to report barriers without asserting unverified results.
7. For Terms and Conditions, remove incompatible alternatives (such as competing age, governing-law, or dispute-resolution options) rather than publishing all options together. Avoid asserting that the site has accounts, payments, user submissions, mobile apps, or other features unless supported; use general clauses that remain relevant to a typical informational/business website.
8. For the Privacy Policy, cover common categories and purposes using cautious, general wording. Do not assert that specific analytics, advertising, cookies, payment processors, social logins, data sales, or international-transfer arrangements are used unless verified. Do not leave template-specific jurisdictional declarations or obsolete framework claims in place without support.
9. Implement the pages using the project's existing Astro routes, components, and styling conventions. Ensure semantic headings, readable content, responsive layout, accessible links, suitable page metadata, and footer links to all three pages. Keep footer links subtle, aligned, and consistent with the design.
10. Run available build and relevant checks. Verify the pages and footer links render correctly. If browser verification is unavailable, state that limitation rather than claiming it was completed.

## Footer
1. Check that the pages are linked in the footer, work on mobile, have appropriate metadata, and use accessible headings and links.

2. Clean footer to make sure all subtle elements are well designed, aligned and formatted.

## Output
Summarize which pages were created or updated, any assumptions made, and any remaining facts that genuinely require the site owner to supply. Do not deploy the site.
