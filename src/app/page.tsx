"use client";

import { useState, useEffect, useCallback } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Package } from "@/components/Package";
import { Certificate } from "@/components/Certificate";
import { Artist } from "@/components/Artist";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { MetaPixel } from "@/components/MetaPixel";
import { SplashScreen } from "@/components/SplashScreen";
import { CheckoutProvider } from "@/hooks/useCheckout";

export default function Home() {
  const [entered, setEntered] = useState(false);

  // Init Lenis smooth scroll after entering
  useEffect(() => {
    if (!entered) return;
    const lenis = initLenis();
    return () => {
      destroyLenis();
    };
  }, [entered]);

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  // Respect reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!entered) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  return (
    <CheckoutProvider>
      <MetaPixel />
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <Package />
        <Certificate />
        <Artist />
        <FAQ />
      </main>
      <Footer />
      <CheckoutModal />
    </CheckoutProvider>
  );
}
