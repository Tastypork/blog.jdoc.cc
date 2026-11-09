import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeScripture from "./src/lib/rehype-scripture.ts";

export default defineConfig({
  site: "https://blog.jocal.dev",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) =>
        !["/thank-you", "/thanks", "/verified", "/verify-expired", "/verification-sent"].some((path) =>
          page.includes(path)
        )
    })
  ],
  markdown: {
    rehypePlugins: [rehypeScripture]
  }
});
