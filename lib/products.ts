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
