"use client";

// GSAP has filename casing conflicts on Windows (e.g. Flip.d.ts vs flip.d.ts)
// Use dynamic imports via require to avoid TypeScript casing errors

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
const Flip = (require("gsap/Flip") as any).Flip;
const TextPlugin = (require("gsap/TextPlugin") as any).TextPlugin;
const EasePack = (require("gsap/EasePack") as any).EasePack;
const Observer = (require("gsap/Observer") as any).Observer;
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */

gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin, EasePack, Observer);

export { gsap, ScrollTrigger, Flip, TextPlugin, Observer };
