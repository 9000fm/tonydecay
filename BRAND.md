# Tony Decay - Brand Guidelines

## Identity

- Premium limited-edition art print collection (Vol. I - 100 sets at $300)
- Tone: gallery meets tattoo shop. Serious, collectible, underground.
- Visual language: zine / blueprint. Heavy wireframe aesthetic (Salt&Bits). Sharp cuts between dark and cream.
- Audience: art collectors, Pokemon/anime fans. Primary traffic = mobile (Instagram).

## Colors

All tokens live in `src/app/globals.css` as `--color-*` vars and are exposed as Tailwind classes (`bg-paper`, `text-ink`, `border-royal`, etc.). Never hardcode hex in `style={{}}` for a color that exists here.

### Surfaces

| Token        | Hex       | Usage                                        |
| ------------ | --------- | -------------------------------------------- |
| `bg`         | `#0D1B2D` | Dark sections (Gallery, Artist, FAQ, Footer) |
| `bg-alt`     | `#0A1520` | Nested dark cards, deep-dive stage           |
| `paper`      | `#F0EBDC` | Light sections (Hero, Product, Contact)      |
| `paper-warm` | `#ECE4D0` | Featured print backdrop (Hero wireframe box) |
| `paper-dark` | `#DDD3BD` | Scrollbar thumb, subtle light accents        |

### Ink (text on light)

| Token       | Hex       | Usage                           |
| ----------- | --------- | ------------------------------- |
| `ink`       | `#1A1A1A` | Primary text, borders, wordmark |
| `ink-soft`  | `#4A4438` | Body copy, sub-text             |
| `ink-faint` | `#8A8170` | Captions, disabled state        |

    ### Bright print palette

Extracted from the actual prints. Used sparingly as accents.
| Token | Hex | Role |
|----------------|-----------|-----------------------------------------|
| `royal` | `#2B5DAE` | **PRIMARY CTA.** PRE-ORDER, RESERVE YOURS, SHOP NOW pills. Hover link color on dark. |
| `royal-deep` | `#1E3F7A` | Hover state for royal pills |
| `crimson` | `#D7322E` | Emphasis only (not a CTA anymore) |
| `coral` | `#F2A2BC` | Soft accent (reserved) |
| `gold` | `#F7C234` | Selection highlight, occasional accent |
| `leaf` | `#5BAA4F` | Occasional accent |
| `teal` | `#3CB5B5` | Occasional accent |

## Fonts

5 families. Every font has a specific job. Don't cross lanes.

| Role      | Family          | Where it's used                                                    |
| --------- | --------------- | ------------------------------------------------------------------ |
| Display   | Anton (tattoo)  | All big headings: TONY DECAY, VOL. I, FAQ, SAY HI, Footer wordmark |
| Body      | DM Sans         | Body copy, form fields, menu items                                 |
| Mono      | JetBrains Mono  | Marquee, labels, counters, CTA pill text, meta rows                |
| Editorial | Fraunces italic | Artist quote (single use — pull-quote card)                        |
| Arcade    | Sigmar          | Rare decorative accent — reserve for one special moment            |

## Wireframe border system

The whole site leans into a 2px border aesthetic inspired by Salt&Bits — zine/blueprint feel. It's the visual signature.

- **Section cards**: `border-2 border-ink` on light sections, `border-2 border-paper` on dark sections.
- **Cards inside sections**: same rule — every major content block (quote, bio, form, newsletter, IG link, featured print, product cards) wrapped in its own 2px box.
- **Corner labels**: small inline pill at the top of a section — `inline-block border-2 px-3 py-1 font-mono uppercase` with 10px font-size and `letter-spacing: 0.22em`. Examples: `Featured / Vol. I`, `Who / The Artist`, `Questions / Answers`, `Get in Touch`, `Vol. II Notify`.
- **Section bottoms**: `border-b-2 border-ink` or `border-b-2 border-paper` depending on the next section's palette. The border IS the divider — no gradients, no transitions.

## CTA library

Pill system. Rounded-full, mono uppercase text, tight letter-spacing. Never repeat the same CTA label in adjacent sections — vary placement for premium feel.

### Primary (royal)

`bg-royal text-paper hover:bg-royal-deep rounded-full`

- **PRE-ORDER** — Navbar, Hero
- **RESERVE YOURS - $300** — Product
- **SHOP NOW** — available alt
- **NOTIFY ME** — Contact newsletter

### Secondary (ink / outline)

`border-2 border-ink text-ink hover:bg-ink hover:text-paper` OR `bg-ink text-paper hover:bg-royal`

- **SEE THE PRINTS** — Hero (scrolls to #gallery)
- **SEND MESSAGE** — Contact form
- **LEARN MORE** — available alt

### Rules

- Hero uses Pre-Order (primary) + See the Prints (secondary).
- Product uses Reserve Yours - $300 (primary, bigger).
- Contact uses Send Message (secondary ink) + Notify Me (primary royal).
- Never two identical labels back-to-back across sections.

## Section transitions

**Sharp cuts only.** The wireframe border IS the transition.

- Each section ends with `border-b-2` in the opposing palette (dark section → `border-paper`, light section → `border-ink`).
- No `section-fade-*` classes. No 80px gradient bleeds. Those were removed.
- No opacity cross-fades between sections.
- Section stacking order: Hero (paper) → Gallery (bg) → Artist (bg) → Product (paper) → FAQ (bg) → Contact (paper) → Footer (bg).

## Animation rules

- **No opacity fade entrances (0 → 1).** Use color transitions (e.g. Artist quote: low-alpha ink → full ink) or position shifts (FloatingBadge slide up from bottom).
- **No scale / grow / shrink animations** for entrances.
- Scroll-driven entrances via GSAP ScrollTrigger. Kill all timelines in `useEffect` cleanup.
- GSAP only for complex motion. No Framer Motion. No CSS transitions for multi-step.
- Lenis smooth scroll — init only after splash completes.
- Blob wobble: visible but subtle (~10-15% border-radius variation, ~18s cycle).

### Legitimate animation exceptions (keep as-is)

These override the no-fade rule for specific, intentional reasons:

- **CheckoutModal entrance** — modal needs an overlay fade.
- **FAQ accordion** — height + opacity animation on answer open/close (height requires opacity for smoothness).
- **MobileMenu blob expansion** — white blob with `mix-blend-difference` creates the color-shift reveal; blob + solid + content use a coordinated timeline.

## Spacing

- Section padding: `py-20 sm:py-28` (standard), `py-14 sm:py-20` (Footer).
- Content max-width: `max-w-5xl` for text-heavy sections, `max-w-7xl` for grid sections, `max-w-6xl` for Footer/Hero.
- Between major blocks within a section: `mt-10 sm:mt-14` or `mt-12 sm:mt-16`.
- Grid gap between wireframe cards: `gap-4 sm:gap-6`.
- Inside wireframe cards: `p-6 sm:p-8` (or `sm:p-10` for the hero quote card).

## Icon system

Unified `+` / `-` language across the whole UI:

- **Burger (Navbar)**: `+` in a 40x40 2px box. Opens mobile menu.
- **MobileMenu close**: `-` (single horizontal line) in a 40x40 2px box. Matches the burger so it reads as "the same button, state-shifted".
- **FAQ accordion**: `+` collapses to `-` via `scaleY(0)` on the vertical bar. Same visual language.
- **Basket (Navbar)**: 18px stroked basket SVG, 1.8px stroke, in a 40x40 2px box.
- **FloatingBadge dismiss**: small 10px `x` on a circular dark background, top-right corner.

## Rules

- Dark theme only. No theme toggle.
- No em dashes in copy (`-` only).
- Mobile-first. Test 390px (iPhone 12 Pro) before 1440px desktop.
- Single product ($300). No cart, no user accounts.
- All prices shown as `$300`. No separate shipping line (shipping is absorbed).
- All section backgrounds use theme classes (`bg-paper`, `bg-bg`), never inline hex.
- English only for MVP.
- Preserve existing working features when editing. Never remove/modify what wasn't requested.
- Art is the star — site frames it (dark, wireframe borders, royal accents).
