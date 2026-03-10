'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify-types'

type FeaturedProductsProps = {
  products: ShopifyProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.slice(0, 4)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-asphalt/40 mb-12 text-center">
          FEATURED
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => {
            const imageUrl = product.images.edges[0]?.node.url
            const price = parseFloat(
              product.priceRange.minVariantPrice.amount
            ).toFixed(0)

            return (
              <Link
                key={product.id}
                href={`/shop/${product.handle}`}
                className="group"
              >
                <div className="aspect-[3/4] bg-warm-sand overflow-hidden relative">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={product.title}
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
                  ${price}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
