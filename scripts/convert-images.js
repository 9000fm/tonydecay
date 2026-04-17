// One-shot script: convert all gallery PNGs to WebP siblings.
// Run: node scripts/convert-images.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const dir = path.join(__dirname, "..", "public", "gallery");
const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".png"));

(async () => {
  for (const file of files) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace(/\.png$/i, ".webp"));
    await sharp(input).webp({ quality: 85 }).toFile(output);
    const inSize = (fs.statSync(input).size / 1024).toFixed(1);
    const outSize = (fs.statSync(output).size / 1024).toFixed(1);
    console.log(`${file} ${inSize}KB -> ${path.basename(output)} ${outSize}KB`);
  }
  console.log(`\nDone. Converted ${files.length} files.`);
})();
