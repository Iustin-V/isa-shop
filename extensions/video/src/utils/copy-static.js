import { copyFileSync, mkdirSync, existsSync } from "fs";
import { globSync } from "glob";
import path from "path";

const files = globSync("src/**/*.{graphql,json,scss}", { nodir: true });

for (const file of files) {
  const dest = file.replace(/^src/, "dist");
  const dir = path.dirname(dest);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  copyFileSync(file, dest);
}
