import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify-types'

export function RelatedProducts({ products }: { products: ShopifyProduct[] }) {
  const items = products.slice(0, 4)
  if (items.length === 0) return null

  return (
    <section className="bg-cream py-16 md:py-20">
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
  const primaryImage = product.images.edges[0]?.node
  const hoverImage = product.images.edges[1]?.node
  const price = product.priceRange.minVariantPrice.amount

  return (
    <Link href={`/shop/${product.handle}`} className="group block">
      <div className="relative aspect-square bg-[#F0F0F0] overflow-hidden">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
            fill
            className={`object-contain p-4 transition-opacity duration-300 ${
              hoverImage ? 'group-hover:opacity-0' : ''
            }`}
            sizes="(max-width: 768px) 70vw, 25vw"
          />
        )}
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt={hoverImage.altText || `${product.title} alternate view`}
            fill
            className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 70vw, 25vw"
          />
        )}
      </div>
      <h3 className="font-display text-[13px] font-bold mt-3 text-asphalt">
        {product.title}
      </h3>
      <p className="font-display text-[13px] text-asphalt/60 mt-1">
        ${parseFloat(price).toFixed(2)}
      </p>
    </Link>
  )
}
