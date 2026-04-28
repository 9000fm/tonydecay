"use client";

import { useCallback, useEffect, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { SplashScreen } from "@/components/SplashScreen";
import { MagazineCover } from "@/components/MagazineCover";
import { MobileMenu } from "@/components/MobileMenu";
import { Artist } from "@/components/Artist";
import { PixelGallery } from "@/components/PixelGallery";
import { PrintSpecs } from "@/components/PrintSpecs";
import { CtaHandsDaggers } from "@/components/hero-cta/CtaHandsDaggers";
import { useCheckout } from "@/hooks/useCheckout";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FloatingBadge } from "@/components/FloatingBadge";
import { MetaPixel } from "@/components/MetaPixel";
import { CheckoutProvider } from "@/hooks/useCheckout";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

/* Section that sits after the PixelGallery — hosts the COLLECT YOURS CTA so
   it's never far from the prints. Lives in this file so it can pull from
   useCheckout (must be inside CheckoutProvider). */
function PostGalleryCta() {
  const { dispatch } = useCheckout();
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center px-7 py-10 sm:px-10 sm:py-14">
        <CtaHandsDaggers onBuy={() => dispatch({ type: "OPEN" })} />
      </div>
    </section>
  );
}

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSplashEnter = useCallback(() => setSplashDone(true), []);

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
          <Artist />
          <PrintSpecs />
          <PostGalleryCta />
          <FAQ />
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
