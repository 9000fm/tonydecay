export const PRICE_USD = 300;
export const TOTAL_INVENTORY = 100;
export const COLLECTION_NAME = "Tony Decay Collection Vol. 1";
export const PRINTS_COUNT = 14;

// Real prints from public/gallery/ — files: print0, print2..print14 (print1 pending)
const PRINT_FILES = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export const PLACEHOLDER_PRINTS = PRINT_FILES.map((n, i) => ({
  id: i + 1,
  src: `/gallery/print${n}.png`,
  alt: `Print ${i + 1}`,
  title: `Print ${i + 1}`,
}));

// Hero background — same as featured print for now
export const HERO_BG_IMAGE = "/gallery/print0.png";

// Artist avatar still placeholder (no real asset yet)
export const ARTIST_AVATAR = "https://picsum.photos/seed/tdkartist/400/400";

// Package placeholder images (still picsum — no real assets yet)
export const PACKAGE_IMAGES = [
  "https://picsum.photos/seed/tdkpkg1/800/800",
  "https://picsum.photos/seed/tdkpkg2/800/800",
  "https://picsum.photos/seed/tdkpkg3/800/800",
];
