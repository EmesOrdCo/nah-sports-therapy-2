import { defineConfig } from "vite";
import { copyFileSync } from "node:fs";

// GitHub Pages serves the build from https://emesordco.github.io/nah-sports-therapy-2/.
// Dev stays at the domain root so local URLs remain "/pilates", "/about", etc.
// Override with BASE_PATH=/ when deploying to a root (e.g. a custom domain).
export default defineConfig(({ command, isPreview }) => ({
  base:
    command === "build" || isPreview
      ? (process.env.BASE_PATH ?? "/nah-sports-therapy-2/")
      : "/",
  plugins: [
    {
      // GitHub Pages has no server-side rewrites, so deep links such as
      // /nah-sports-therapy-2/pilates need a 404 fallback that boots the same app.
      name: "spa-404-fallback",
      closeBundle() {
        copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
}));
