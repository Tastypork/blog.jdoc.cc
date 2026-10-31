---
name: form-spam-protection
description: Ensure every form on an Astro website deployed to Netlify has a honeypot field and the Netlify reCAPTCHA "I'm not a robot" checkbox, and that contact forms carry the standard notification subject input. Use when adding or editing any form (contact, quote, newsletter, booking), when auditing a site before launch, or when the user mentions spam, bots, honeypot, captcha, or reCAPTCHA.
---
# Form spam protection

Every form that submits visitor data must have both layers: a honeypot and the Netlify reCAPTCHA checkbox. Netlify's built-in Akismet filtering is a third layer and needs no setup.

## Workflow

```
- [ ] 1. Find every form
- [ ] 2. Add or fix the honeypot
- [ ] 3. Add or fix reCAPTCHA
- [ ] 4. Add the notification subject to contact forms
- [ ] 5. Check the submit script
- [ ] 6. Update docs and the privacy page
- [ ] 7. Verify and report
```

### 1. Find every form

Search `src/` for `<form`, `data-netlify`, and `fetch(` in `.astro`, `.ts`, and `.js` files. List each form with its `name`, its component, and how it submits. Include forms in footers, modals, and newsletter blocks.

If a form posts to a non-Netlify handler (Formspree, an API route, etc.), the Netlify attributes below do not apply. Tell the user and ask before changing the handler.

### 2. Honeypot

Required on the `<form>` tag: `data-netlify="true"` and `netlify-honeypot="<field-name>"`.

Inside the form, add the trap field:

- Name it like a plausible optional field (`fax`, `website`, `company`), not `bot-field` or `honeypot`. Bots skip obvious trap names.
- Give it a real `<label>` and an `id` so it is a normal-looking field in the markup.
- Hide it with Tailwind positioning classes (`pointer-events-none absolute m-0 h-0 w-0 overflow-hidden p-0`) on the wrapper, not `display: none` or the `hidden` class. Some bots skip fields hidden that way.
- Add `aria-hidden="true"` on the wrapper, `tabindex="-1"` and `autocomplete="off"` on the input, and `data-1p-ignore` and `data-lpignore="true"` so password managers do not autofill it.
- Give the form `relative` so the absolutely positioned wrapper cannot affect page layout.
- In AJAX submit handlers, check the field before sending. If it has a value, skip the request and show the normal success state so the bot learns nothing.

Use a different honeypot name per site, and the same name for every form on a site so the checks stay consistent.

### 3. reCAPTCHA (checkbox only)

Netlify supports reCAPTCHA 2, the "I'm not a robot" checkbox. Do not add v3, invisible reCAPTCHA, hCaptcha, or Turnstile unless the user asks.

- Add `data-netlify-recaptcha="true"` to the `<form>` tag.
- Place `<div data-netlify-recaptcha="true"></div>` just above the submit button. Netlify replaces it with the widget when it builds the site.
- Netlify's default keys work with no setup. Custom keys go in the Netlify environment variables `SITE_RECAPTCHA_KEY` and `SITE_RECAPTCHA_SECRET`. Never put the secret in source control or browser code.
- The widget does not render in `npm run dev`. Say so in the README.
- JavaScript-rendered forms (React, Vue, SSR) need the static skeleton file described in the `netlify-forms` skill. Plain Astro components do not.

### 4. Notification subject (all contact forms)

Every form must include this hidden input, inside the `<form>`, next to the hidden `form-name` input:

```html
<input
  type="hidden"
  name="subject"
  value="[Jocal.dev] New inquiry — %{siteName} — #%{submissionId}"
/>
```

- Keep the value exactly as written, including the `%{siteName}` and `%{submissionId}` placeholders. Do not replace them with real values.
- Keep it as a quoted attribute on a plain `<input>`, not inside a `{}` expression, so Astro does not try to evaluate the placeholders.
- Add it to every form, including forms in footers and modals.
- Include `subject` in the static skeleton file for JavaScript-rendered forms.

### 5. Submit script

For AJAX forms, make sure the script:

- Builds the body from `FormData(form)` so `g-recaptcha-response` and the `form-name` hidden input are included.
- If a `textarea[name="g-recaptcha-response"]` exists and is empty, shows an accessible message (`role="alert"`, "Please check the 'I'm not a robot' box before sending.") and does not send. When the textarea does not exist, as in local dev, it sends normally.
- Calls `grecaptcha.reset()` after a failed send so the visitor can try again.
- Keeps a no-JavaScript fallback: a real `action` pointing to a thanks page.

### 6. Docs and privacy

- Update the README form notes: form names, honeypot name, reCAPTCHA in use, and the dev-server caveat.
- Add a sentence to the privacy policy that the forms use Google reCAPTCHA, linking to `https://policies.google.com/privacy` and `https://policies.google.com/terms`. Do not claim anything else about what Google collects.

### 7. Verify and report

- Run the repository's type-check and production build.
- Inspect the built HTML in `dist/` for each form: `data-netlify="true"`, `netlify-honeypot`, `data-netlify-recaptcha="true"`, the honeypot input, the reCAPTCHA placeholder, and, for contact forms, the `subject` input with its placeholders intact.
- Say that the subject placeholders can only be confirmed in a real notification email after a Netlify deploy.
- Confirm the form's hidden-field wrapper does not add page overflow or appear in the tab order.
- Be explicit that the reCAPTCHA widget and real submissions can only be confirmed on a Netlify deploy: form detection must be enabled in the Netlify UI, and the change applies on the next deploy. Ask the user to tick the box and send a test message, then check that it appears under Forms.
- Never claim a browser test or live submission ran if it did not.
- Do not deploy without explicit approval.
