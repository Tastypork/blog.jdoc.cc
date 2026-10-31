---
name: device-compatibility
description: Test and improve an Astro website across ultrawide, desktop, laptop, iPad/tablet, and mobile viewports using browser-based verification where available.
---

# Device Compatibility

1. Inspect the project, routes, existing responsive CSS, and available Playwright setup. Start the site using the project's existing development or preview command.

2. Test all key pages at these representative viewport sizes:
   - Ultrawide: 3440 × 1440
   - Desktop: 1920 × 1080
   - Laptop: 1440 × 900
   - Tablet/iPad: 1024 × 1366 and 768 × 1024
   - Mobile: 390 × 844 and 375 × 667

3. Use Playwright to inspect and capture screenshots at each viewport when available. Check for:
   - Horizontal overflow, clipping, and unwanted scrollbars
   - Broken layouts, excessive whitespace, and overly stretched content
   - Navigation, menus, buttons, forms, and interactive elements
   - Typography, line wrapping, spacing, image crops, and aspect ratios
   - Touch target usability and readable content on mobile
   - Sticky or fixed elements overlapping content
   - Console errors and failed network requests where observable

4. Fix verified responsive issues using the existing Astro components, CSS conventions, and design tokens. Prefer fluid layouts, sensible maximum widths, flexible grids, and content-driven breakpoints over device-specific hacks.

5. Preserve the approved design and functionality. Do not hide important content, shrink text excessively, or introduce unnecessary dependencies just to make a screenshot look correct.

6. You are allowed creative flexibility to redesign or remove elements that are too small or too large for the current device.

7. Retest affected pages and viewport sizes after changes. Run the available build and checks. If browser testing is unavailable, report that limitation and do not claim visual verification.

8. Summarize the viewports tested, issues found, changes made, and any remaining problems.

Do not deploy or make unrelated architectural changes.