export type DropStatus = 'upcoming' | 'live' | 'sold_out'

export type Drop = {
  slug: string
  number: number
  name: string
  fullName: string
  collection: string
  description: string
  date: string
  status: DropStatus
  tag: string
}

export const DROPS: Drop[] = [
  {
    slug: 'drop-001-posted-up',
    number: 1,
    name: 'POSTED UP',
    fullName: 'Drop 001 — POSTED UP',
    collection: 'posted_up',
    description:
      'The first drop. Core everyday pieces for the crew. Heavyweight tees, pullover hoodies, and structured snapbacks — all designed in Honolulu.',
    date: '2026-03-15',
    status: 'live',
    tag: 'drop 001',
  },
]

export function getDropBySlug(slug: string): Drop | undefined {
  return DROPS.find((d) => d.slug === slug)
}
