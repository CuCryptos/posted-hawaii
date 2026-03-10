'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify-types'

const FILTERS = [
  { slug: 'all', label: 'All' },
  { slug: 'tees', label: 'Tees' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'shorts', label: 'Shorts' },
  { slug: 'caps', label: 'Headwear' },
] as const

export function HomeShopGrid({ products }: { products: ShopifyProduct[] }) {
  const [filter, setFilter] = useState('all')

  const filtered =
    filter === 'all'
      ? products
      : products.filter(
          (p) =>
            p.productType.toLowerCase() === filter ||
            p.tags.some((t) => t.toLowerCase() === filter)
        )

  const displayed = filtered.slice(0, 8)

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header row */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-display font-black text-2xl uppercase text-asphalt tracking-tight">
            Shop All
          </h2>
          <div className="hidden md:flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.slug}
                onClick={() => setFilter(f.slug)}
                className={`px-4 py-2 font-display text-xs font-bold uppercase tracking-widest transition-colors ${
                  filter === f.slug
                    ? 'bg-asphalt text-cream'
                    : 'bg-transparent text-asphalt/50 hover:text-asphalt'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayed.map((product) => {
            const image = product.images.edges[0]?.node
            const price = parseFloat(product.priceRange.minVariantPrice.amount)

            return (
              <Link
                key={product.handle}
                href={`/shop/${product.handle}`}
                className="group"
              >
                <div className="aspect-[3/4] bg-warm-sand overflow-hidden relative">
                  {image && (
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </div>
                <h3 className="font-display text-sm font-bold uppercase mt-3 text-asphalt">
                  {product.title}
                </h3>
                <p className="font-body text-sm text-asphalt/60 mt-1">
                  ${price.toFixed(0)}
                </p>
              </Link>
            )
          })}
        </div>

        {displayed.length === 0 && (
          <p className="font-body italic text-asphalt/40 text-center mt-16">
            Coming soon.
          </p>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-block border-2 border-asphalt text-asphalt px-10 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-asphalt hover:text-cream transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
