import { defineConfig } from "vite";
import { copyFileSync } from "node:fs";

// GitHub Pages serves the build from https://haza1410.github.io/Physio-Website/.
// Dev stays at the domain root so local URLs remain "/pilates", "/about", etc.
// Override with BASE_PATH=/ when deploying to a root (e.g. a custom domain).
export default defineConfig(({ command, isPreview }) => ({
  base:
    command === "build" || isPreview
      ? (process.env.BASE_PATH ?? "/Physio-Website/")
      : "/",
  plugins: [
    {
      // GitHub Pages has no server-side rewrites, so deep links such as
      // /Physio-Website/pilates need a 404 fallback that boots the same app.
      name: "spa-404-fallback",
      closeBundle() {
        copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
}));
