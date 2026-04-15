export const PRICE_USD = 300;
export const TOTAL_INVENTORY = 100;
export const COLLECTION_NAME = "Tony Decay Collection Vol. 1";
export const PRINTS_COUNT = 15;

// Tony's preferred order: 1–14 (3beta for #3), then 14 repeated as 15th for aesthetics
const PRINT_FILES = ["1", "2", "3beta", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "14"];

export const PLACEHOLDER_PRINTS = PRINT_FILES.map((n, i) => ({
  id: i + 1,
  src: `/gallery/${n}.png`,
  alt: `Print ${i + 1}`,
  title: `Print ${i + 1}`,
}));

// Hero background
export const HERO_BG_IMAGE = "/gallery/1.png";

// Artist avatar still placeholder (no real asset yet)
export const ARTIST_AVATAR = "https://picsum.photos/seed/tdkartist/400/400";

// Package placeholder images (still picsum — no real assets yet)
export const PACKAGE_IMAGES = [
  "https://picsum.photos/seed/tdkpkg1/800/800",
  "https://picsum.photos/seed/tdkpkg2/800/800",
  "https://picsum.photos/seed/tdkpkg3/800/800",
];
