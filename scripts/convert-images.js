// Convert all gallery PNGs to web-ready WebP siblings.
// Resizes to max 1600px wide (keeps aspect), quality 82, stripping metadata.
// Run: npm run optimize:images
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MAX_WIDTH = 1600;
const QUALITY = 82;

const dir = path.join(__dirname, "..", "public", "gallery");
const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".png"));

(async () => {
  let totalIn = 0;
  let totalOut = 0;
  for (const file of files) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace(/\.png$/i, ".webp"));
    const image = sharp(input);
    const { width } = await image.metadata();
    const resized = width && width > MAX_WIDTH ? image.resize({ width: MAX_WIDTH }) : image;
    await resized.webp({ quality: QUALITY }).toFile(output);
    const inSize = fs.statSync(input).size;
    const outSize = fs.statSync(output).size;
    totalIn += inSize;
    totalOut += outSize;
    const ratio = ((1 - outSize / inSize) * 100).toFixed(0);
    console.log(
      `${file.padEnd(14)} ${(inSize / 1024).toFixed(0).padStart(6)}KB -> ${path
        .basename(output)
        .padEnd(14)} ${(outSize / 1024).toFixed(0).padStart(6)}KB  (-${ratio}%)`,
    );
  }
  console.log(
    `\nDone. ${files.length} files | ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(
      totalOut /
      1024 /
      1024
    ).toFixed(1)}MB`,
  );
})();
