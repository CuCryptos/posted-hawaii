export const BRAND = {
  name: 'POSTED',
  fullName: 'POSTED HAWAI\u02BBI',
  tagline: 'You know where to find us.',
  established: 2026,
} as const

export const COLLECTIONS = [
  {
    id: 'posted-up',
    name: 'POSTED UP',
    tagline: 'Core everyday.',
    description: 'The tees, the caps, the staples your crew reaches for first.',
    image: '/images/products/sandys-tee-black.png',
    href: '/shop?collection=posted-up',
  },
  {
    id: 'posted-late',
    name: 'POSTED LATE',
    tagline: 'Evening premium.',
    description: 'When the sun drops and the fits level up.',
    image: '/images/lifestyle/kakaako-hoodie.png',
    href: '/shop?collection=posted-late',
  },
  {
    id: 'posted-early',
    name: 'POSTED EARLY',
    tagline: 'Dawn patrol.',
    description: 'Built for the morning session and everything after.',
    image: '/images/products/sandys-tee-teal.png',
    href: '/shop?collection=posted-early',
  },
] as const

export const FEATURED_PRODUCTS = [
  {
    name: "The Sandy's Tee",
    price: 42,
    image: '/images/products/sandys-tee-black.png',
    href: '/shop/the-sandys-tee',
  },
  {
    name: 'The Town Tee',
    price: 42,
    image: '/images/products/town-tee-coral.png',
    href: '/shop/the-town-tee',
  },
  {
    name: 'The OG Cap',
    price: 38,
    image: '/images/products/og-cap-black.png',
    href: '/shop/the-og-cap',
  },
] as const

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'About', href: '/about' },
] as const
