import fs from "fs";
import path from "path";

const root = process.cwd();
const tsConfigPath = path.join(root, "next.config.ts");
const mjsConfigPath = path.join(root, "next.config.mjs");
const backupPath = path.join(root, "next.config.ts.bak");

if (fs.existsSync(tsConfigPath)) {
  if (!fs.existsSync(mjsConfigPath)) {
    throw new Error("next.config.mjs is missing. Please keep the .mjs config.");
  }

  try {
    fs.renameSync(tsConfigPath, backupPath);
    // eslint-disable-next-line no-console
    console.log(
      "Renamed next.config.ts -> next.config.ts.bak for Next.js compatibility.",
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Could not rename next.config.ts. Please delete it manually.");
  }
}
