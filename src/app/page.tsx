"use client";

import { useCallback, useEffect, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { SplashScreen, markSplashShown } from "@/components/SplashScreen";
import { MagazineCover } from "@/components/MagazineCover";
import { MobileMenu } from "@/components/MobileMenu";
import { Artist } from "@/components/Artist";
import { PixelGallery } from "@/components/PixelGallery";
import { PrintSpecs } from "@/components/PrintSpecs";
import { CTA } from "@/components/CTA";
import { useCheckout } from "@/hooks/useCheckout";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FloatingBadge } from "@/components/FloatingBadge";
import { MetaPixel } from "@/components/MetaPixel";
import { CheckoutProvider } from "@/hooks/useCheckout";
import { GameManual } from "@/components/candidates/GameManual";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

/* Section that sits after the PixelGallery — hosts the COLLECT YOURS CTA so
   it's never far from the prints. Lives in this file so it can pull from
   useCheckout (must be inside CheckoutProvider). */
function PostGalleryCta() {
  const { dispatch } = useCheckout();
  return <CTA onBuy={() => dispatch({ type: "OPEN" })} />;
}

export default function Home() {
  // Splash always mounts (hydration-safe). It decides full vs. brief mode
  // internally based on localStorage 'td-splash-day': first visit today =
  // full (waits for click), return visit = brief (auto-fires in ~1.6s).
  const [splashDone, setSplashDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSplashEnter = useCallback(() => {
    markSplashShown();
    setSplashDone(true);
  }, []);

  // Init Lenis after splash completes
  useEffect(() => {
    if (!splashDone) return;
    initLenis();
    return () => destroyLenis();
  }, [splashDone]);

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
      <CheckoutProvider>
        <MetaPixel />
        {!splashDone && <SplashScreen onEnter={handleSplashEnter} />}
        <main>
          <MagazineCover onOpenMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
          <PixelGallery />
          <PostGalleryCta />
          {/* === CANDIDATE BLOCK — pick the keeper, delete the rest. === */}
          <GameManual />
          {/* === END CANDIDATE BLOCK === */}
          <PrintSpecs />
          <FAQ />
          <Artist />
          <Contact />
        </main>
        <Footer />
        <CheckoutModal />
        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <FloatingBadge visible={splashDone} />
      </CheckoutProvider>
    </PayPalScriptProvider>
  );
}
