import type { Root, Text, Element } from "hast";
import { visit, SKIP } from "unist-util-visit";

/**
 * Wraps scripture references ("John 3:16", "1 John 1:9", "Matthew 22:37-40 (NIV)")
 * in a link to the passage so they read as enumerations and open the text.
 */
const BOOK =
  "(?:[1-3] )?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)";
const REF = new RegExp(`\\b(${BOOK}) (\\d{1,3}):(\\d{1,3})(?:-(\\d{1,3}))?(?: \\((NIV|ESV|AMP|KJV|NKJV|NLT|CSB|NASB)\\))?`, "g");

function passageUrl(book: string, chapter: string, from: string, to?: string, version = "NIV"): string {
  const search = `${book} ${chapter}:${from}${to ? `-${to}` : ""}`;
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(search)}&version=${version}`;
}

export default function rehypeScripture() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;
      if (parent.type === "element" && (parent.tagName === "a" || parent.tagName === "code")) return;

      const value = node.value;
      REF.lastIndex = 0;
      let match: RegExpExecArray | null;
      let last = 0;
      const out: (Text | Element)[] = [];

      while ((match = REF.exec(value))) {
        const [full, book, chapter, from, to, version] = match;
        if (match.index > last) out.push({ type: "text", value: value.slice(last, match.index) });
        out.push({
          type: "element",
          tagName: "a",
          properties: {
            className: ["ref"],
            href: passageUrl(book, chapter, from, to, version),
            target: "_blank",
            rel: "noopener"
          },
          children: [{ type: "text", value: full }]
        });
        last = match.index + full.length;
      }
      if (out.length === 0) return;
      if (last < value.length) out.push({ type: "text", value: value.slice(last) });

      parent.children.splice(index, 1, ...out);
      return [SKIP, index + out.length];
    });
  };
}
