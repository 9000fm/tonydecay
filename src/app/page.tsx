"use client";

import { useCallback, useEffect, useState } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { SplashScreen } from "@/components/SplashScreen";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Product } from "@/components/Product";
import { Artist } from "@/components/Artist";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FloatingBadge } from "@/components/FloatingBadge";
import { MetaPixel } from "@/components/MetaPixel";
import { CheckoutProvider } from "@/hooks/useCheckout";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
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
      <Navbar />
      <main>
        <Hero splashDone={splashDone} />
        <Gallery />
        <Product />
        <Artist />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <CheckoutModal />
      <FloatingBadge visible={splashDone} />
    </CheckoutProvider>
  );
}
