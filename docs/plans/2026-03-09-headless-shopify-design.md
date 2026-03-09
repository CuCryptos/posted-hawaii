# Headless Shopify Migration Design

## Goal

Migrate POSTED HAWAI'I from Snipcart to headless Shopify. Keep the existing Next.js frontend, use Shopify Storefront API for products/cart/checkout, replace custom Printify webhook with native Shopify-Printify integration.

## Architecture

Next.js frontend stays exactly as-is visually. Shopify becomes the invisible commerce backend. Customers visit postedhi.com (hosted on Vercel), browse products fetched from Shopify Storefront API, add items to a cart (stored in Shopify as a "cart" object), and click Checkout which redirects to Shopify's hosted checkout.

Printify connects directly to Shopify — when an order is placed, Printify auto-fulfills it. No custom webhooks.

```
Customer → postedhi.com (Next.js on Vercel)
               ↓
         Shopify Storefront API (products, cart, checkout URL)
               ↓
         Shopify Checkout (checkout.postedhi.com)
               ↓
         Printify (auto-fulfills via Shopify integration)
```

## Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Commerce backend | Shopify (headless) | Native Printify integration, handles payments/taxes/shipping |
| Database | None (Shopify only) | Single source of truth, less infrastructure |
| Checkout | Redirect to Shopify hosted | Simpler, handles PCI compliance, brandable |
| Cart UI | Dedicated `/cart` page | Clean, focused checkout flow |
| Product data | Shopify as source of truth | Managed in Shopify admin, fetched via Storefront API |
| Printify | Via Shopify app (auto-sync) | No custom webhooks, battle-tested integration |

## Data Flow

### Products (build time + ISR)
```
Shopify Storefront API → GraphQL query → Next.js server components
```
- `/shop` fetches all products at build time
- `/shop/[slug]` fetches individual product with variants, images, pricing
- Revalidates every 60s (ISR) — Shopify admin changes appear within a minute
- Product handles in Shopify = URL slugs

### Cart (client-side, persisted via Shopify)
```
User clicks "Add to Cart"
  → CartProvider calls Shopify cartLinesAdd mutation
  → Shopify returns updated cart (line items, subtotal, checkout URL)
  → Cart state updates across all components
  → Cart ID stored in localStorage (persists across sessions)
```

### Checkout
```
User clicks "Checkout" on /cart page
  → Redirect to cart.checkoutUrl (Shopify hosted checkout)
  → Customer pays on Shopify
  → Shopify notifies Printify → order auto-fulfilled
```

### Environment Variables
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=posted-hawaii.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
```

## Components & Pages

### What Changes

| Component | Current | After Migration |
|-----------|---------|-----------------|
| `app/layout.tsx` | Snipcart CSS/JS/div | `CartProvider` wrapper, no third-party scripts |
| `components/layout/Navbar.tsx` | `snipcart-checkout` class, `snipcart-items-count` | Custom cart icon with count from `useCart()`, links to `/cart` |
| `components/shop/ProductDetail.tsx` | `data-item-*` attributes | `addToCart(variantId, quantity)` from `useCart()` |
| `components/home/LookbookDrawer.tsx` | Snipcart data attributes | `addToCart()` with variant selector |
| `app/shop/page.tsx` | Reads from `lib/products.ts` | Fetches from Shopify Storefront API |
| `app/shop/[slug]/page.tsx` | `getProductBySlug()` local data | GraphQL query by handle |

### What's New

| File | Purpose |
|------|---------|
| `lib/shopify.ts` | Storefront API client — all GraphQL queries and mutations |
| `lib/shopify-types.ts` | TypeScript types for Shopify responses |
| `components/cart/CartProvider.tsx` | React context — cart state, add/remove/update functions |
| `app/cart/page.tsx` | Full cart page — line items, quantities, subtotal, checkout button |

### What's Deleted

| File | Why |
|------|-----|
| `lib/products.ts` | Products come from Shopify |
| `lib/printify.ts` | Printify auto-syncs via Shopify |
| `app/api/snipcart/webhook/route.ts` | No more custom order webhook |
| `app/api/snipcart/validate/route.ts` | No more price validation |
| `app/api/printify/products/route.ts` | No more Printify product API |

### What Stays Untouched
- All styling, brand tokens, Tailwind config
- Homepage sections (Hero, CollectionGrid, BrandStory, EmailSignup)
- About, Contact, Drops, Blog pages
- All product images in `public/images/products/`
- Printify artwork pipeline (SVG → PNG)
- FASHN MCP

## Shopify Setup Prerequisites

Before any code changes:

1. **Create Shopify store** → `posted-hawaii.myshopify.com`
2. **Install Printify app** → Connect existing Printify account (Shop ID 26715541)
3. **Verify products synced** — Printify pushes 7 products into Shopify with variants/pricing/images
4. **Create Storefront API app** → "POSTED Frontend" with scopes: `unauthenticated_read_products`, `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`
5. **Customize checkout** → Brand colors (Coral Reef buttons, Pikake Cream background, Asphalt text) + POSTED logo
6. **Connect domain** → Add `postedhi.com` via Cloudflare DNS

**Critical dependency:** Printify Shopify app must be installed and products synced before deleting `lib/printify.ts` and the custom webhook code. The old code stays until the new integration is confirmed working.

## Cost

Shopify Basic: $39/mo (first 3 months at $1/mo with trial).
Replaces: Snipcart ($0 base + 2% transaction fee on paid plan).
Net cost increase is minimal and offset by reliability gains.
