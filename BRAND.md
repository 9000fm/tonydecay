# Tony Decay - Brand Guidelines

## Identity
- Premium limited-edition art print collection
- Tone: gallery meets tattoo shop. Serious, collectible, underground.
- Audience: art collectors, Pokemon/anime fans, mobile-first (Instagram)

## Colors

| Token       | Hex       | Usage                         |
|-------------|-----------|-------------------------------|
| `bg`        | `#0D1B2D` | Dark sections                 |
| `bg-alt`    | `#0A1520` | Alternate dark                |
| `paper`     | `#F0EBDC` | Light sections                |
| `ink`       | `#1A1A1A` | Text on light                 |
| `ink-soft`  | `#4A4438` | Body text on light            |
| `ink-faint` | `#8A8170` | Captions on light             |
| `gold`      | `#F7C234` | Accent, highlights            |
| `crimson`   | `#D7322E` | CTA, emphasis                 |
| `royal`     | `#2B5DAE` | Hover states, links on dark   |

## Fonts

| Role    | Family         | Usage                      |
|---------|----------------|----------------------------|
| Heading | Anton          | All section headings       |
| Body    | DM Sans        | Body text, buttons, UI     |
| Mono    | JetBrains Mono | Labels, counters, meta     |
| Display | Fraunces       | Rare decorative use        |

## Spacing
- Section padding: `py-24 sm:py-32` (standard) or `py-28 sm:py-36` (generous)
- Content max-width: `max-w-5xl` or `max-w-7xl`
- Between major elements: `mt-12` to `mt-16`
- Between list items: `space-y-2.5` to `space-y-3`
- Section transitions: soft gradient bleed (80px), never hard color cuts

## Rules
- No em dashes in copy. Use regular dashes.
- No opacity fade entrances. Color or position transitions only.
- No scale animations.
- Buttons: sharp edges (no border-radius) except floating badge
- Bullets: simple `w-1.5 h-1.5 rounded-full`, no animation
- All section bgs via Tailwind classes, never inline hex
