import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost } from './blog-types'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export type { BlogPost }

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    return getPostBySlug(slug)!
  }).filter(Boolean)

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    image: data.image,
    category: data.category,
    author: data.author || 'POSTED',
    tags: data.tags || [],
    content,
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category)
}
