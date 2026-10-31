import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeScripture from "./src/lib/rehype-scripture.ts";

export default defineConfig({
  site: "https://blog.jocal.dev",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/thank-you")
    })
  ],
  markdown: {
    rehypePlugins: [rehypeScripture]
  }
});
