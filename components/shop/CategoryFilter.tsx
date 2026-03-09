'use client'

import { CATEGORIES } from '@/lib/products'

type CategoryFilterProps = {
  active: string
  onChange: (category: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-6 border-b border-asphalt/10 pb-4">
      {CATEGORIES.map((cat) => (
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
