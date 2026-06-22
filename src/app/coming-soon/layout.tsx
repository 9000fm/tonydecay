import type { Metadata } from "next";

/* Teaser-specific metadata. Overrides the store's title/OG for this route, so a
   shared tonydecay.com link reads "Coming Soon" with a print preview. */
export const metadata: Metadata = {
  title: "Tony Decay — Coming Soon",
  description: "Fifty signed sets, shipped worldwide. Join the notification list.",
  openGraph: {
    title: "Tony Decay — Coming Soon",
    description: "Fifty signed sets, shipped worldwide.",
    // og:image is supplied automatically by ./opengraph-image.tsx
  },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
