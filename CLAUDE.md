# tonydecay

Limited edition print store for Tony Decay. Single-product e-commerce landing page.
100 sets of 15 mini art prints at $300 USD all-inclusive.

## Tech Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- Supabase (PostgreSQL), PayPal SDK, Resend, Cloudinary, Meta Pixel
- GSAP + ScrollTrigger + Lenis for animations and smooth scroll
- Deployed on Vercel

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

## Section Order

Hero → Gallery → Product → Artist → FAQ → Contact → Footer

## Key Assets

- `public/gallery/1.png` through `14.png` + `3beta.png` — Tony's prints
- `public/gallery/Firma.png` — Tony's signature/logo
- `public/cursor/1.png`, `2.png` — custom cursors

## Animation Conventions

- NO opacity fade entrances (0→1). Use color transitions or position shifts.
- NO scale/grow/shrink animations
- Scroll-driven animations via GSAP ScrollTrigger
- Blob wobble: visible but subtle (~10-15% border-radius variation, 30-40s cycle)
- All GSAP timelines must be killed in useEffect cleanup
- Use `useRef` for callbacks passed to GSAP (avoid stale closures)
