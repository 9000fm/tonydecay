# Tony Decay — Redesign Plan (organized by section)

## Context
End-of-day session 2 on 2026-04-15 ended frustrated: rapid rewrites made things worse. Working tree is clean (commit `8d20c0d`). User dropped a fresh batch of references on 2026-04-16 and explicitly asked to **save them as ideas, but help him land them** ("aterrizarlas"). He also reports broken images on the live site (screenshot shows Product card fan rendering as alt-text only).

This plan reorganizes everything by **section/component**, maps each reference to a section, calls out which sections **have no reference yet** (need direction before coding), and stacks the work in a sensible order. Scope is **planning only** — no code edits in this pass; rule from memory is one fix at a time, verify in browser, move on.

---

## P0 — BUG: broken images on live site (LOCKED FIX)
- **Root cause confirmed**: Vercel image optimization quota hit.
- **Fix (locked)**: Convert all `/public/gallery/*.png` → `.webp` locally with a sharp-based script. Keep PNGs as originals on disk. Update src paths in `constants.ts` + `FloatingBadge.tsx` + `Hero.tsx` to `.webp`. Add `unoptimized={true}` on those Image tags as belt-and-suspenders so Vercel never touches them.
- **Why both**: WebP = 70% smaller files, fast load. `unoptimized` = Vercel never proxies, no quota hit ever.
- **Script**: `scripts/convert-images.js` using `sharp`. One-shot Node script: glob `public/gallery/*.png` → write `.webp` siblings at quality 85.
- **Files to touch**: `src/lib/constants.ts:7,17`, `src/components/FloatingBadge.tsx:102`, `src/components/Hero.tsx` (HERO_BG_IMAGE usage), `src/components/Gallery.tsx`, `src/components/Product.tsx:137-143`
- **Verify**: load deployed site, all prints render, FloatingBadge image visible, Network panel shows `.webp` 200s.

---

## IDEAS BY SECTION

### 1. NAVBAR (heaviest reference coverage)
**Refs**: vemvem (#1, #2), Format (#3-6), Akuto (#7-8), Bruno Cisco (#9-11), **Darkroom (#23-26)**

**Wants**:
- Top scrolling marquee bar above navbar ("WORLDWIDE SHIPPING — …" style)
- Sticky navbar that **hides on scroll down, returns smoothly on scroll up**
- Background: translucent at top of page → solid dark on scroll (Format + Darkroom)
- **Layout — Darkroom is the latest pick**: **burger LEFT, Firma logo CENTER (animated), basket RIGHT**. (Bruno Cisco logo-TL is now an alternative, not the default.)
- **Firma logo with transparent hue / mix-blend-mode** so it reacts when imagery passes behind it (Darkroom's animated paper-clip logo equivalent)
- **PRE-ORDER** big pill CTA (Akuto) — Flavio said "really important". Question: lives in navbar OR in hero only?
- Cart icon → switch to **basket** ("cesta") icon
- Burger icon → **+ that morphs to − smoothly** when menu opens (Bruno Cisco accordion style). Note: Darkroom keeps a 3-line burger — pick burger style separately from morph behavior.
- Marquee specifically: slides up/away on scroll-down, navbar stays sticky underneath (vemvem)

**Current state**: `src/components/Navbar.tsx` — two floating buttons (cart at line 33, burger at line 64), no real navbar bar, no marquee, no PRE-ORDER, no scroll-direction logic, burger is 3-line not +. `src/components/MobileMenu.tsx:174` uses × not + → −.

**Status**: Heavy redesign, references converged on Darkroom layout. Ready to spec once burger-LEFT vs logo-LEFT is locked.

---

### 2. GALLERY
**Refs**: QF Network (#17 — must), Artifacts (#16), vemvem carousel (#1-2 partial), Hasan Wali (#14-15 partial)

**Wants**:
- **Scroll-locked gallery** — pin section, internal scroll moves through all 15 prints, only when fully consumed does page continue (QF Network) — **explicit "MUST"**
- Numbered sidebar tabs (1, 2, 3 … 15) on the left, current print's tab highlights (Artifacts) — concern: 15 may be too many; consider chunking to 3 groups of 5 or showing only ±2 around current
- Optional: vemvem-style carousel layout (image + title underneath, no price but "something else" — possibly print number + name)
- Optional: tilted/perspective 3D card stack (Hasan Wali) — could be Product cards instead

**Current state**: `src/components/Gallery.tsx:11-195` — horizontal auto-scroll marquee, 90s loop, draggable, prints tripled for seamless wrap. **Would be replaced** by scroll-locked vertical/horizontal pin.

**Status**: Big architectural shift. Need to decide between QF Network's pin-and-internal-scroll vs keeping the marquee as a background element while adding a "feature" experience.

---

### 3. PRODUCT
**Refs**: Akuto (#7-8), Hasan Wali (#14-15) optional

**Wants**:
- Big bold "PRE-ORDER" CTA prominently (also lives in Navbar — could be both)
- Possibly tilted 3D card stack (Hasan Wali) — replace the current flat fan with perspective tilt scrolling
- "Card fan" itself **must be preserved** per memory rule

**Current state**: `src/components/Product.tsx:130-146` — 5 absolutely-positioned cards with rotations [-12, -6, 0, 6, 12]. The fan works but is currently broken visually due to image bug above.

**Status**: Card fan stays. Add PRE-ORDER pill CTA. Tilted stack is "maybe" — needs a sketch before deciding.

---

### 4. FAQ
**Refs**: Bruno Cisco accordion (#12-13)

**Wants**:
- + → − smooth icon morph on accordion open/close

**Current state**: `src/components/FAQ.tsx:84-86` — already uses `+` that rotates 45° to look like ×. Need to change rotation/animation so `+` morphs cleanly to `−` (single horizontal line) instead of ×.

**Status**: Tiny, surgical fix. Easy win.

---

### 5. SECTION TRANSITIONS (cross-section)
**Refs**: vemvem marquee-slides-up (#1-2), Format scroll feel (#3)

**Wants**:
- Replace the ugly 80px gradient bars (`section-fade-to-dark` / `section-fade-to-cream` in `globals.css:147-160`) with something better
- vemvem suggests overlapping sections / one slides under the other on scroll

**Current state**: Gradient `::after` pseudo-elements applied via classes on Hero, Gallery, Product, FAQ, Contact wrappers.

**Status**: Direction is clearer now — try **overlapping sections** with the next section sliding up over the previous one, or remove gradients entirely and use sharp paper↔dark cuts. Need user pick before coding.

---

### 6. MOBILE MENU (open state)
**Refs**: implied from Navbar refs (Bruno Cisco simplicity)

**Wants**:
- Close button: ×  → **−** (paired with the + → − burger morph)
- Otherwise the existing blob expansion + link stagger is good per memory ("DO NOT TOUCH" list)

**Current state**: `src/components/MobileMenu.tsx:174-182` close uses ×.

**Status**: Tied to Navbar burger morph. Ship together.

---

### 7. ANIMATIONS (cross-component cleanup)
**Refs**: implicit (memory rule "NO opacity fade entrances")

**Wants**:
- Kill all `gsap.fromTo({opacity: 0, y: X}, {opacity: 1, y: 0})` patterns — violates animation taste rule
- Replace with: color transitions, position-only shifts, or just *be there*
- Polish, don't kill — vary patterns per memory rule

**Current state — every fade-up offender** (from explore):
| File | Lines | Element |
|---|---|---|
| Hero.tsx | 41-45, 48-52 | tagline, scroll cue |
| Gallery.tsx | 206-221, 224-239 | heading, subtitle |
| Artist.tsx | 21-36 | heading, bio |
| Contact.tsx | 36-50 | heading |
| Product.tsx | 17-20, 24-28, 38-50 | heading, details, card array |
| FAQ.tsx | 109-123 | heading |
| FAQ.tsx | 58-62 | accordion content (probably keep — height anim is needed) |
| CheckoutModal.tsx | 24-25 | overlay (keep — modal needs fade) |

**Status**: Mechanical sweep. Do AFTER section-level work so we know what motion patterns to use as replacements (e.g. hero may want a color-shift entrance, gallery may not need an entrance at all if it's scroll-locked).

---

### 8. HERO
**Refs**: **NONE specifically — Bruno Cisco simplicity is the closest**

**Wants** (from existing TODO):
- Single print behind Firma is broken/cluttered
- "LIMITED EDITION" text + pixel arrow disappear on scroll → **stop fading them** (remove from `Hero.tsx:95` fadeTargets)
- Logo morph (center → top-left) is loved, keep

**Status**: ⚠️ **NEEDS DIRECTION**. Bruno Cisco vibe = ultra-minimal cream page with logo TL, name centered later. We could:
- Option A: Pure Firma logo on cream, no print behind, no tagline — Bruno Cisco minimalism
- Option B: Big bold "PRE-ORDER" + small Firma + big "TONY DECAY VOL I" type — Akuto vibe
- Option C: Keep current structure, just fix the busy print behind logo
- Need user pick.

---

## SECTIONS WITH NO REFERENCE (need user direction before any work)

These were not addressed in the new image batch and have no committed direction:

| Section | What's there now | Question for user |
|---|---|---|
| **Hero composition** | Firma + tagline + faint print bg | Which of Options A/B/C above? Or something else? |
| **"THE COLLECTION" heading** (Product) | `text-[6rem]→[20rem]` brutalist, awkward "THE / COLLEC / TION" line break | Same brutalist scale on one line? Different break? Drop the heading entirely? |
| **Floating badge image** | `/gallery/5.png` zoomed at 55%/35% — wrong print picked | Need user to pick which print + zoom region (Charizard fire? Heart sparkles? Blue/yellow scene?) |
| **Artist section** | Headshot + bio fade-up | No direction at all — keep as-is or rethink? |
| **Contact section** | Heading + form fade-up | No direction — same question |
| **Footer** | Spinning Firma + links | Not mentioned anywhere — keep? |
| **Splash screen** | Iris expand from center | Not mentioned — keep (it's loved per "DO NOT TOUCH" list) |
| **AudioToggle** | Audio mute button | Not mentioned — assume keep |
| **Certificate** | Component exists | Unclear if used / where |

---

## DECISIONS LOCKED (build these as-is)

### Navbar
- Layout: **burger LEFT, Firma logo CENTER, basket icon RIGHT, PRE-ORDER pill RIGHT-MOST** (LOCKED for real)
- **HYBRID style**:
  - Over hero (cream): **edge-to-edge SOLID DARK** (#0D1B2D) — 2D brutalist
  - Once scrolled past hero: morphs to **Clue floating PILL** (capsule shape, ~12px from top, ~16px from sides, backdrop-blur(20px), background ~50% dark)
- **Marquee position**: stacked ABOVE navbar (two distinct layers). Marquee = thin full-width bar. Navbar = pill below it (when in floating state).
- Sticky behavior: hides on scroll-down, returns smoothly on scroll-up
- **Marquee** scroll-up rule: marquee only re-appears when user is back at top (~within 200px). Mid-page scroll-up = navbar only, no marquee.
- Marquee text content: "WORLDWIDE SHIPPING - ONLY 100 SETS - VOL I OUT NOW - TONY DECAY" (loop, separator: ` - ` per no-em-dashes rule)
- Cart icon → **basket icon** ("cesta")
- Burger icon: **+ that morphs to − smoothly** (matches FAQ accordion = unified icon system)
- PRE-ORDER pill color: **royal blue #2B5DAE, white text**, click = open existing CheckoutModal
- Logo behavior: **mix-blend-mode: difference** so Firma reacts to whatever's behind it
- "Buttery smooth animations" priority — use GSAP power3.out / power2.inOut, ~0.4s reveal/hide

### CTA copy library (use elegantly across site, varied placement)
Available labels (mix and match for premium feel \u2014 never use the same one twice in a row):
- **PRE-ORDER** \u2014 primary, royal blue pill
- **RESERVE YOURS** \u2014 primary alt, royal blue pill
- **SHOP NOW** \u2014 primary alt, royal blue pill
- **LEARN MORE** \u2014 secondary, dark/outline pill, scroll-down link
- **SEE THE PRINTS** \u2014 secondary, scrolls to gallery
- Used contextually: Hero = PRE-ORDER + SEE THE PRINTS, Product = RESERVE YOURS, Artist = LEARN MORE, FloatingBadge = SHOP NOW

### Marquee top bar
- Height: 28px slim
- Font: JetBrains Mono uppercase, 12px letter-spaced
- Text loop: `WORLDWIDE SHIPPING - ONLY 100 SETS - VOL I OUT NOW - TONY DECAY -` (with separator)
- Background: solid dark on cream hero, solid cream-border on dark sections (contrast inverts with section)

### Burger icon
- + symbol inside a 40x40 (or similar) **2px bordered square box** (Salt&Bits style)
- Matches heavy wireframe aesthetic
- + morphs to \u2212 when menu open

### Mobile menu links (5 items)
- WORK / ABOUT / SHOP / FAQ / CONTACT
- Map to: WORK \u2192 #gallery, ABOUT \u2192 #artist, SHOP \u2192 #product (Vol I details), FAQ \u2192 #faq, CONTACT \u2192 #contact

### Hero
- Featured print: **#5 (Charizard fire)** \u2014 large, centered in 2px wireframe box
- Wordmark: **TONY DECAY** above print, **VOL. I** stylized as part of identity
- Copy: existing `100 numbered sets, hand-signed` paragraph + Reserve / See the Prints CTAs
- Existing pixel arrow scrollCue STAYS \u2014 stop fading on scroll
- Existing LIMITED EDITION tagline STAYS \u2014 stop fading on scroll
- Firma logo morph (center \u2192 top-left in navbar) STAYS

### FloatingBadge
- Keep current rotating ring design
- Swap center image to **#11 (heart sparkles)**, pick zoom region that frames the heart well
- Click = open CheckoutModal

### Artist
- Direction: **quote-driven + small bio** style
- Wireframe-bordered card
- Big Fraunces serif pull-quote
- Small Tony photo + DM Sans short bio
- Generate quote/bio from existing copy + brand context (Gen 1 Pokemon Sugimori style, anti-AI-slop, limited drops). User will review/edit.

### Product (Vol. I details)
- Heading: **TONY DECAY / VOL. I** (replaces THE COLLECTION). Anton tattoo display, big.
- Card fan stays \u2014 goes BIG and PREMIUM, deeper shadows, possibly 3D perspective
- Royal blue PRE-ORDER pill prominent
- Section in 2px wireframe border

### Contact
- Multi-purpose card with 2px wireframe border
- Includes: contact form (name, email, message via Resend), newsletter signup ('Get notified about Vol II'), Instagram link (@tonydecay)

### Typography (use 5 existing fonts intentionally)
- **Fraunces** (serif): artist quotes, editorial moments
- **DM Sans** (sans): body copy, paragraphs
- **Anton** (tattoo display): big headings (TONY DECAY, VOL. I, TONY DECAY VOL. I)
- **JetBrains Mono**: marquee, labels, prices, counters, technical details
- **Sigmar** (arcade): rare accents only \u2014 maybe one decorative moment
- Pro practice: every type has a job. Don't use Anton for body. Don't use DM Sans for the marquee.

### BRAND.md to be updated
- User asked to "complete BRAND.md best practices"
- Will document: typography rules, color palette w/ usage, wireframe border system, CTA library, animation conventions (no fades, GSAP only), section composition rules, do/don't list

### Splash + AudioToggle + Certificate
- Splash iris intro: KEEP (loved per memory)
- AudioToggle: KEEP (no mention either way)
- Certificate: KEEP if used (verify usage during build)

### Hero (starting direction — iterate after first build)
- **Darkroom big wordmark** style on cream
- Centered Firma top → big bold "TONY DECAY" wordmark → product/print imagery → "100 numbered sets, hand-signed" copy → CTA buttons (SHOP NOW + LEARN MORE, or PRE-ORDER + LEARN MORE)
- Existing Firma logo morph (center → top-left) STAYS
- Existing pixel arrow scrollCue STAYS — but **stop fading it on scroll** (remove from `Hero.tsx:95` fadeTargets array)
- Existing "LIMITED EDITION" tagline STAYS — also stop fading it

### Gallery (TWO PARTS \u2014 reordered)
**Part 1: 3-row marquee teaser** (overview)
- 3 horizontal infinite carousel rows, 5 prints each (5+5+5 = 15 prints)
- Row 1: scrolls right, 60s loop
- Row 2: scrolls left, 60s loop
- Row 3: scrolls right, 60s loop
- All same speed, alternating directions = parallax-light feel
- Style: **continuous filmstrip with vertical 1-2px dividers between prints** (no gaps, no individual frames). Whole section wrapped in heavy-wireframe outer border.

**Part 2: Scroll-lock pinned deep dive** (immersive)
- Horizontal scrub: section pins, scroll moves prints left through the full 15
- All 15 numbered sidebar tabs (1\u201315), current one prominently highlighted (bigger / colored)
- Section also wrapped in outer wireframe border

### Section transitions + visual aesthetic
- **Sharp cut, no transition.** Remove `section-fade-to-dark` and `section-fade-to-cream` classes from `globals.css`. Remove the wrapper classes from Hero, Gallery, Product, FAQ, Contact.
- **HEAVY wireframe aesthetic (Salt&Bits)**: every section wrapped in a visible bordered box. Cards inside also bordered. Zine / blueprint feel.
  - Border: 1px solid (color depends on section bg \u2014 dark sections = cream/ink-faint border, cream sections = ink border)
  - Padding inside the border to give content breathing room
  - Sections stack flush, borders touch (or have 1-2px gap for the brutalist line system)
  - This replaces what would have been section dividers \u2014 the borders ARE the dividers

### Section order (UPDATED)
- Hero \u2192 Gallery (scroll-lock) \u2192 Artist \u2192 Product \u2192 FAQ \u2192 Contact \u2192 Footer
- Reasoning: show prints \u2192 explain who made them \u2192 then the offer. Builds desire before pitch.

### Product
- **Card fan stays** (your own original) but goes BIG and PREMIUM \u2014 don't underestimate the visual weight. Larger cards, deeper shadows, possibly 3D perspective tilt on scroll/hover. Hasan Wali influence on motion, not layout.

### Footer
- **Hybrid**: Big TONY DECAY wordmark (Darkroom) + columns (Explore / Connect) + spinning Firma kept as a small detail

### CTA color system
- Primary: royal #2B5DAE (white text)
- Secondary/dark pill: ink #1A1A1A (cream text)
- High-contrast pill style across the site

---

## EXECUTION ORDER (verified one at a time)

### Phase 1 \u2014 Foundations (no design risk, ship fast)
1. **P0: image bug fix** \u2014 write `scripts/convert-images.js` (sharp), generate `.webp` for all `/public/gallery/*.png`, update `constants.ts` + `Hero.tsx` + `FloatingBadge.tsx` + `Gallery.tsx` + `Product.tsx` to use `.webp` paths, add `unoptimized={true}` on those Image tags
2. **Hero.tsx:95** \u2014 remove `[tagline, cue]` from fadeTargets so LIMITED EDITION + arrow stop disappearing
3. **FAQ.tsx:84-86** \u2014 + morphs to \u2212 smoothly (replace 45\u00b0 rotation with horizontal-line collapse)

### Phase 2 \u2014 Navbar redesign (biggest single piece)
4. **New top MarqueeBar component** (28px slim, JetBrains Mono caps, rotating shipping/scarcity text)
5. **Navbar rewrite**: hybrid edge-to-edge solid (hero) \u2192 floating Clue-style pill (rest), burger LEFT (in 2px box), Firma CENTER (mix-blend-difference), basket RIGHT, royal blue PRE-ORDER pill RIGHT-MOST
6. **Scroll behavior**: hide on scroll-down, smooth return on scroll-up, marquee re-appears only at top \u22c0200px
7. **MobileMenu**: + \u2192 \u2212 close icon morph, links updated to WORK/ABOUT/SHOP/FAQ/CONTACT

### Phase 3 \u2014 Hero rebuild (Darkroom-style + wireframe)
8. **Hero.tsx**: TONY DECAY wordmark + featured Charizard print #5 in 2px wireframe box + copy + PRE-ORDER + SEE THE PRINTS CTAs
9. **Wireframe section borders**: implement as utility class in `globals.css`. Apply to Hero outer container.

### Phase 4 \u2014 Gallery (two parts)
10. **3-row marquee teaser** (NEW component): 5+5+5 prints, alternating L/R, 60s same-speed, continuous filmstrip with 2px vertical dividers
11. **Scroll-lock pinned deep dive** (Gallery.tsx rewrite): horizontal scrub through 15 prints, sidebar tabs 1-15 with current highlighted

### Phase 5 \u2014 Other sections
12. **Artist** \u2014 quote + bio in wireframe card. Generate quote/bio from brand context.
13. **Product (Vol. I)** \u2014 heading change to TONY DECAY / VOL. I. Card fan goes BIG + premium. Royal pill PRE-ORDER.
14. **FAQ** \u2014 wireframe border, + \u2192 \u2212 already done in phase 1
15. **Contact** \u2014 form + newsletter + IG link in wireframe card
16. **Footer** \u2014 hybrid: big TONY DECAY wordmark + columns + small spinning Firma detail
17. **FloatingBadge** \u2014 swap to print #11 (heart sparkles) zoom

### Phase 6 \u2014 Polish
18. **Remove section-fade classes** from globals.css + all wrapper components
19. **Sweep fade-up animations** across all files (Hero/Gallery/Artist/Contact/Product/FAQ heading entrances) \u2014 replace with color shifts or remove
20. **Update BRAND.md** with typography rules, color palette w/ usage, wireframe system, CTA library, animation rules

### Phase 7 \u2014 Verify
21. Test at 390px (iPhone 12 Pro) and 1440px desktop
22. User reviews live

## Verification approach
User checks each phase in browser at 390px iPhone 12 Pro and 1440px desktop, says yes/no, we move on. No batch shipping. Stop at each phase boundary for confirmation.

---

## Files this plan will touch (when implemented)
- `src/components/Navbar.tsx` (rewrite)
- `src/components/MobileMenu.tsx` (icon morph)
- `src/components/Hero.tsx` (fadeTargets fix + composition rethink)
- `src/components/Gallery.tsx` (scroll-lock rewrite, pending decision)
- `src/components/Product.tsx` (image bug + maybe PRE-ORDER + tilt)
- `src/components/FAQ.tsx` (icon morph)
- `src/components/FloatingBadge.tsx` (image swap)
- `src/app/globals.css` (remove section-fade classes)
- `src/app/page.tsx` (remove section-fade wrappers, add new Marquee component)
- `src/lib/constants.ts` (maybe add marquee text constant)
- **New file**: `src/components/MarqueeBar.tsx` (top scrolling shipping bar)

## Verification approach (per user)
User checks each fix in browser themselves at 390px iPhone 12 Pro and 1440px desktop, says yes/no, then we move on. No batch shipping.
