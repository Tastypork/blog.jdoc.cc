import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://blog.jocal.dev",
  output: "static",
  integrations: [sitemap()]
});
