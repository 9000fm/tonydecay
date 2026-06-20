"use client";

import { ComingSoonCombined, spreadTrio } from "./_combined";

/* Live coming-soon page. Mobile = V1 stack, Desktop = V2 split / spread trio.
   Desktop arrangement alternatives live at /coming-soon/d1..d4. */

export default function ComingSoonPage() {
  return <ComingSoonCombined desktopPrints={spreadTrio} />;
}
