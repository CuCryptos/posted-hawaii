import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify-types'

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const image = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice.amount

  return (
    <Link href={`/shop/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-warm-sand">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display font-bold text-[12px] uppercase tracking-wider text-asphalt">
          {product.title}
        </h3>
        <p className="font-display text-[12px] text-asphalt/60 mt-0.5">
          ${parseFloat(price).toFixed(0)}
        </p>
      </div>
    </Link>
  )
}
