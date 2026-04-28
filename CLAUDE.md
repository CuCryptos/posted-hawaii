# POSTED HAWAI'I — Project Context

> **Quine project.**
> **Operating system:** [`~/quine-core/`](https://github.com/Quine-Studio/quine-core)
> **Category:** commerce brands (streetwear)
> **Status:** producing (Shopify storefront live; first commerce-engine consumer)
> **Consumed engines:**
> - `commerce` via channel [`posted-hawaii`](https://github.com/Quine-Studio/quine-core/tree/main/engines/commerce/channels/posted-hawaii)
>   (Shopify direct + Etsy listings, product copy, drop-driven launches)
> **Pipelines used:**
> - [`cross-list-from-design`](https://github.com/Quine-Studio/quine-core/blob/main/engines/commerce/pipelines/cross-list-from-design.md)
>   — POSTED has its own pre-existing TS implementation at
>   `scripts/create-printify-drafts.ts`; canonical Python implementation
>   lives in `~/HonuWave/scripts/printify_publish.py`. Migration to a
>   shared `quine-printify` package is on the backlog.
> **Reference implementations in this repo:**
> - `scripts/create-printify-drafts.ts` — Printify product drafts
> - `scripts/upsert-shopify-launch.ts` — Shopify "Launch" metaobject upserts
> - `scripts/recraft-generate.ts` — Recraft V3 SVG generation via Replicate
> - `scripts/check-shopify-admin.ts` — Shopify Admin API health check
> - `scripts/artwork-to-png.sh` — SVG → Printify-ready PNG (rsvg-convert)
> **Platform integration specs:**
> - [Shopify](https://github.com/Quine-Studio/quine-core/blob/main/scoping/platform-integrations/shopify.md)
> - [Printify](https://github.com/Quine-Studio/quine-core/blob/main/scoping/platform-integrations/printify.md)
> - [Recraft V3](https://github.com/Quine-Studio/quine-core/blob/main/scoping/platform-integrations/recraft.md)
> **Sister packages in workspace:**
> - `~/claude-code-vault/Projects/POSTED/posted-brain/` — domain logic / data
> - `~/claude-code-vault/Projects/POSTED/fashn-mcp/` — POSTED's own MCP server
>   for fashn.ai on-model photography (a Quine asset other brands could use)

---

## Project Overview

POSTED HAWAI'I is a Honolulu-based streetwear brand targeting early-20s
locals. The aesthetic is **"bold with discipline"** — expressive,
vibrant, island-rooted energy delivered through intentional design and
premium quality.

**Brand name:** POSTED
**Tagline:** "You know where to find us."
**Location:** Honolulu, Hawai'i
**Established:** 2026
**Future sub-line:** KŪ (premium capsule, launches 12-18 months
post-launch)

This is a real brand being built for the founder's stepson. Treat
every decision like it's going to production.

## Tech Stack (current — verified 2026-04-27)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| E-commerce | **Shopify** Storefront + Admin API (was Snipcart in earlier plan) |
| Hosting | Vercel |
| Email — newsletter | Klaviyo |
| Email — transactional | Resend |
| POD fulfillment | Printify (Etsy connector for cross-listings; direct integration for Shopify) |
| Design — Vectors | Recraft V3 via Replicate (SVG graphic elements) |
| Design — On-model photos | fashn.ai (own MCP server in `../fashn-mcp/`) |
| Design — Compositions | Kittl ($15/mo — typography + graphics + layout) |
| Design — Text concepts | Ideogram v3 (slogan/text exploration) |
| Content | Local MDX in `content/` |

Earlier planning docs reference Snipcart + Supabase Auth — both have
been replaced (Shopify covers cart + auth + product schema natively).

## Brand voice + audience exemplars

These live in [`engines/commerce/channels/posted-hawaii/voice.md`](https://github.com/Quine-Studio/quine-core/tree/main/engines/commerce/channels/posted-hawaii/voice.md)
and `audience.md` in quine-core. When you update brand voice rules
here, mirror the change to the channel file.

Current voice (summary): direct, locally-rooted, street-credible without
being aggressive. References to specific Honolulu/Oʻahu places (Sandy
Beach, Ala Moana, Town, North Shore) ground every drop in real
geography. Avoid generic surf/beach tropes that aren't Hawaiian.

## Commands

```bash
# Local dev
npm run dev
npm run lint
npm run typecheck
npm run check    # lint + typecheck + build

# Shopify operations
npm run shopify:admin:check                              # auth + connection sanity
npm run shopify:launch:upsert -- drop-001-posted-up      # upsert a Launch metaobject

# Printify (drafts only — operator publishes manually)
npx tsx scripts/create-printify-drafts.ts

# Vector graphics
npx tsx scripts/recraft-generate.ts --prompt "Diamond Head silhouette" \
  --output diamond-head.svg --style linocut

# SVG → Printify-ready PNG
./scripts/artwork-to-png.sh printify-artwork/town-tee-front.svg 4500
```

## Environment

Copy `.env.local.example` → `.env.local`. Required vars:

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
SHOPIFY_ADMIN_TOKEN=
SHOPIFY_LAUNCH_METAOBJECT_TYPE=launch
SHOPIFY_LAUNCH_LOOKBOOK_IMAGE_IDS=gid://shopify/MediaImage/...
KLAVIYO_PRIVATE_API_KEY=
KLAVIYO_NEWSLETTER_LIST_ID=
RESEND_API_KEY=
CONTACT_FORM_FROM_EMAIL=
CONTACT_FORM_TO_EMAIL=
# Local-only (artwork + product-draft scripts):
REPLICATE_API_TOKEN=
PRINTIFY_API_TOKEN=
PRINTIFY_SHOP_ID=
```

## Backlog (Quine-relevant)

- [ ] Migrate `scripts/create-printify-drafts.ts` to the canonical
      [cross-list-from-design pipeline](https://github.com/Quine-Studio/quine-core/blob/main/engines/commerce/pipelines/cross-list-from-design.md).
      Either consolidate into a shared `quine-printify` package, or
      port the Python data model (Scene × ProductTemplate × Matrix +
      PlacementProfile) to TS.
- [ ] Adopt `--learn`-equivalent flag for placement-tuning loop
      (currently manual operator dashboard tweak → manual code edit).
- [ ] Document fashn-mcp as a Quine-shared MCP that other brands
      could use for on-model product photography.
- [ ] Ensure Shopify Launch metaobject pattern is reusable: any future
      Quine brand on Shopify with drop-driven launches should be able
      to use the same upsert flow.
