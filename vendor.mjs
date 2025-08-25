#!/usr/bin/env node

import { basename, join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const vendorFiles = [
  "js/third-party/ByteBufferAB.min.js",
  "js/third-party/ProtoBuf.min.js",
  "js/Cardboard.js",
  "CardboardDevice.proto",
];

const baseUrl = "https://wwgc.firebaseapp.com/";
const vendorDir = join(import.meta.dirname, "public/vendor");
mkdirSync(vendorDir, { recursive: true });

await Promise.all(
  vendorFiles.map(async (path) => {
    const url = new URL(path, baseUrl).toString();
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${url}: ${res.statusText}`);
      return;
    }

    const filename = basename(path);
    const outPath = join(vendorDir, filename);

    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(outPath, buffer, "utf8");
    console.log(`Saved ${outPath}`);

    if (filename === "Cardboard.js") {
      let code = readFileSync(outPath, "utf8");
      code = code.replaceAll(
        "'CardboardDevice.proto'",
        "'./CardboardDevice.proto'",
      );

      writeFileSync(outPath, code, "utf8");
      console.log(`  Patched ${filename} to use relative proto path`);
    }
  }),
);
