'use client'

import { BLOG_CATEGORIES } from '@/lib/blog-types'

type BlogFilterProps = {
  active: string
  onChange: (category: string) => void
}

export function BlogFilter({ active, onChange }: BlogFilterProps) {
  return (
    <div className="flex gap-6 border-b border-asphalt/10 pb-4">
      {BLOG_CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          className={`font-display font-bold text-[11px] uppercase tracking-widest transition-colors pb-1 ${
            active === cat.slug
              ? 'text-asphalt border-b-2 border-coral'
              : 'text-asphalt/40 hover:text-asphalt'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
