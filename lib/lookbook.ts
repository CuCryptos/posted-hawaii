export type LookbookEntry = {
  slug: string
  title: string
  subtitle: string
  date: string
  description: string
  images: { src: string; caption: string }[]
}

export const LOOKBOOKS: LookbookEntry[] = [
  {
    slug: 'drop-001-posted-up',
    title: 'Drop 001',
    subtitle: 'POSTED UP',
    date: '2026-03-15',
    description:
      'The first collection. Heavyweight essentials designed in Honolulu \u2014 shot across the south shore and Kaka\u02BBako.',
    images: [
      { src: '/images/hero/homepage-hero.png', caption: 'Kaka\u02BBako, Honolulu' },
      {
        src: '/images/lifestyle/kakaako-hoodie.png',
        caption: 'The Diamond Head Hoodie',
      },
    ],
  },
]

export function getLookbook(slug: string): LookbookEntry | undefined {
  return LOOKBOOKS.find((l) => l.slug === slug)
}
