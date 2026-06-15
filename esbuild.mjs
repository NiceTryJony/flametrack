/**
 * FlameTrack — esbuild config.
 *
 * Produces a single dist/extension.js (~30-50 KB) with no heavy deps.
 * Run:
 *   node esbuild.mjs           — development build
 *   node esbuild.mjs --watch   — watch mode
 *   node esbuild.mjs --production — minified production build
 */

import esbuild from "esbuild";

const isProd = process.argv.includes("--production");
const isWatch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "dist/extension.js",
  external: ["vscode"],       // vscode is provided by the host, never bundle it
  format: "cjs",
  platform: "node",
  target: "node18",
  sourcemap: !isProd,
  minify: isProd,
  // Tree-shake aggressively
  treeShaking: true,
  // Log level
  logLevel: "info",
  // Metafile for bundle analysis (dev only)
  metafile: !isProd,
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("[FlameTrack] Watching for changes...");
} else {
  const result = await esbuild.build(buildOptions);
  if (result.metafile) {
    const text = await esbuild.analyzeMetafile(result.metafile, { verbose: false });
    console.log(text);
  }
}
