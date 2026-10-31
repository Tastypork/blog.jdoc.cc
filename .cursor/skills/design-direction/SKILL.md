---
name: design-direction
description: Establish a distinctive, practical visual direction for an Astro website before implementation or a major redesign.
---
# Design direction

## Purpose
Translate the approved client brief into a coherent visual system. Make design decisions specific to the business and audience rather than defaulting to generic AI-generated marketing layouts.

## Process
1. Read `docs/client-brief.md` and any existing brand or project context when available. If absent, use the supplied chat context and identify what is unknown.
2. Inspect the existing site, assets, fonts, CSS, components, and design tokens before proposing changes.
3. Identify the audience, desired impression, conversion goal, content density, and any accessibility or brand constraints.
4. Propose a compact direction covering:
   - Art direction and the intended feeling
   - Color palette with semantic roles and contrast considerations
   - Typography roles and a practical type scale
   - Spacing, container widths, grid, borders, and corner treatment
   - Image/illustration style and crop guidance
   - Button, link, form, card, navigation, and footer treatments
   - Mobile behavior and key responsive changes
   - Motion principles, including reduced-motion support
5. Explain the choices briefly and connect them to the client and conversion goal. Avoid arbitrary visual trends.
6. If a design reference is supplied, use it for direction, not as permission to copy protected content or reproduce another site pixel-for-pixel.
7. Save the approved direction to `docs/design-direction.md` when requested or when the project convention calls for it. Do not overwrite existing decisions without checking first.
8. Before implementation, present the direction for approval when the request is exploratory or the design choices materially affect the result. If the user explicitly asks to proceed, make reasonable choices and state assumptions.
9. Hand off implementation details to the relevant page-building workflow; do not duplicate the full build process here.

## Output
Provide a concise design specification with visual direction, tokens, component guidance, responsive behavior, and open questions. Clearly separate confirmed brand requirements from recommendations.
