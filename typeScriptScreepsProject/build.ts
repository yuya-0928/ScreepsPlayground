import { build } from "esbuild";
import { glob } from "glob";

const entryPoints = glob.sync("./src/**/**/**.ts");

build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "./build/main.js",
  platform: "node",
});
