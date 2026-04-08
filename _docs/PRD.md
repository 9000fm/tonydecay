# Product Requirements Document (PRD)
## Tony Decay — Limited Edition Print Store

**Version:** 1.1
**Date:** March 31, 2026
**Author:** Flavio Manyari (Developer) / Luz (PM Assistant)
**Status:** Draft — Pending client review

---

## 1. Product Summary

A single-product e-commerce landing page for Tony Decay, a tattoo artist and graphic designer specializing in fan art illustrations. The site serves as the primary online sales channel for his first limited edition collection: 100 sets of 15 mini art prints, priced at **$300 USD all-inclusive** (shipping, payment processing fees — everything covered).

The page must convey trust, exclusivity, and professionalism to convert organic Instagram traffic and word-of-mouth referrals into purchases. Paid advertising will be explored in Phase 2 after validating organic demand.

---

## 2. Business Objective

- Sell 100 limited edition collections ($300 each) through a dedicated web channel
- Provide a trustworthy, professional purchasing experience for international buyers
- Establish Tony Decay's online presence beyond Instagram
- Build an organic audience through IG collaborations with pop culture / fandom pages

**Revenue target:** $30,000 USD gross (100 collections x $300)
**Estimated net revenue:** ~$24,000 USD (after shipping ~$50/order + PayPal fees ~$10/order)

> Tony is aware of the margin breakdown and has confirmed the $300 all-in pricing.

---

## 3. Problem It Solves

Tony Decay has strong engagement on Instagram but no dedicated sales channel. Selling high-ticket art ($300+) through DMs is inefficient, lacks trust signals for new buyers, and cannot scale. International buyers need familiar payment methods (PayPal) and a professional storefront to feel confident purchasing.

---

## 4. Target User

**Primary:** International art collectors and fan art enthusiasts (EU, US, Canada)
- Age 18-35
- Active on Instagram
- Comfortable buying online
- Willing to spend $300+ on art
- Expect PayPal as primary payment option

**Secondary:** Latin American buyers (Peru and region)
- Prefer local payment methods (Yape/Plin)
- May discover through IG collabs or word of mouth

---

## 5. MVP Scope

**In scope:**
- Single-product landing page (one collection, one price point)
- Two payment methods: PayPal, Yape/Plin
- Live inventory counter (XX/100 remaining)
- English language (primary audience is international)
- Mobile-first responsive design
- Order confirmation email (automated via Resend)
- Abandoned checkout follow-up email (via Resend)
- Meta Pixel integration (tracking from day one for future ad campaigns)

**Out of scope (Phase 2+):**
- Product catalog / multiple products
- Shopping cart
- Binance Pay / crypto payments
- Newsletter / mailing list
- Discount codes / promos
- Analytics dashboard for Tony
- User accounts / login
- Blog
- Spanish language version
- Social proof section (IG embeds, testimonials, collab badges)
- Paid advertising campaigns (organic first)

---

## 6. Included Features

### 6.1 Product Display
- Web-optimized gallery of all 15 prints in the collection (1200-1600px max, WebP format)
- Zoom / lightbox on individual prints
- Collection description and story
- Physical packaging showcase (craft paper, pixel/Sugimori-style design)
- Certificate of authenticity mention (signed, numbered 1/100 to 100/100, physical only)

> **Image protection:** No full-resolution files served on the web. All images are web-optimized with lazy loading. Optional subtle watermarking for gallery images to deter copying.

### 6.2 Live Inventory Counter
- Real-time display: "XX/100 collections remaining"
- Updates automatically on each confirmed sale
- Creates urgency and social proof simultaneously
- Data source: Supabase database

### 6.3 Checkout / Payment
- **Flat pricing: $300 USD all-inclusive** (covers product, shipping, and payment processing fees)
- **PayPal:** Primary payment method via PayPal SDK
- **Yape/Plin:** QR code display for local Peruvian payments (S/ PEN equivalent)
- Order confirmation email (automated via Resend)
- Abandoned checkout follow-up email (automated via Resend)
- Each order generates a unique order ID stored in Supabase

> **Open question:** Yape may support auto-verification via confirmation codes. Needs further research. For MVP, Yape payments may require manual confirmation from Tony.

### 6.4 Social Proof (Phase 2)
- Embedded Instagram posts/stories where buyers tag Tony
- Curated screenshot testimonials from DMs (with permission)
- Collaboration logos/badges (partner IG pages)

### 6.5 Artist Section
- Written bio (no photo — artist prefers not to show his face)
- Artist avatar: pixel art or illustrated self-portrait (on-brand)
- Artist signature as logo/brand mark
- Link to Instagram

### 6.6 FAQ
- What's included in the collection?
- Shipping times and methods (DHL, 1-2 weeks international)
- Returns/refunds policy
- Payment methods explained
- Is this official merchandise? (Fan art disclaimer)

### 6.7 Legal
- Fan art disclaimer (not affiliated with any franchise)
- Terms and conditions
- Privacy policy (required for PayPal and Meta Pixel)

---

## 7. Excluded Features (Phase 2)

- Product catalog / multiple SKUs
- User accounts and order history
- Shopping cart (single product = direct checkout)
- Newsletter signup and email marketing
- Blog / content section
- Discount codes or promotional pricing
- Admin dashboard for Tony (developer manages backend)
- Reviews system (using IG embeds instead — Phase 2)
- Multi-language (English only for MVP)
- Wishlist / save for later
- Binance Pay / crypto payments
- Social proof section (IG embeds, testimonials, collab badges)
- Paid advertising campaigns

---

## 8. Primary User Flow

```
1. User arrives (from IG link, collab page, or direct URL)
   |
2. (Small intro) then Hero section: sees product, price ($300), "XX/100 left", CTA button
   |
3. Scrolls: gallery of 15 prints, packaging, certificate info
   |
4. Scrolls: about the artist, FAQ
   |
5. Clicks "BUY NOW" (sticky CTA or returns to top)
   |
6. Checkout modal/section:
   - Enters shipping info (name, address, email, phone)
   - Selects payment method (PayPal / Yape)
   |
7. Completes payment on provider's interface
   |
8. Confirmation page + email with order ID
   |
9. Counter updates: "XX/100 remaining"

[If user abandons checkout at step 6-7]
   -> Follow-up email sent via Resend after timeout
```

---

## 9. Page Structure / Sections

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Navigation** | Minimal: logo (signature) + "Buy Now" CTA |
| 2 | **Hero** | Product image, collection name, $300 price, counter, primary CTA |
| 3 | **Gallery** | All 15 prints displayed (grid or horizontal scroll) |
| 4 | **The Package** | Photos of craft packaging, unboxing experience |
| 5 | **Certificate** | Mention of signed + numbered authenticity (1/100) |
| 6 | **About the Artist** | Bio, avatar (illustrated), IG link |
| 7 | **FAQ** | Accordion or list format |
| 8 | **Checkout** | Shipping form + payment selection |
| 9 | **Footer** | IG, legal links, fan art disclaimer |

---

## 10. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Display live counter (XX/100) sourced from Supabase | P0 |
| FR-02 | Accept PayPal payments via PayPal SDK | P0 |
| FR-03 | Display Yape/Plin QR code for local payments | P0 |
| FR-04 | Collect shipping info (name, email, phone, full address) | P0 |
| FR-05 | Store orders in Supabase with unique order ID | P0 |
| FR-06 | Send confirmation email via Resend on successful payment | P0 |
| FR-07 | Decrement counter on confirmed payment | P0 |
| FR-08 | Prevent purchase when counter = 0 (sold out state) | P0 |
| FR-09 | Image gallery with zoom/lightbox | P1 |
| FR-10 | Mobile-responsive checkout flow | P0 |
| FR-11 | Sticky "Buy Now" CTA on scroll | P1 |
| FR-12 | FAQ accordion | P2 |
| FR-13 | Abandoned checkout follow-up email via Resend | P1 |
| FR-14 | Meta Pixel integration for tracking | P1 |

---

## 11. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Page load time < 3 seconds on 4G mobile |
| NFR-02 | Lighthouse Performance score > 90 |
| NFR-03 | HTTPS enforced |
| NFR-04 | Mobile-first responsive (primary traffic from IG = mobile) |
| NFR-05 | PayPal checkout compliant with PayPal integration guidelines |
| NFR-06 | GDPR-compliant privacy policy (Meta Pixel + international buyers) |
| NFR-07 | Images optimized (WebP, lazy loading, 1200-1600px max) |
| NFR-08 | Uptime 99.9% (Vercel) |

---

## 12. Content, Design & Brand Considerations

**Brand:**
- Logo: Tony Decay's handwritten signature
- No photo of the artist (use illustrated/pixel avatar)
- Tone: exclusive, collectible, underground art culture
- Fan art positioning — celebrate the art without claiming official affiliation

**Design:**
- Dark theme suggested (art looks better on dark backgrounds)
- Typography: bold, clean, slightly editorial
- High contrast for CTAs
- Packaging photos are KEY selling point — treat them as product photos
- The counter should feel prominent but not desperate

**Content needed from Tony:**
- [ ] Web-optimized images of all 15 prints (1200-1600px, no full-res on web)
- [ ] Photos of packaging (craft paper, pixel designs)
- [ ] Written collection description / story
- [ ] Artist bio (English)
- [ ] Signature file (vector or high-res PNG)
- [ ] Illustrated avatar / pixel self-portrait
- [ ] FAQ answers (shipping times, returns, etc.)
- [ ] Fan art disclaimer text

**Refund Policy (draft):**
> All sales are final. Due to the limited edition nature of this collection, we do not offer refunds or exchanges. If your order arrives damaged during shipping, please contact us within 7 days of delivery with photos of the damage. We will work with you to resolve the issue, which may include a replacement or partial refund at our discretion.

> Note: Shipping is included in the $300 price. There are no separate shipping charges.

---

## 13. Dependencies & Integrations

| Dependency | Status | Notes |
|------------|--------|-------|
| PayPal Business Account | TBD | Tony needs verified PayPal business account |
| Yape account | TBD | Tony's Yape for QR display. Research auto-verification via confirmation codes. |
| Supabase project | Not started | Free tier sufficient for MVP |
| Resend account | Not started | Free tier (3k emails/month) — confirmation + abandoned checkout emails |
| Vercel account | Available | Flavio's existing account |
| Domain | TBD | Tony needs to purchase domain |
| Cloudinary | Not started | Free tier for image hosting (web-optimized only) |
| Meta Pixel | Not started | Needs Meta Business Suite setup for pixel tracking |
| DHL shipping | Tony manages | Physical fulfillment by Tony |

**Phase 2 dependencies:**
| Dependency | Notes |
|------------|-------|
| Binance Pay Merchant | Tony needs KYC + merchant setup for crypto payments |

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| Conversion rate (organic / warm IG traffic) | 5-10% |
| Conversion rate (paid / cold traffic — Phase 2) | 1-3% |
| Collections sold (first 30 days) | > 20 |
| Collections sold (total) | 100 (sell out) |
| Page load time (mobile) | < 3 seconds |
| Lighthouse Performance | > 90 |
| Payment completion rate | > 80% of initiated checkouts |
| Bounce rate | < 60% |

---

## 15. Risks & Open Questions

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fan art legal issues | High | Clear disclaimer, no franchise names/logos on the page |
| PayPal disputes/chargebacks | Medium | Clear refund policy, shipping confirmation with tracking |
| Low conversion from organic | Medium | Optimize hero section, CTA placement, collab with IG pages |
| Yape manual verification delays | Low | Research auto-accept codes; set clear expectations for buyers |
| Tony's fulfillment capacity (packing 100 orders) | Medium | Phase orders, don't oversell |
| International shipping delays | Low | Set expectations in FAQ (1-2 weeks DHL) |
| Image theft / copying from site | Low | Web-optimized only (1200-1600px), optional watermarks |

---

## 16. Organic Growth & Partner Strategy

Since we are going organic first (paid ads deferred to Phase 2):

- **Partner mapping:** Identify IG pages in the vintage/pop culture/fandom space (Pokemon, anime, retro gaming, etc.)
- Tony manages all partner relationships and collab outreach
- Site will include space for collab badges/links in Phase 2
- Meta Pixel is installed from day one to collect data for future ad campaigns

---

## 17. Next Steps

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | Tony sends all content assets (images, bio, signature, etc.) | Tony | TBD |
| 2 | Tony sets up PayPal Business account | Tony | Before dev starts |
| 3 | Purchase domain | Tony | TBD |
| 4 | Research Yape auto-verification (confirmation codes) | Flavio | Before dev starts |
| 5 | Design mockup / wireframe | Flavio | After content received |
| 6 | Set up Supabase project + schema | Flavio | Week 1 of dev |
| 7 | Set up Meta Business Suite + Pixel | Flavio | Week 1 of dev |
| 8 | Build MVP | Flavio | 1-2 weeks after design approval |
| 9 | QA + payment testing | Both | Before launch |
| 10 | Launch + organic promotion via IG collabs | Tony | After QA |
| 11 | Evaluate ad strategy based on organic results | Both | Phase 2 |

---

## Key Pending Questions

1. **Domain name?** — What URL will the store live on? (tonydecay.com? other?)
2. **PayPal account** — Tony likely has personal PayPal. Needs upgrade to Business (free, takes ~1 day). Required for SDK integration.
3. ~~**Refund policy**~~ — Defined (see Content section)
4. **Yape/Plin verification** — Can Yape auto-accept payments via confirmation codes, or will Tony need to manually verify each Yape order? Needs research.
5. **Print pricing** — Confirmed at $300 all-inclusive. Tony has validated.
6. **Shipping to all countries?** — Any countries Tony won't ship to?
7. **Timeline** — Launch when Tony finishes 15/15 prints (currently 12/15). No fixed date.
8. **Collab partners** — Map out IG pages in vintage/pop culture/fandom space for organic promotion. Tony manages outreach.
9. **Certificate design** — Tony designs the physical certificate and all physical materials.
10. **Abandoned checkout** — Follow-up email will be sent via Resend when a user starts but doesn't complete payment. Timing TBD (e.g., 1 hour, 24 hours).

---

*This PRD will be updated as Tony provides content assets and answers to pending questions.*
