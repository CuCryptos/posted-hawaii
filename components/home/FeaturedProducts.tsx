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
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-asphalt/40 mb-12 text-center">
          FEATURED
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => {
            const primaryImage = product.images.edges[0]?.node
            const hoverImage = product.images.edges[1]?.node
            const price = parseFloat(
              product.priceRange.minVariantPrice.amount
            ).toFixed(2)

            return (
              <Link
                key={product.id}
                href={`/shop/${product.handle}`}
                className="group"
              >
                <div className="aspect-square bg-[#F0F0F0] overflow-hidden relative">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={product.title}
                      fill
                      className={`object-contain p-4 transition-opacity duration-300 ${
                        hoverImage ? 'group-hover:opacity-0' : ''
                      }`}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  {hoverImage && (
                    <Image
                      src={hoverImage.url}
                      alt={`${product.title} alternate view`}
                      fill
                      className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </div>
                <h3 className="font-display text-[13px] font-bold mt-3 text-asphalt">
                  {product.title}
                </h3>
                <p className="font-display text-[13px] text-asphalt/60 mt-1">
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
