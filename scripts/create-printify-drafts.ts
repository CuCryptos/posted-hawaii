/**
 * Create POSTED HAWAI'I products in Printify as DRAFTS.
 *
 * - Sets titles, descriptions, tags, and pricing
 * - Does NOT upload artwork (user approves manually)
 * - Does NOT publish (user publishes manually)
 * - Outputs Printify product IDs for manual record-keeping if needed
 *
 * Usage:
 *   npx tsx scripts/create-printify-drafts.ts
 *
 * Requires .env.local with:
 *   PRINTIFY_API_TOKEN
 *   PRINTIFY_SHOP_ID
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

const API_TOKEN = process.env.PRINTIFY_API_TOKEN!
const SHOP_ID = process.env.PRINTIFY_SHOP_ID!
const BASE = 'https://api.printify.com/v1'

if (!API_TOKEN || !SHOP_ID) {
  console.error('Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID in .env.local')
  process.exit(1)
}

async function printifyRequest(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Printify API error ${res.status}: ${text}`)
  }
  return res.json()
}

// Price in cents for Printify API
function dollars(amount: number): number {
  return amount * 100
}

// ---------------------------------------------------------------------------
// Product definitions
// ---------------------------------------------------------------------------

type VariantConfig = {
  id: number
  price: number // in cents
  is_enabled: boolean
}

type ProductDraft = {
  slug: string // our local slug for reference
  title: string
  description: string
  tags: string[]
  blueprint_id: number
  print_provider_id: number
  variants: VariantConfig[]
}

const PRODUCTS: ProductDraft[] = [
  // -----------------------------------------------------------------------
  // The Sandy's Tee — Black + Ecru
  // Blueprint 1349 (Men's Heavy Oversized Tee) + Printify Choice (99)
  // -----------------------------------------------------------------------
  {
    slug: 'the-sandys-tee',
    title: "The Sandy's Tee — POSTED HAWAI\u02BBI",
    description:
      "Named after Sandy Beach — raw, powerful, no filter. Heavyweight 6oz cotton, oversized fit, ribbed collar that won't stretch out. Bold POSTED graphic across the chest.\n\n- 100% combed ringspun cotton\n- 6.0 oz heavyweight\n- Oversized relaxed fit\n- Ribbed crew neck\n- Screen-printed graphic",
    tags: [
      'posted hawaii',
      'streetwear',
      'hawaii streetwear',
      'oversized tee',
      'heavyweight tee',
      'honolulu',
      'sandy beach',
      'posted up',
    ],
    blueprint_id: 1349,
    print_provider_id: 99,
    variants: [
      // Black S-2XL
      { id: 102262, price: dollars(42), is_enabled: true },
      { id: 102263, price: dollars(42), is_enabled: true },
      { id: 102264, price: dollars(42), is_enabled: true },
      { id: 102265, price: dollars(42), is_enabled: true },
      { id: 102266, price: dollars(42), is_enabled: true },
      // Ecru S-2XL (closest to cream/bone)
      { id: 102268, price: dollars(42), is_enabled: true },
      { id: 102269, price: dollars(42), is_enabled: true },
      { id: 102270, price: dollars(42), is_enabled: true },
      { id: 102271, price: dollars(42), is_enabled: true },
      { id: 102272, price: dollars(42), is_enabled: true },
    ],
  },

  // -----------------------------------------------------------------------
  // The Town Tee — Black (coral graphic, not coral blank)
  // Blueprint 1349 + Printify Choice (99)
  // -----------------------------------------------------------------------
  {
    slug: 'the-town-tee',
    title: 'The Town Tee — POSTED HAWAI\u02BBI',
    description:
      'Rep town. Clean coral hit on premium cotton. The one that starts conversations.\n\n- 100% combed ringspun cotton\n- 6.0 oz heavyweight\n- Oversized relaxed fit\n- Ribbed crew neck\n- Screen-printed graphic',
    tags: [
      'posted hawaii',
      'streetwear',
      'hawaii streetwear',
      'oversized tee',
      'heavyweight tee',
      'honolulu',
      'town',
      'posted up',
    ],
    blueprint_id: 1349,
    print_provider_id: 99,
    variants: [
      // Black S-2XL
      { id: 102262, price: dollars(42), is_enabled: true },
      { id: 102263, price: dollars(42), is_enabled: true },
      { id: 102264, price: dollars(42), is_enabled: true },
      { id: 102265, price: dollars(42), is_enabled: true },
      { id: 102266, price: dollars(42), is_enabled: true },
    ],
  },

  // -----------------------------------------------------------------------
  // The Ala Moana Tee — Ecru (cream) + White
  // Blueprint 1349 + Printify Choice (99)
  // -----------------------------------------------------------------------
  {
    slug: 'the-ala-moana-tee',
    title: 'The Ala Moana Tee — POSTED HAWAI\u02BBI',
    description:
      'Clean. Classic. The everyday tee that goes with everything. Minimal POSTED mark on the chest, full lockup on the back.\n\n- 100% combed ringspun cotton\n- 6.0 oz heavyweight\n- Oversized relaxed fit\n- Ribbed crew neck\n- Screen-printed graphic',
    tags: [
      'posted hawaii',
      'streetwear',
      'hawaii streetwear',
      'oversized tee',
      'heavyweight tee',
      'honolulu',
      'ala moana',
      'posted up',
      'minimal',
    ],
    blueprint_id: 1349,
    print_provider_id: 99,
    variants: [
      // Ecru S-2XL
      { id: 102268, price: dollars(42), is_enabled: true },
      { id: 102269, price: dollars(42), is_enabled: true },
      { id: 102270, price: dollars(42), is_enabled: true },
      { id: 102271, price: dollars(42), is_enabled: true },
      { id: 102272, price: dollars(42), is_enabled: true },
      // White S-2XL
      { id: 102274, price: dollars(42), is_enabled: true },
      { id: 102275, price: dollars(42), is_enabled: true },
      { id: 102276, price: dollars(42), is_enabled: true },
      { id: 102277, price: dollars(42), is_enabled: true },
      { id: 102278, price: dollars(42), is_enabled: true },
    ],
  },

  // -----------------------------------------------------------------------
  // The Bonfire Hoodie — Charcoal + Black
  // Blueprint 77 (Unisex Heavy Blend Hooded Sweatshirt) + Printify Choice (99)
  // -----------------------------------------------------------------------
  {
    slug: 'the-bonfire-hoodie',
    title: 'The Bonfire Hoodie — POSTED HAWAI\u02BBI',
    description:
      "For when the sun drops and the temperature follows. Heavyweight fleece, kangaroo pocket, dropped shoulders. Named after those late-night North Shore bonfires.\n\n- 80/20 cotton/polyester fleece\n- Heavyweight\n- Kangaroo pocket\n- Embroidered chest logo\n- Ribbed cuffs and hem",
    tags: [
      'posted hawaii',
      'streetwear',
      'hawaii streetwear',
      'hoodie',
      'heavyweight hoodie',
      'honolulu',
      'north shore',
      'posted late',
      'bonfire',
    ],
    blueprint_id: 77,
    print_provider_id: 99,
    variants: [
      // Charcoal S-2XL
      { id: 42211, price: dollars(85), is_enabled: true },
      { id: 42212, price: dollars(85), is_enabled: true },
      { id: 42213, price: dollars(85), is_enabled: true },
      { id: 42214, price: dollars(85), is_enabled: true },
      { id: 42215, price: dollars(85), is_enabled: true },
      // Black S-2XL
      { id: 32918, price: dollars(85), is_enabled: true },
      { id: 32919, price: dollars(85), is_enabled: true },
      { id: 32920, price: dollars(85), is_enabled: true },
      { id: 32921, price: dollars(85), is_enabled: true },
      { id: 32922, price: dollars(85), is_enabled: true },
    ],
  },

  // -----------------------------------------------------------------------
  // The OG Cap — Black snapback
  // Blueprint 1446 (Snapback Trucker Cap) + Printify Choice (99)
  // -----------------------------------------------------------------------
  {
    slug: 'the-og-cap',
    title: 'The OG Cap — POSTED HAWAI\u02BBI',
    description:
      'The staple snapback. Structured crown, flat brim, embroidered POSTED lockup. One size fits most.\n\n- Structured 6-panel\n- Flat brim\n- Snapback closure\n- Embroidered front logo',
    tags: [
      'posted hawaii',
      'streetwear',
      'hawaii streetwear',
      'snapback',
      'cap',
      'hat',
      'honolulu',
      'posted up',
    ],
    blueprint_id: 1446,
    print_provider_id: 99,
    variants: [
      { id: 105362, price: dollars(38), is_enabled: true }, // Black
      { id: 105364, price: dollars(38), is_enabled: true }, // Black / White
    ],
  },

  // -----------------------------------------------------------------------
  // The Crew Cap — Black dad cap
  // Blueprint 1447 (Classic Dad Cap) + Printify Choice (99)
  // -----------------------------------------------------------------------
  {
    slug: 'the-crew-cap',
    title: 'The Crew Cap — POSTED HAWAI\u02BBI',
    description:
      'Unstructured dad cap. Washed cotton, curved brim, embroidered P mark. Low-key posted.\n\n- Unstructured 6-panel\n- Curved brim\n- Adjustable strap closure\n- Embroidered P mark',
    tags: [
      'posted hawaii',
      'streetwear',
      'hawaii streetwear',
      'dad cap',
      'dad hat',
      'cap',
      'honolulu',
      'posted up',
    ],
    blueprint_id: 1447,
    print_provider_id: 99,
    variants: [
      { id: 105372, price: dollars(38), is_enabled: true }, // Black
      { id: 105373, price: dollars(38), is_enabled: true }, // Dark Grey
      { id: 105380, price: dollars(38), is_enabled: true }, // Stone
    ],
  },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// Placeholder image uploaded to Printify (inner label - will be replaced with real artwork)
const PLACEHOLDER_IMAGE_ID = '69acab06c150deae7d521a0f'

async function createProduct(draft: ProductDraft) {
  const body = {
    title: draft.title,
    description: draft.description,
    tags: draft.tags,
    blueprint_id: draft.blueprint_id,
    print_provider_id: draft.print_provider_id,
    variants: draft.variants,
    print_areas: [
      {
        variant_ids: draft.variants.map((v) => v.id),
        placeholders: [
          {
            position: 'front',
            images: [
              {
                id: PLACEHOLDER_IMAGE_ID,
                x: 0.5,
                y: 0.5,
                scale: 1,
                angle: 0,
              },
            ],
          },
        ],
      },
    ],
  }

  const result = await printifyRequest(`/shops/${SHOP_ID}/products.json`, body)
  return result
}

async function main() {
  console.log('Creating POSTED HAWAI\u02BBI products as drafts in Printify...\n')
  console.log(`Shop ID: ${SHOP_ID}`)
  console.log(`Products to create: ${PRODUCTS.length}\n`)

  const results: { slug: string; printifyId: string; title: string }[] = []

  for (const product of PRODUCTS) {
    try {
      console.log(`Creating: ${product.title}...`)
      const result = await createProduct(product)
      console.log(`  -> Created! Printify ID: ${result.id}`)
      results.push({
        slug: product.slug,
        printifyId: result.id,
        title: product.title,
      })
    } catch (err) {
      console.error(`  -> FAILED: ${err}`)
    }
  }

  console.log('\n========================================')
  console.log('RESULTS — Record these Printify IDs if needed:')
  console.log('========================================\n')

  for (const r of results) {
    console.log(`  "${r.slug}": printifyProductId: "${r.printifyId}",`)
  }

  console.log('\nAll products created as DRAFTS (not published).')
  console.log('Next steps:')
  console.log('  1. Go to Printify dashboard')
  console.log('  2. Upload approved artwork to each product')
  console.log('  3. Publish when ready')
}

main().catch(console.error)
