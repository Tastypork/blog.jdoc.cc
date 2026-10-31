---
name: CrossWords
description: Joshua O'Callaghan's existing blog. White page, Poppins, the graffiti wordmark on the photo banner, and a row of journal cards. Not a crossword puzzle.
colors:
  bg: "#ffffff"
  ground: "#f7f7f7"
  card: "#ffffff"
  quote: "#f2f2f2"
  ink: "#292929"
  body: "#727272"
  muted: "#a2a2a2"
  accent: "#7e96b8"
  line: "#e4e4e4"
  btn: "#333333"
  on-btn: "#ffffff"
  error: "#b3261e"
typography:
  display:
    fontFamily: "Poppins, Helvetica, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: "1.3"
    letterSpacing: "normal"
  headline:
    fontFamily: "Poppins, Helvetica, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 500
    lineHeight: "1.5rem"
    letterSpacing: "normal"
  body:
    fontFamily: "Poppins, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.85"
    letterSpacing: "0.01em"
  label:
    fontFamily: "Poppins, Helvetica, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0.02em"
  button:
    fontFamily: "Poppins, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "0.1em"
rounded:
  none: "0"
spacing:
  gutter: "clamp(1.25rem, 4vw, 2rem)"
  card: "1.5rem"
components:
  button:
    backgroundColor: "{colors.btn}"
    textColor: "{colors.on-btn}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    height: "50px"
    padding: "0 1.75rem"
  button-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-btn}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "50px"
  quote:
    backgroundColor: "{colors.quote}"
    textColor: "{colors.ink}"
    padding: "1.75rem"
---

# Design System: CrossWords

## Overview

This is the existing CrossWords blog, kept and cleaned up. The page is white. Body type is Poppins. Titles are near-black. Secondary text is gray. One steel blue (`#7e96b8`) is the only accent: link hover, selection, the blockquote bar, and the button hover.

The mark is the graffiti wordmark with the distressed cross. On the index it sits in the nav in dark ink, and again, light, centered on the photo banner (`cw-bg.jpg`). Posts are journal cards: photo, uppercase title, one-line excerpt. An article is a white sheet on the light gray ground, with the photo cropped across the top.

The Sunday-crossword treatment (newsprint, ballpoint blue, answer cells, Across/Down clues, Caveat handwriting) is not this theme. Do not reintroduce it.

## Colors

- **Page** (`bg` `#ffffff`): index ground and card fill.
- **Ground** (`ground` `#f7f7f7`): article pages, the signup band, the footer.
- **Quote** (`quote` `#f2f2f2`): blockquote fill.
- **Ink** (`ink` `#292929`): titles and strong text.
- **Body** (`body` `#727272`): paragraphs and the field border.
- **Muted** (`muted` `#a2a2a2`): dates, reading time, placeholders.
- **Accent** (`accent` `#7e96b8`): hover, selection, blockquote bar, focus.
- **Button** (`btn` `#333333` on `on-btn` `#ffffff`): the one button. Hover fills with the accent.
- **Error** (`error` `#b3261e`): invalid field border only.

## Typography

Poppins only, self-hosted. Weights 300, 400, 400 italic, 500, 600, 700.

- Card and section titles: 19px, weight 500, `#292929`. Card titles are uppercase.
- Article title: 22px, weight 600.
- Essay: 16px, weight 400, line-height 1.85, `#727272`, measure about 42rem.
- Meta and footer: 12–13px, weight 500, letter-spacing about 0.1em, often uppercase.
- Buttons: 12px, weight 500, uppercase, 0.1em tracking.

## Layout

Content width 1140px. Index: nav, 55vh photo banner with the light wordmark (max 500px), then a three-column journal that becomes two columns and then one. Article: subpage nav, white card, 250px photo crop, title, byline, essay, then the comment form. Blockquotes have a 4px accent bar on the left and no other border.

Corners stay square. Motion is a short color change (about 180ms). Respect `prefers-reduced-motion`.

## Do

- Use the graffiti wordmark and the photo banner on the index.
- Keep journal cards as photo, title, excerpt.
- Keep the steel-blue accent as the only chroma.
- Keep scripture references as links in the essay, in the same ink as other links.

## Don't

- Don't restyle the site as a crossword, newspaper, or devotional template.
- Don't replace Poppins, the wordmark, or the banner photo.
- Don't add a second accent, gradients, or card shadows beyond a hairline divider.
