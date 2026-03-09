export type ProductColor = {
  name: string
  hex: string
  image: string
}

export type Product = {
  slug: string
  name: string
  price: number
  category: 'tees' | 'hoodies' | 'caps' | 'accessories'
  collection: 'posted-up' | 'posted-late' | 'posted-early'
  description: string
  details: string[]
  sizes: string[]
  colors: ProductColor[]
  images: string[]
  printifyProductId?: string
}

export const PRODUCTS: Product[] = [
  {
    slug: 'the-posted-tee',
    name: 'The POSTED Tee',
    price: 42,
    category: 'tees',
    collection: 'posted-up',
    description:
      'The one that started it all. Clean POSTED wordmark across the chest — nothing extra, nothing missing. Heavyweight oversized boxy cut in volcanic black. You know where to find us.',
    details: [
      '100% combed ringspun cotton',
      'Heavyweight oversized boxy fit',
      'Ribbed crew neck',
      'DTG printed graphic',
      'Designed in Honolulu',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: [
      { name: 'Black', hex: '#0D0D0D', image: '/images/products/posted-tee-black.png' },
    ],
    images: [
      '/images/products/posted-tee-black.png',
      '/images/products/posted-tee-lifestyle-1.png',
      '/images/products/posted-tee-lifestyle-2.png',
      '/images/products/posted-tee-detail.png',
    ],
    printifyProductId: '69aca587444a3d1c7004b901',
  },
  {
    slug: 'the-sandys-tee',
    name: "The Sandy's Tee",
    price: 42,
    category: 'tees',
    collection: 'posted-up',
    description:
      "Named after Sandy Beach — raw, powerful, no filter. Heavyweight 6oz cotton, oversized fit, ribbed collar that won't stretch out.",
    details: [
      '100% combed ringspun cotton',
      '6.0 oz heavyweight',
      'Oversized relaxed fit',
      'Ribbed crew neck',
      'Screen-printed graphic',
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Black', hex: '#0D0D0D', image: '/images/products/sandys-tee-black.png' },
      { name: 'Teal', hex: '#2B6B7F', image: '/images/products/sandys-tee-teal.png' },
    ],
    images: [
      '/images/products/sandys-tee-flat-lay.png',
      '/images/products/sandys-tee-lifestyle.png',
      '/images/products/sandys-tee-black.png',
      '/images/products/sandys-tee-teal.png',
    ],
    printifyProductId: '69acab19581a48c85001b0cd',
  },
  {
    slug: 'the-town-tee',
    name: 'The Town Tee',
    price: 42,
    category: 'tees',
    collection: 'posted-up',
    description:
      'Rep town. Clean coral hit on premium cotton. The one that starts conversations.',
    details: [
      '100% combed ringspun cotton',
      '6.0 oz heavyweight',
      'Oversized relaxed fit',
      'Ribbed crew neck',
      'Screen-printed graphic',
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Coral', hex: '#C4705A', image: '/images/products/town-tee-coral.png' },
    ],
    images: [
      '/images/products/town-tee-flat-lay.png',
      '/images/products/town-tee-lifestyle.png',
      '/images/products/town-tee-coral.png',
    ],
    printifyProductId: '69acab1c30b8e37cd00c4086',
  },
  {
    slug: 'the-og-cap',
    name: 'The OG Cap',
    price: 38,
    category: 'caps',
    collection: 'posted-up',
    description:
      'The staple snapback. Structured crown, flat brim, embroidered POSTED lockup. One size fits most.',
    details: [
      '80/20 acrylic/wool blend',
      'Structured 6-panel',
      'Flat brim',
      'Snapback closure',
      'Embroidered front logo',
    ],
    sizes: ['OS'],
    colors: [
      { name: 'Black', hex: '#0D0D0D', image: '/images/products/og-cap-black.png' },
    ],
    images: ['/images/products/og-cap-black.png'],
    printifyProductId: '69acab2130b8e37cd00c4087',
  },
  {
    slug: 'the-bonfire-hoodie',
    name: 'The Bonfire Hoodie',
    price: 85,
    category: 'hoodies',
    collection: 'posted-late',
    description:
      "For when the sun drops and the temperature follows. Heavyweight fleece, kangaroo pocket, dropped shoulders. Named after those late-night North Shore bonfires.",
    details: [
      '80/20 cotton/polyester fleece',
      '10.0 oz heavyweight',
      'Dropped shoulder fit',
      'Kangaroo pocket',
      'Embroidered chest logo',
      'Ribbed cuffs and hem',
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Charcoal', hex: '#2C2C2E', image: '/images/products/bonfire-hoodie-flat-lay.png' },
    ],
    images: [
      '/images/products/bonfire-hoodie-flat-lay.png',
      '/images/products/bonfire-hoodie-lifestyle.png',
    ],
    printifyProductId: '69acab1f6e2aebfc7402ad47',
  },
  {
    slug: 'the-ala-moana-tee',
    name: 'The Ala Moana Tee',
    price: 42,
    category: 'tees',
    collection: 'posted-up',
    description:
      'Clean. Classic. The everyday tee that goes with everything. Minimal POSTED mark on the chest, full lockup on the back.',
    details: [
      '100% combed ringspun cotton',
      '6.0 oz heavyweight',
      'Oversized relaxed fit',
      'Ribbed crew neck',
      'Screen-printed graphic',
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Cream', hex: '#F5F1EC', image: '/images/products/ala-moana-tee-flat-lay.png' },
    ],
    images: [
      '/images/products/ala-moana-tee-flat-lay.png',
      '/images/products/ala-moana-tee-lifestyle.png',
    ],
    printifyProductId: '69acab1d6e2aebfc7402ad45',
  },
  {
    slug: 'the-crew-cap',
    name: 'The Crew Cap',
    price: 38,
    category: 'caps',
    collection: 'posted-up',
    description:
      'Unstructured dad cap. Washed cotton, curved brim, embroidered P mark. Low-key posted.',
    details: [
      '100% washed cotton',
      'Unstructured 6-panel',
      'Curved brim',
      'Adjustable strap closure',
      'Embroidered P mark',
    ],
    sizes: ['OS'],
    colors: [
      { name: 'Black', hex: '#0D0D0D', image: '/images/products/og-cap-black.png' },
    ],
    images: ['/images/products/og-cap-black.png'],
    printifyProductId: '69acab23b53815ac0e0ec67e',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return PRODUCTS
  return PRODUCTS.filter((p) => p.category === category)
}

export function getProductsByCollection(collection: string): Product[] {
  return PRODUCTS.filter((p) => p.collection === collection)
}

export const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'tees', label: 'Tees' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'caps', label: 'Caps' },
] as const

export type Drop = {
  number: number
  name: string
  collection: string
  description: string
  releaseDate: string
  image: string
  isLive: boolean
  productSlugs: string[]
}

export const DROPS: Drop[] = [
  {
    number: 1,
    name: 'Drop 001',
    collection: 'POSTED UP',
    description: "The first drop. The tees, the caps, the staples. If you know, you know.",
    releaseDate: '2026-04-01T10:00:00-10:00',
    image: '/images/hero/homepage-hero.png',
    isLive: false,
    productSlugs: ['the-posted-tee', 'the-sandys-tee', 'the-town-tee', 'the-og-cap', 'the-ala-moana-tee', 'the-crew-cap'],
  },
  {
    number: 2,
    name: 'Drop 002',
    collection: 'POSTED LATE',
    description: 'Evening essentials. When the sun dips and the fits level up.',
    releaseDate: '2026-06-01T10:00:00-10:00',
    image: '/images/lifestyle/kakaako-hoodie.png',
    isLive: false,
    productSlugs: ['the-bonfire-hoodie'],
  },
]
