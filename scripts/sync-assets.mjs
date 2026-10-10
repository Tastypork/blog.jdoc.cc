import { cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Vendor sources live outside `public/` under `vendor-*` names so Vite does not
 * treat `lib/` at the project root as an ESM graph (Bootstrap/Isotope UMD uses
 * `require("jquery")` which Vite would try to resolve).
 */
function mirrorToPublic(sourceDirName, destSubdir) {
  const from = join(root, sourceDirName);
  const to = join(root, "public", destSubdir);
  if (!existsSync(from)) {
    console.warn(`sync-assets: skip — missing ${sourceDirName}/`);
    return;
  }
  cpSync(from, to, { recursive: true, force: true });
}

mirrorToPublic("vendor-lib", "lib");
mirrorToPublic("css", "css");
mirrorToPublic("js", "js");
mirrorToPublic("images", "images");
