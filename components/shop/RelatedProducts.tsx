import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify-types'

export function RelatedProducts({ products }: { products: ShopifyProduct[] }) {
  const items = products.slice(0, 4)
  if (items.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-asphalt/40 mb-10 text-center">
          You May Also Like
        </h2>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {items.map((product) => (
            <RelatedCard key={product.handle} product={product} />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar">
          {items.map((product) => (
            <div key={product.handle} className="min-w-[70vw] snap-center">
              <RelatedCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ product }: { product: ShopifyProduct }) {
  const image = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice.amount

  return (
    <Link href={`/shop/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] bg-warm-sand overflow-hidden">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 70vw, 25vw"
          />
        )}
      </div>
      <h3 className="font-display text-sm font-bold uppercase mt-3 text-asphalt">
        {product.title}
      </h3>
      <p className="font-body text-sm text-asphalt/60 mt-1">
        ${parseFloat(price).toFixed(0)}
      </p>
    </Link>
  )
}
