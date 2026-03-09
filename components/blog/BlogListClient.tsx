'use client'

import { useState } from 'react'
import { BlogFilter } from './BlogFilter'
import { PostCard } from './PostCard'
import type { BlogPost } from '@/lib/blog-types'

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState('all')

  const filtered =
    category === 'all' ? posts : posts.filter((p) => p.category === category)

  return (
    <>
      <BlogFilter active={category} onChange={setCategory} />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-body italic text-asphalt/40 text-center mt-16">
          No posts yet. Stay tuned.
        </p>
      )}
    </>
  )
}
