# Tony Decay — Brand Guidelines

## Identity
- **Brand**: Tony Decay — limited edition art print collections
- **Tone**: Premium, underground, collectible. Not corporate, not playful. Think gallery meets tattoo shop.
- **Audience**: Art collectors, Pokemon/anime fans, Instagram-first (mobile primary)

## Color Palette

### Primary
| Name        | Hex       | Usage                                    |
|-------------|-----------|------------------------------------------|
| Dark Navy   | `#0D1B2D` | Primary background, dark sections        |
| Deep Navy   | `#0A1520` | Alternate dark bg (gallery, footer)      |
| Cream       | `#F0EBDC` | Light sections (hero, product, contact)  |
| Warm Cream  | `#ECE4D0` | Hover states, subtle bg variation        |
| Ink         | `#1A1A1A` | Primary text on light bg                 |

### Accent (from Tony's prints)
| Name    | Hex       | Usage                                |
|---------|-----------|--------------------------------------|
| Gold    | `#F7C234` | Accent lines, highlights, CTA hover |
| Crimson | `#D7322E` | Alerts, emphasis, CTA bg             |
| Royal   | `#2B5DAE` | Links on dark bg, info states        |
| Teal    | `#3CB5B5` | Secondary accent, decorative         |
| Coral   | `#F2A2BC` | Soft accent, decorative              |
| Leaf    | `#5BAA4F` | Success states, decorative           |

### Text
| Name      | Hex       | Usage                        |
|-----------|-----------|------------------------------|
| Ink       | `#1A1A1A` | Headings, body on cream bg   |
| Ink Soft  | `#4A4438` | Body text on cream bg        |
| Ink Faint | `#8A8170` | Captions, meta on cream bg   |
| Paper     | `#F0EBDC` | Text on dark bg              |
| Paper/60  | `#F0EBDC99` | Secondary text on dark bg  |

## Typography

### Font Stack
| Role     | Family         | Weights       | Usage                          |
|----------|----------------|---------------|--------------------------------|
| Display  | Fraunces       | 400–700       | Decorative headings (rare)     |
| Heading  | Anton          | 400           | All section headings, uppercase, tight tracking |
| Body     | DM Sans        | 300–700       | All body text, UI elements     |
| Mono     | JetBrains Mono | 300–600       | Counters, labels, codes        |

### Heading Scale (mobile-first)
- **Hero section titles**: `text-[5rem]` → `text-[20rem]` (fluid, brutalist, edge-to-edge)
- **Section headings**: `text-[7rem]` → `text-[28rem]` (VOL I style, impactful)
- **Subsection headings**: `text-xl` → `text-3xl`
- **All headings**: `uppercase`, `font-tattoo` (Anton), tight `leading` (0.72–0.85)

### Body Text
- **Primary**: `text-base` (16px), `font-sans`, `text-ink-soft`, `leading-relaxed`
- **Secondary**: `text-sm` (14px), `font-sans`, `text-ink-faint`
- **Labels/meta**: `text-[10px]`–`text-xs`, `font-mono`, `uppercase`, `tracking-[0.2em]`

## Spacing

### Section Padding
- **Vertical**: `py-20 sm:py-28` (80px mobile, 112px desktop)
- **Horizontal**: `px-6 sm:px-10` for content areas
- **Max content width**: `max-w-7xl` (1280px)

### Element Spacing
- **Between heading and content**: `mt-10 sm:mt-14`
- **Between content blocks**: `gap-8 md:gap-12`
- **Between list items**: `space-y-3` (12px — compact, professional)
- **Between inline elements**: `gap-3` (12px)
- **Button padding**: `px-8 py-3.5` (compact), `px-10 py-4` (prominent)

## Components

### Buttons
- **Primary CTA**: `bg-ink text-paper`, no border-radius (sharp), `uppercase tracking-[0.15em]`, `font-sans font-medium text-sm`
- **Hover**: `bg-royal` (transition 300ms)
- **No rounded buttons** except the floating badge

### Lists
- **Bullet**: Simple `w-1.5 h-1.5 rounded-full bg-ink` — no animation, no blob
- **Item spacing**: `space-y-3`
- **Text**: `font-sans text-sm sm:text-base text-ink-soft`

### Cards
- **Print cards**: Sharp edges (no border-radius), `shadow-2xl`
- **Aspect ratio**: `3/4` for print cards

### Section Transitions
- **Dark → Light**: Hard cut, no gradient bleed
- **Light → Dark**: Hard cut
- **No diagonal cuts, no gradients between sections** — clean hard edges

## Animation Rules
- **NO fades** (opacity 0→1 entrance animations). Use color transitions or position shifts.
- **NO grow/shrink** scale animations
- **Scroll-driven** animations preferred (GSAP ScrollTrigger)
- **Parallax**: subtle, max 30-40% yPercent shift
- **Blob wobble**: very subtle (2-4% border-radius shift), 60s+ duration
- **All animations via GSAP** — no Framer Motion, no CSS transitions for complex motion

## Image Treatment
- **Print images**: Always `object-cover`, sharp edges (no border-radius)
- **On cream bg**: Use `mix-blend-mode: multiply` for atmospheric overlays
- **Gallery**: Full-bleed, no gaps between images, seamless marquee loop
- **Hero prints**: Low opacity (5-30%), treated as atmospheric texture, NOT competing with content

## Logo (Firma.png)
- **Effect**: `mix-blend-mode: difference` + `filter: invert(1) brightness(1.1)`
- **Scroll behavior**: Starts centered at 33vh, shrinks to top-left (24px, 24px) corner on scroll
- **z-index**: 110 (above all overlays)

## Dark Mode Only
- No theme toggle, no light mode support
- Light sections (cream) exist but are part of the design rhythm, not a "mode"
