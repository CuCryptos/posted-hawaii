import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify-types'

const COLOR_HEX: Record<string, string> = {
  Black: '#0D0D0D',
  Sand: '#E8DDD3',
  Navy: '#1A4A5A',
  Coral: '#C4705A',
  Bone: '#F0EBE3',
  White: '#FFFFFF',
  Red: '#8B2500',
  Green: '#4A6741',
}

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const primaryImage = product.images.edges[0]?.node
  const hoverImage = product.images.edges[1]?.node
  const price = product.priceRange.minVariantPrice.amount

  // Extract unique colors from variants
  const colors: string[] = []
  for (const edge of product.variants.edges) {
    const colorOpt = edge.node.selectedOptions.find((o) => o.name === 'Color')
    if (colorOpt && !colors.includes(colorOpt.value)) {
      colors.push(colorOpt.value)
    }
  }

  return (
    <Link href={`/shop/${product.handle}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-[#F0F0F0]">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
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
            alt={hoverImage.altText || `${product.title} alternate view`}
            fill
            className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display font-bold text-[13px] text-asphalt leading-tight">
          {product.title}
        </h3>
        <p className="font-display text-[13px] text-asphalt/60 mt-1">
          ${parseFloat(price).toFixed(2)}
        </p>
        {colors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-4 h-4 rounded-full border border-asphalt/10"
                style={{ backgroundColor: COLOR_HEX[color] || '#CCCCCC' }}
                title={color}
              />
            ))}
            {colors.length > 4 && (
              <span className="font-display text-[11px] text-asphalt/40 ml-0.5">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
