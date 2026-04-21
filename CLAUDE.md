# tonydecay

Limited edition print store for Tony Decay. Single-product e-commerce landing page.
100 sets of 15 mini art prints at $300 USD all-inclusive.

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4
- Supabase (PostgreSQL), PayPal SDK, Resend, Cloudinary, Meta Pixel
- GSAP + ScrollTrigger + Lenis for animations and smooth scroll
- Deployed on Vercel
- ESLint 9 + Prettier (+ tailwindcss plugin) + Husky pre-commit + lint-staged

## Rules

- Dark theme only, no theme toggle
- Mobile-first: primary traffic is Instagram (mobile)
- Single product ($300), no cart, no user accounts
- All prices displayed as "$300" — no separate shipping line
- English only for MVP
- Keep it lean — avoid over-engineering
- Art is the star — site frames it (dark bg, gold/amber accents)

## Dev Practices

- Use Tailwind theme classes (`bg-bg`, `bg-paper`, `text-ink`) — NEVER hardcode hex in `style={{ }}` for colors that exist in the theme
- GSAP for all animations — no Framer Motion, no CSS transitions for complex motion
- Lenis for smooth scroll — init only after splash completes
- All section backgrounds use theme classes, not inline styles
- Test at 390px (iPhone 12 Pro) for mobile, 1440px for desktop
- Preserve existing working features when editing — never remove/modify what wasn't requested
- When rewriting a component, list what currently works and verify it's preserved after

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (runs TS typecheck inside)
- `npm run lint` — ESLint (no writes)
- `npm run lint:fix` — ESLint with autofix
- `npm run typecheck` — `tsc --noEmit` standalone
- `npm run format` / `format:check` — Prettier
- `npm run optimize:images` — re-generate `public/gallery/*.webp` from PNG originals (1600w, q82)

Before pushing: run `lint` + `typecheck` + `build` locally. The pre-commit hook runs `lint-staged` (ESLint + Prettier on staged files) automatically.

## Image Optimization (IMPORTANT)

- **Vercel image optimization is OFF** (`next.config.ts`: `images.unoptimized: true`) — we pre-optimize manually to avoid Hobby-plan transform limits
- Source PNGs live in `public/gallery/*.png` but are excluded from deploy via `.vercelignore`
- `npm run optimize:images` regenerates `.webp` siblings at max 1600w, quality 82
- Code references `.webp` only — see `src/lib/constants.ts` (`PLACEHOLDER_PRINTS`, `HERO_BG_IMAGE`)
- Any new gallery asset: drop the PNG in `public/gallery/`, run `npm run optimize:images`, reference the `.webp` path

## Section Order

Hero → Gallery → Product → Artist → FAQ → Contact → Footer

## Key Assets

- `public/gallery/1.webp` through `14.webp` + `3beta.webp` — Tony's prints (PNG originals kept locally, not deployed)
- `public/gallery/Firma.webp` — Tony's signature/logo
- `public/cursor/banana-cursor.png`, `banana-clicked-cursor.png` — custom cursors (PNG required by CSS `cursor:` property)

## Animation Conventions

- NO opacity fade entrances (0→1). Use color transitions or position shifts.
- NO scale/grow/shrink animations
- Scroll-driven animations via GSAP ScrollTrigger
- Blob wobble: visible but subtle (~10-15% border-radius variation, 30-40s cycle)
- All GSAP timelines must be killed in useEffect cleanup
- Use `useRef` for callbacks passed to GSAP (avoid stale closures)
