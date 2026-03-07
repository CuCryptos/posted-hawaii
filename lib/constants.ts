export const BRAND = {
  name: 'POSTED',
  fullName: 'POSTED HAWAI\u02BBI',
  tagline: 'You know where to find us.',
  established: 2026,
} as const

// Collection heroes for the editorial homepage
export const COLLECTIONS = [
  {
    id: 'posted-up',
    name: 'POSTED UP',
    description: 'The tees, the caps, the staples your crew reaches for first.',
    image: '/images/hero/homepage-hero.png',
    shopHref: '/shop?collection=posted-up',
    lookHref: '/blog/posted-up-drop-001',
  },
  {
    id: 'posted-late',
    name: 'POSTED LATE',
    description: 'When the sun drops and the fits level up.',
    image: '/images/lifestyle/kakaako-hoodie.png',
    shopHref: '/shop?collection=posted-late',
    lookHref: '/blog/posted-late-drop-001',
  },
  {
    id: 'posted-early',
    name: 'POSTED EARLY',
    description: 'Built for the morning session and everything after.',
    image: '/images/products/sandys-tee-teal.png',
    shopHref: '/shop?collection=posted-early',
  },
]

// Lookbook grids — shoppable lifestyle images
export type LookbookItem = {
  image: string
  name: string
  price: number
  href: string
}

export const LOOKBOOK_POSTED_UP: LookbookItem[] = [
  { image: '/images/products/sandys-tee-black.png', name: "The Sandy's Tee", price: 42, href: '/shop/the-sandys-tee' },
  { image: '/images/products/town-tee-coral.png', name: 'The Town Tee', price: 42, href: '/shop/the-town-tee' },
  { image: '/images/products/og-cap-black.png', name: 'The OG Cap', price: 38, href: '/shop/the-og-cap' },
  { image: '/images/products/sandys-tee-teal.png', name: "The Sandy's Tee — Teal", price: 42, href: '/shop/the-sandys-tee' },
]

export const LOOKBOOK_POSTED_LATE: LookbookItem[] = [
  { image: '/images/lifestyle/kakaako-hoodie.png', name: 'The Bonfire Hoodie', price: 85, href: '/shop/the-bonfire-hoodie' },
  { image: '/images/products/sandys-tee-black.png', name: "The Sandy's Tee", price: 42, href: '/shop/the-sandys-tee' },
  { image: '/images/products/og-cap-black.png', name: 'The OG Cap', price: 38, href: '/shop/the-og-cap' },
  { image: '/images/products/town-tee-coral.png', name: 'The Town Tee', price: 42, href: '/shop/the-town-tee' },
]

// Product carousel items
export const FEATURED_PRODUCTS = [
  {
    name: "The Sandy's Tee",
    price: 42,
    image: '/images/products/sandys-tee-black.png',
    altImage: '/images/products/sandys-tee-black.png',
    href: '/shop/the-sandys-tee',
  },
  {
    name: 'The Town Tee',
    price: 42,
    image: '/images/products/town-tee-coral.png',
    altImage: '/images/products/town-tee-coral.png',
    href: '/shop/the-town-tee',
  },
  {
    name: 'The OG Cap',
    price: 38,
    image: '/images/products/og-cap-black.png',
    altImage: '/images/products/og-cap-black.png',
    href: '/shop/the-og-cap',
  },
  {
    name: "The Sandy's Tee — Teal",
    price: 42,
    image: '/images/products/sandys-tee-teal.png',
    altImage: '/images/products/sandys-tee-teal.png',
    href: '/shop/the-sandys-tee',
  },
  {
    name: 'The Bonfire Hoodie',
    price: 85,
    image: '/images/lifestyle/kakaako-hoodie.png',
    altImage: '/images/lifestyle/kakaako-hoodie.png',
    href: '/shop/the-bonfire-hoodie',
  },
]

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'About', href: '/about' },
] as const
