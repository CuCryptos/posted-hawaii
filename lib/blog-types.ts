export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  image: string
  category: 'drops' | 'lookbook' | 'culture' | 'behind-the-scenes'
  author: string
  tags: string[]
  content: string
}

export const BLOG_CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'drops', label: 'Drops' },
  { slug: 'lookbook', label: 'Lookbook' },
  { slug: 'culture', label: 'Culture' },
  { slug: 'behind-the-scenes', label: 'BTS' },
] as const
