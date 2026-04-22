"use client";

import { useCallback, useEffect, useState } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { SplashScreen } from "@/components/SplashScreen";
import { MagazineCover } from "@/components/MagazineCover";
import { MobileMenu } from "@/components/MobileMenu";
import { Artist } from "@/components/Artist";
import { Work } from "@/components/Work";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FloatingBadge } from "@/components/FloatingBadge";
import { MetaPixel } from "@/components/MetaPixel";
import { CheckoutProvider } from "@/hooks/useCheckout";

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
    <CheckoutProvider>
      <MetaPixel />
      {!splashDone && <SplashScreen onEnter={handleSplashEnter} />}
      <main>
        <MagazineCover onOpenMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
        <Work />
        <Artist />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <CheckoutModal />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <FloatingBadge visible={splashDone} />
    </CheckoutProvider>
  );
}
