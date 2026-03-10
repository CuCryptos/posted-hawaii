import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProductsByTag } from '@/lib/shopify'
import { DROPS, getDropBySlug } from '@/lib/drops'

export const revalidate = 60

export function generateStaticParams() {
  return DROPS.map((drop) => ({
    slug: drop.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const drop = getDropBySlug(slug)

  if (!drop) {
    return { title: 'Drop Not Found — POSTED HAWAI\u02BBI' }
  }

  return {
    title: `${drop.fullName} — POSTED HAWAI\u02BBI`,
    description: drop.description,
  }
}

function formatDropNumber(n: number): string {
  return String(n).padStart(3, '0')
}

export default async function DropPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const drop = getDropBySlug(slug)

  if (!drop) {
    notFound()
  }

  const products = await getProductsByTag(drop.tag)

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative min-h-[60vh] bg-asphalt flex items-end">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display font-black text-[8rem] md:text-[14rem] uppercase text-white/5 tracking-tight select-none">
              {formatDropNumber(drop.number)}
            </p>
          </div>
          <div className="relative p-8 md:p-16">
            <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-coral">
              DROP {formatDropNumber(drop.number)}
            </p>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase text-white tracking-tight mt-2">
              {drop.name}
            </h1>
          </div>
        </section>

        {/* Description */}
        <section className="bg-cream py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center px-6">
            <p className="font-body text-lg md:text-xl text-asphalt/70 leading-relaxed">
              {drop.description}
            </p>
          </div>
        </section>

        {/* Product grid */}
        <section className="bg-cream py-16">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-asphalt/40 mb-10 text-center">
            SHOP THE DROP
          </p>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto px-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="font-body text-base text-asphalt/40 text-center">
              Products coming soon.
            </p>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="bg-cream py-16 text-center">
          <Link
            href="/shop"
            className="inline-block border-2 border-asphalt text-asphalt px-10 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-asphalt hover:text-cream transition-colors"
          >
            SHOP ALL PRODUCTS
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
