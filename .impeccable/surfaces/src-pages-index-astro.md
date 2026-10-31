---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/[slug].astro"]
---

# Surface brief: CrossWords index and post pages

Scope: the whole public blog (index, post pages, thank-you, privacy). Visitor mode: Read.
Audience: Joshua's friends and circle, usually on a phone, arriving by a shared link or the newsletter email. Job: read one essay through; action: reply to Joshua (contact form) or subscribe. Proof/content: three essays, Joshua's own photos, exact scripture citations. Constraints: static Astro, no client framework, Netlify Forms, existing URLs preserved, type never shrinks on mobile.

Memorable moment: the title of a post is a crossword answer that pencils itself in as you read.

## Direction contract

THESIS: CrossWords is a newspaper crossword page; every post is a numbered clue and its title is the answer. It refuses the category default of a centered white column with post cards and a logo top-left, and refuses the cream-paper devotional look.

OWN-WORLD: Newsprint gray ground (#ebe9e3), one black ink (#111), paper-white open cells (#fbfaf7), one ballpoint blue (#1d3fc4) that floods only the index masthead band and otherwise appears only as the pen that writes answers and links, graphite (#6b6b66) for meta. Grid blocks are solid black squares with hairline rules; numbers sit top-left in cells in a small grotesk. Type: Libre Franklin (clues, headings, numbers, UI, caps with tracking), Literata (reading column), Caveat bold (hand-filled answer letters). One clue type size; rank is span. Baseline grid equals the cell unit. With all content removed, the page is still a black-and-white grid with a blue band and ACROSS / DOWN columns.

STORY: A friend lands on a puzzle page that is obviously Joshua's: the grid spells CROSS and WORDS and the open cells form a cross. They read the clues, open one, watch the answer fill in as they read, hit the scripture references like enumerations, and reach the end where Joshua asks them to write back or subscribe.

FIRST VIEWPORT (index, 1440): running head hairline bar: "CrossWords" mark left, "Blog by Joshua O'Callaghan" center, "3 clues" and RSS right. Below, a full-bleed ballpoint-blue band about 60vh tall: at left a 5x5 crossword grid about 440px square (black blocks, white cross-shaped cells numbered 1 and 2, letters pencil in one per 90ms: W,O,R,D,S down then C,R,_,S,S across sharing the O); at right, the deck in white Libre Franklin: a two-line statement of what this is and who it is for, then "Start with 1 Across" and "Subscribe" as white hairline-ruled controls. Below the band on newsprint: ACROSS column (8 of 12) with the three posts as clue rows, each a number cell, clue text, photo matted in a hairline, enumeration; DOWN column (3 of 12): About Joshua, Subscribe, Say hello. Mobile 390: grid 280px centered above the deck; columns stack; type size unchanged.
FIRST VIEWPORT (post, 1440): running head with small cross-grid mark and "All clues"; clue number label; the title as hand-filled letter cells wrapping per word (answer grid, ~56px cells); clue text in grotesk italic; meta line (author, date, read time); hero photo full column width matted in a hairline with its caption; reading column begins (Literata ~19px, 66ch).

FORM: The Sunday Crossword Page, candidate 5 of 7 on my ordered grounded list (1 journaling Bible, 2 Phoenix trailhead markers, 3 sermon-notes sheet, 4 hymnal page, 5 crossword page, 6 worship lyric projection, 7 ADOT highway signage). Seed key de44d3ae. Code-led build.

Signature interaction: answer letters pencil in on scroll progress through the essay (one letter per equal share of the article height); on the index the masthead letters pencil in on load. Motion grammar: letters appear as instant stamps with a 120ms ink-darkening, no easing curves longer than 200ms, nothing glides; prefers-reduced-motion shows final states immediately and keeps scroll-fill as instant steps.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved
- Whether a dark variant is ever wanted (none planned; newsprint is light).
- Newsletter provider beyond Netlify Forms (none).
