# Tony Decay — Brand Guidelines

## Brand Personality
- **Playful but serious** — childlike innocence with adult craft
- **Vintage but not retro-cosplay** — feels old without explicit references
- **Tactile** — paper, ink, hand-drawn lines
- **Bright but warm** — flat colors, never neon
- **Less is more** — let the art breathe

> Inspired by old-school illustrated cards and trading cards. Not stated explicitly anywhere on the site.

## Color Palette
Extracted from Tony's actual artwork.

### Paper / Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `paper` | `#F0EBDC` | Main background — warm cream, matches print stock |
| `paper-warm` | `#ECE4D0` | Subtle alternation |
| `paper-dark` | `#DDD3BD` | Borders, dividers on cream |

### Bright Print Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `royal` | `#2B5DAE` | Signature blue (Tony's print outlines) — primary accent |
| `royal-deep` | `#1E3F7A` | Hover/pressed states |
| `coral` | `#F2A2BC` | Soft pink — used sparingly for warmth |
| `crimson` | `#D7322E` | Bright red — CTAs, alerts, attention |
| `gold` | `#F7C234` | Warm yellow — section dividers, highlights |
| `leaf` | `#5BAA4F` | Friendly green — accents, fresh moments |
| `teal` | `#3CB5B5` | Bright teal — secondary backgrounds |

### Ink (Text + Outlines)
| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#1A1A1A` | Body text, headings, outlines |
| `ink-soft` | `#4A4438` | Secondary text, captions |
| `ink-faint` | `#8A8170` | Tertiary text, hints |

### Dark Sections
| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#0a0a0a` | Splash screen, Gallery (art needs dark contrast) |
| `bg-alt` | `#141414` | FAQ section |

## Section Color Map
| Section | Background | Text |
|---------|-----------|------|
| Splash | `bg` (dark) | white |
| Hero | `paper` | `ink` |
| Gallery | `bg` (dark) | white |
| Package | `paper` | `ink` |
| Certificate | `paper-warm` | `ink` |
| Artist | `paper` | `ink` |
| FAQ | `bg-alt` (dark) | white |
| Footer | `paper` | `ink` |

## Typography

### Fonts
| Family | Usage | Why |
|--------|-------|-----|
| **Fraunces** | Headings, display, accents | Variable serif with playful curves. Has WONK and SOFT axes for character. Vintage feel without being old. |
| **DM Sans** | Body text, UI, captions | Warmer, friendlier than Inter. Geometric but not sterile. |

### Font Treatment
- **Display headings:** Fraunces with `WONK 1`, `SOFT 80`, light or thin weight, large sizes
- **Subheadings:** Fraunces regular, smaller
- **Body:** DM Sans 400
- **Caption / labels:** DM Sans 300, tracking 0.3-0.5em, uppercase, tiny
- **Logo (TDK):** Bold outline, no fill

### Loading Counter Phases
Number font shifts smoothly:
1. Ultra thin → 2. Thin → 3. Regular → 4. Medium → 5. Bold → 6. Backs off → 7. Thin crawl → 8. Snap to bold

## Print Specs
- **Format:** A5 (148 × 210mm portrait)
- **Paper:** Cream/off-white stock
- **Source:** Tony Decay's Instagram
- **Count:** 15 prints per set
- **Edition:** 100 numbered sets (1/100 - 100/100)
- **Certificate:** Hand-signed

## Imagery Direction
- Art on paper, paper IS the brand
- Dark backgrounds only when art needs contrast (gallery)
- Flat colors, never gradients
- Bold black ink outlines (matches Tony's actual style)
- No glow, no neon, no glassmorphism

## Interaction
- **Cursor:** DK monkey hand (custom, desktop only)
- **Hover:** Deliberate, with delay
- **Scroll:** Lenis smooth
- **Transitions:** GSAP — bold for Hero+Gallery, subtle elsewhere
- **Audio:** Ambient loop on Enter, mute toggle visible

## Don'ts
- ❌ No tech/modern sans (Inter, SF Pro, etc)
- ❌ No CRT effects, scanlines, "retro gaming" filters
- ❌ No explicit Pokemon/TCG references in copy
- ❌ No neon, glow, gradients
- ❌ No rounded corners (sharp = considered)
- ❌ No emoji
- ❌ No "BUY NOW" screaming
- ❌ No hero section formulas (badge/title/subtitle/CTA)

## Do's
- ✅ Lean into the cream paper feel
- ✅ Use Tony's blue and gold prominently
- ✅ Big serif headings with character
- ✅ Bold outlines on UI elements (like ink lines on his prints)
- ✅ Generous whitespace
- ✅ Subtle vintage marks (Roman numerals, edition numbers, etc)
