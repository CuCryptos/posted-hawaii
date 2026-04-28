import { LAUNCHES } from '@/lib/launches'

export type LookbookEntry = {
  slug: string
  title: string
  subtitle: string
  date: string
  description: string
  images: { src: string; caption: string }[]
}

export const LOOKBOOKS: LookbookEntry[] = LAUNCHES.map((launch) => ({
  slug: launch.slug,
  title: launch.lookbook.title,
  subtitle: launch.lookbook.subtitle,
  date: launch.date,
  description: launch.lookbook.description,
  images: launch.lookbook.images,
}))

export function getLookbook(slug: string): LookbookEntry | undefined {
  return LOOKBOOKS.find((entry) => entry.slug === slug)
}
