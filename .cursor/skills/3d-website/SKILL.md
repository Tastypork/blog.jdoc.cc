---
name: 3d-website
description: Design and build exceptional, media-led 3D and WebGL website experiences when a project specifically calls for immersive visuals, supplied videos/images/3D models, interactive product scenes, or cinematic scroll storytelling. Use selectively; do not turn ordinary websites into 3D experiences.
---

# Immersive 3D Websites

## Purpose and activation

Use this skill only when the brief calls for a deliberately immersive, visually ambitious experience—for example:
- A cinematic, scroll-led landing page or brand story
- An interactive 3D product, object, environment, or portfolio
- Supplied `.glb` / `.gltf` models, image sequences, videos, or images that should become part of a visual scene
- A WebGL scene, shader effect, spatial layout, or 3D interaction that materially improves the concept

Do **not** use this skill by default for ordinary marketing sites, service-business websites, blogs, or content-heavy pages. Do not add 3D just because it is possible. If the brief does not justify it, use the project's normal Astro/CSS approach.

## Core principles

1. **Art direction first.** Build a coherent visual concept from the brief and supplied media before choosing libraries or writing scene code. Aim for a distinctive, polished result—not a generic 3D template.
2. **Media is source material.** Inspect all supplied assets and use them intentionally. Do not replace provided hero media or models with unrelated stock content without permission. Preserve brand colors, product details, and the intended mood.
3. **Use 3D with purpose.** Every 3D element should support the story, product, brand, navigation, or interaction. Avoid decorative motion that competes with the content.
4. **The whole website still matters.** Combine the immersive scene with strong typography, clear hierarchy, readable copy, real navigation, meaningful calls to action, and useful non-3D content.
5. **Progressive enhancement.** The page must remain understandable and usable if WebGL fails, a model cannot load, JavaScript is disabled, or a device is underpowered.
6. **Performance is part of the design.** Prioritize fast first render, controlled GPU use, efficient assets, and a sensible mobile experience.
7. **No fake verification.** Only report visual/browser testing that was actually performed.

## Workflow

### 1. Inspect the project and brief

Before changing code:
- Read the project instructions and applicable Cursor rules.
- Inspect the Astro structure, existing components, styling system, dependencies, routes, scripts, and build setup.
- Read the project brief and any brand/design references.
- Inventory supplied assets. Identify image/video formats, dimensions, duration, transparency, model format, texture dependencies, and likely file sizes when tools permit.
- Inspect existing pages to understand what should be reused and what must remain consistent.

If key creative direction is missing, ask only the most consequential question. Otherwise state reasonable assumptions in the plan and proceed.

### 2. Establish the visual direction

Create a short implementation plan covering:
- The central visual idea and emotional tone
- Page narrative and section order
- The role of each supplied asset
- How scrolling, pointer input, or controls affect the scene
- Typography, palette, contrast, lighting, materials, composition, and transitions
- Mobile and reduced-motion behavior
- Performance risks and fallback content

Prefer a few memorable, art-directed moments over many unrelated effects. Avoid default-looking neon grids, random floating shapes, gratuitous glassmorphism, or generic “futuristic” styling unless the brief explicitly calls for them.

### 3. Choose the simplest suitable technology

Inspect installed dependencies and follow the existing stack. Do not add a framework solely for convenience.

- **CSS 3D / transforms:** use for lightweight depth, layered compositions, tilt, and perspective where a full WebGL scene is unnecessary.
- **Three.js:** use for custom WebGL scenes, lighting, cameras, shaders, material control, and direct model/media integration.
- **Astro client-side component:** keep the surrounding site in Astro and isolate browser-only scene code in a client-loaded module/component. Avoid accessing `window`, `document`, WebGL, or browser-only APIs during server rendering.
- **React Three Fiber:** use only if React is already part of the project or the brief and architecture justify introducing it. Do not migrate an Astro project to React just to create one scene.
- **Video and image sequences:** use HTML video or image sequences when they achieve the desired visual more efficiently and reliably than real-time 3D. Use video textures only when the video genuinely needs to exist inside a 3D scene.
- **3D models:** prefer web-ready `.glb` / `.gltf` assets. Check scale, origin, camera framing, materials, texture paths, and animation availability. Do not assume a model has animations or embedded textures without inspecting it.
- **Scroll animation:** use the existing animation library if present. Otherwise prefer native scroll-driven CSS or a small custom implementation when sufficient; add a dependency only when the benefit is clear.
- **Shaders:** write custom shaders only when they contribute a distinctive effect that cannot be achieved cleanly with standard materials or CSS.

Use compatible, maintained versions and check the current project/package setup before installing anything. Do not silently introduce duplicate animation, rendering, or UI libraries.

### 4. Design and implement the experience

- Build a clear page structure first; add the scene in a dedicated component with a clear responsibility.
- Keep scene code, page content, asset configuration, and interaction logic separated enough to maintain.
- Use semantic HTML for headings, paragraphs, navigation, buttons, and calls to action. Do not put essential content exclusively inside a canvas.
- Use a deliberate camera, composition, lighting setup, material response, and motion curve. Ensure the main subject reads clearly at the intended viewport sizes.
- Map supplied media to the concept: hero video, environmental texture, model surface, backdrop, transitions, or supporting editorial content.
- Make interactions discoverable and usable. Provide keyboard-accessible HTML controls for important actions; do not make pointer hover the only way to access content.
- Keep navigation, forms, links, and calls to action functional. Do not let a full-screen canvas block the rest of the interface.
- Respect existing project conventions and design tokens unless the brief requires a deliberate change.
- Avoid adding large libraries, huge textures, complex post-processing, or multiple continuously animated scenes without a clear reason.

### 5. Asset handling and loading

- Keep supplied assets in the project's established public/assets location unless the repository uses another convention.
- Use descriptive, stable filenames and correct relative/public URLs.
- Preserve source assets; create optimized derivatives rather than destructively replacing originals.
- Compress and resize raster textures for their actual use. Prefer appropriately sized WebP/AVIF images when supported by the project's pipeline and alpha/channel requirements.
- Compress videos for web delivery; avoid autoplay audio. For background video, use muted, playsinline, loop where appropriate, a poster, and a static fallback.
- Optimize models and textures where tools are available: remove unused geometry/materials, reduce texture dimensions where acceptable, compress geometry/textures when supported, and avoid shipping unnecessarily large source models.
- Load noncritical assets lazily. Prioritize the first visible experience and avoid loading several heavy scenes at once.
- Show a deliberate loading state only when loading time warrants it. Never leave an unexplained blank canvas; provide a fallback and handle load failures.
- Handle missing or failed model, texture, and video requests gracefully.

### 6. Performance requirements

- Keep the first meaningful content visible before expensive scene assets finish loading.
- Use dynamic imports or client-only loading for WebGL code where appropriate to avoid server-rendering errors and unnecessary work on non-3D pages.
- Set a reasonable renderer pixel ratio; do not blindly render at full device pixel ratio on high-density mobile screens.
- Avoid unnecessary per-frame React/UI state updates, object creation in animation loops, repeated geometry/material allocation, and duplicate render loops.
- Pause or reduce animation when the scene is offscreen or the document is hidden, where practical.
- Dispose of geometries, materials, textures, renderers, event listeners, observers, and animation frames when components are removed.
- Use compressed assets and avoid oversized textures, excessive draw calls, costly transparency, and expensive post-processing when they do not materially improve the result.
- Avoid scroll-jacking. Scrolling should remain native and predictable; synchronize scene progress to scroll without preventing normal page movement.
- Consider low-power devices and constrained network connections. If necessary, simplify materials, effects, model detail, animation, and render resolution on mobile.
- Do not claim a specific frame rate or performance score unless it was measured.

### 7. Responsive behavior

Check and refine the experience at these viewport sizes where browser testing is available:
- Ultrawide: 2560 × 1440
- Desktop: 1920 × 1080
- Laptop: 1440 × 900
- Tablet: 1024 × 1366 and 768 × 1024
- Mobile: 390 × 844 and 375 × 667

At each relevant size, verify:
- The subject remains framed and legible; camera position and composition adapt where necessary.
- Text, navigation, buttons, and calls to action do not overlap the scene or get clipped.
- There is no unintended horizontal overflow.
- Touch interaction works without relying on hover.
- Scene complexity and motion are appropriate for mobile.
- Portrait and landscape layouts are considered when the experience depends on aspect ratio.

Do not simply scale the desktop scene down. Change composition, camera framing, section height, or fallback strategy when needed.

### 8. Accessibility and motion

- Respect `prefers-reduced-motion`. Provide a genuinely reduced or static experience rather than merely slowing every animation.
- Keep essential text in the DOM, with readable contrast and sensible heading order.
- Provide accessible labels for controls and useful alternative text for meaningful media. Treat purely decorative canvases as decorative to assistive technology.
- Do not rely on color, motion, sound, hover, or depth alone to communicate important information.
- Avoid flashing, disorienting camera movement, persistent forced motion, and scroll interactions that make the page difficult to control.
- Ensure focus styles remain visible and keyboard navigation works.
- Offer a still image or poster where motion/video is unavailable or reduced.

### 9. SEO, sharing, and metadata

- Keep the main page title, description, headings, and important copy as real HTML.
- Add or preserve canonical and Open Graph/Twitter card metadata according to project conventions.
- Give meaningful images appropriate alt text; do not put important SEO copy only in a canvas or video.
- Use a useful poster/fallback image for media-led pages so the page remains understandable in previews and when the scene cannot load.
- Do not sacrifice basic indexing, linkability, or navigation for a single-page visual effect.

### 10. Test, review, and refine

When available:
- Run the project's build, type checks, lint checks, and existing tests.
- Open the actual page in a browser using the project's available Playwright/browser tooling.
- Check the console and network requests for errors, failed assets, WebGL/context errors, and unexpected resource loading.
- Test initial loading, model/video failure, navigation, CTA behavior, resize/orientation changes, reduced motion, and keyboard use.
- Inspect the required responsive sizes and fix clipping, overflow, broken framing, unreadable text, or awkward scroll transitions.
- Check the experience both with the scene enabled and with its fallback.
- Take screenshots when the tooling supports them and use them to make a second refinement pass. Do not stop at the first implementation if obvious issues remain.
- If browser or GPU testing is unavailable, perform available static/build checks and explicitly state what was not verified.

## Definition of done

The work is complete when:
- The visual concept clearly reflects the brief and supplied media.
- 3D adds meaningful impact rather than distracting from the site's purpose.
- The page remains useful without WebGL and under reduced-motion settings.
- Core navigation, text, and calls to action are accessible and functional.
- Layout and scene framing work across the target viewport sizes.
- Assets and rendering have been optimized to a reasonable level for the project.
- Available checks pass, or unresolved failures and unverified areas are clearly reported.
- No unrelated routes or pages have been converted to 3D merely because this skill was used.

## Final report

Summarize:
1. The visual approach and where 3D/media are used
2. Which supplied assets were used and any optimized derivatives created
3. Dependencies added and why
4. Performance, responsive, accessibility, and fallback decisions
5. Checks actually run and their results
6. Any remaining limitations or assets that need replacement

Do not deploy unless explicitly asked.
