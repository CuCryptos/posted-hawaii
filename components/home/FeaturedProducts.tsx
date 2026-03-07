import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { FEATURED_PRODUCTS } from '@/lib/constants'

export function FeaturedProducts() {
  return (
    <section className="py-section">
      <Container>
        <h2 className="font-display font-black text-section uppercase tracking-tight text-asphalt mb-12">
          The Essentials.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-brand bg-warm-sand transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-display font-bold text-product text-asphalt">
                  {product.name}
                </h3>
                <p className="font-display font-medium text-asphalt/60 mt-1">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
