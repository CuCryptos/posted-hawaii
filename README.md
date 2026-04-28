# POSTED HAWAI'I

Headless Shopify storefront for POSTED HAWAI'I, built with Next.js App Router.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Shopify Storefront API
- Local MDX content for blog/editorial

## Environment

Copy `.env.local.example` to `.env.local` and set the required storefront values:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
SHOPIFY_ADMIN_TOKEN=your_shopify_admin_api_token
SHOPIFY_LAUNCH_METAOBJECT_TYPE=launch
SHOPIFY_LAUNCH_LOOKBOOK_IMAGE_IDS=gid://shopify/MediaImage/123,gid://shopify/MediaImage/456
```

Recommended newsletter provider variables:

```bash
KLAVIYO_PRIVATE_API_KEY=your_klaviyo_private_api_key
KLAVIYO_NEWSLETTER_LIST_ID=your_klaviyo_list_id
KLAVIYO_API_REVISION=2025-07-15
```

Recommended contact provider variables:

```bash
RESEND_API_KEY=your_resend_api_key
CONTACT_FORM_FROM_EMAIL=POSTED <contact@yourdomain.com>
CONTACT_FORM_TO_EMAIL=info@postedhi.com
```

Optional variables are only needed for the local artwork / product-draft scripts:

```bash
REPLICATE_API_TOKEN=...
PRINTIFY_API_TOKEN=...
PRINTIFY_SHOP_ID=...
```

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run check
npm run shopify:admin:check
npm run shopify:launch:upsert -- drop-001-posted-up
```

`npm run check` is the baseline pre-ship command for this project.

## Project Structure

- `app/`: routes and page composition
- `components/`: storefront UI
- `lib/shopify.ts`: Storefront API client and cart/product queries
- `lib/blog.ts`: MDX blog loader
- `content/blog/`: editorial MDX content
- `scripts/`: local design and asset-generation helpers

## Current Content Model

- Products and cart data come from Shopify.
- Blog content is local MDX.
- Launch pages now prefer Shopify Storefront metaobjects for launch storytelling and merchandising when a `launch`-type metaobject definition is exposed to storefront reads; otherwise they fall back to local launch data in code.
- Newsletter signups go to Klaviyo when `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_NEWSLETTER_LIST_ID` are configured; otherwise they fall back to Shopify customer marketing consent so signups are not dropped.
- Contact submissions go to Resend when `RESEND_API_KEY`, `CONTACT_FORM_FROM_EMAIL`, and `CONTACT_FORM_TO_EMAIL` are configured; otherwise they fall back to Shopify customer records so inquiries are not dropped.

## Notes

- The old Snipcart validation route has been removed; this storefront uses Shopify cart APIs directly.
- Shopify launch metaobjects require Storefront access to metaobjects plus a definition exposed to storefront. This implementation expects fields like `name`, `full_name`, `collection`, `description`, `date`, `status`, `tag`, `lookbook_title`, `lookbook_subtitle`, `lookbook_description`, `lookbook_images`, `featured_products`, `cta_label`, and `cta_href`.
- `npm run shopify:admin:check` verifies that the configured Admin API token authenticates, matches the expected store, and has the product/file/metaobject access needed for launch seeding.
- `npm run shopify:launch:upsert -- drop-001-posted-up` will upsert the launch entry from the local seed data, resolve featured products by handle, and try to match uploaded Shopify Files images by filename. If filename matching fails, set `SHOPIFY_LAUNCH_LOOKBOOK_IMAGE_IDS` to the `MediaImage` GIDs and rerun.
- Printify scripts remain optional local tooling and are not part of the storefront runtime.
