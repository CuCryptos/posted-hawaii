import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-warm-sand">
        <Image
          src={product.images[0] || product.colors[0].image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-display font-bold text-[12px] uppercase tracking-wider text-asphalt">
          {product.name}
        </h3>
        <p className="font-display text-[12px] text-asphalt/60 mt-0.5">
          ${product.price}
        </p>
      </div>
    </Link>
  )
}
