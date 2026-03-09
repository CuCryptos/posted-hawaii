'use client'

import { useState } from 'react'
import type { ShopifyProduct } from '@/lib/shopify-types'
import { ProductCard } from './ProductCard'

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'tees', label: 'Tees' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'caps', label: 'Caps' },
] as const

export function ShopGrid({ products }: { products: ShopifyProduct[] }) {
  const [category, setCategory] = useState('all')

  const filtered =
    category === 'all'
      ? products
      : products.filter((p) =>
          p.productType.toLowerCase() === category ||
          p.tags.some((t) => t.toLowerCase() === category)
        )

  return (
    <>
      <div className="flex gap-6 border-b border-asphalt/10 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setCategory(cat.slug)}
            className={`font-display font-bold text-[11px] uppercase tracking-widest transition-colors pb-1 ${
              category === cat.slug
                ? 'text-asphalt border-b-2 border-coral'
                : 'text-asphalt/40 hover:text-asphalt'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-body italic text-asphalt/40 text-center mt-16">
          Coming soon.
        </p>
      )}
    </>
  )
}
