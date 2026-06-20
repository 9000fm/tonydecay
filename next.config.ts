import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Skip Vercel's image optimization API — we ship pre-optimized webp via scripts/convert-images.js
    // Avoids Hobby-plan transform limits and keeps deploy deterministic
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  // Teaser phase: serve the coming-soon page at the domain root.
  // Remove this block to restore the full store homepage at /.
  async rewrites() {
    return [{ source: "/", destination: "/coming-soon" }];
  },
};

export default nextConfig;
