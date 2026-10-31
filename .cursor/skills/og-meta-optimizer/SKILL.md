### Additional validation and optimization rules

#### Title and description lengths

Validate these fields independently:
- HTML `<title>`: aim for approximately 50–60 characters.
- `og:title` and `twitter:title`: aim for concise, descriptive titles, generally around 50–70 characters where appropriate.
- Meta description: generally aim for 140–160 characters.
- `og:description` and `twitter:description`: aim for concise descriptions, generally around 110–160 characters.

These are optimization guidelines, not strict platform limits. Prioritize accuracy, readability, and the page's actual subject over arbitrary character counts. Preserve important names and context when shortening text.

#### HTML document size

Flag unusually large HTML documents, especially those exceeding approximately 200 KB, and treat documents exceeding 500 KB as high-priority investigation candidates rather than automatic failures.

Investigate the cause before changing the implementation. Look for:
- Large inline JSON or hydration payloads.
- Embedded transcripts or duplicated content.
- Inline scripts, styles, or encoded assets.
- Unnecessarily repeated markup.
- Content that can be efficiently loaded on demand.

Recommend specific fixes based on the identified cause. Preserve useful server-rendered content, accessibility, and search engine discoverability. Do not remove substantive page content simply to reduce HTML size.

Distinguish transferred compressed size from the uncompressed HTML size when measurements are available.

#### Social image dimensions

Inspect actual image dimensions and aspect ratio when possible. A 1200 × 630 image with an approximately 1.91:1 aspect ratio is a useful general-purpose social preview recommendation.

Do not replace a valid, relevant image solely because its dimensions differ from the recommendation. Consider cropping, image quality, platform compatibility, and the existing image's purpose before recommending changes.

#### Optional metadata

Recommend `twitter:site` only when the correct social account handle is known. Recommend `theme-color` based on the existing brand palette. Add a web app manifest only when appropriate to the site's requirements, and never reference nonexistent files.

#### Performance evidence

Prioritize measured performance problems. A large HTML document may warrant investigation even when server response time is fast. Do not assume that reducing HTML size will improve every performance metric, and do not recommend a specific optimization without considering the source of the problem.

#### Issue prioritization

Separate:
- **Errors:** Confirmed failures that materially break intended behavior.
- **Warnings:** Significant problems supported by evidence.
- **Tips:** Optional improvements or heuristic recommendations.

When several checks flag the same underlying problem, consolidate them into one actionable fix while preserving any distinct requirements. Validate the outcome rather than assuming that shorter metadata, smaller HTML, or a changed image automatically improves the overall score.