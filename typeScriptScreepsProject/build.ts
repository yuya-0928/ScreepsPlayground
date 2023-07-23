import { build } from "esbuild";

build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "./build/main.js",
  platform: "node",
});
