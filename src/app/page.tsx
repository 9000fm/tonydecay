"use client";

import { useState, useEffect, useCallback } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
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
    initLenis();
    return () => {
      destroyLenis();
    };
  }, [entered]);

  const handleEnter = useCallback(() => {
    setEntered(true);
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
      </main>
      <Footer />
      <CheckoutModal />
    </CheckoutProvider>
  );
}
