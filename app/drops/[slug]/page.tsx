import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProducts } from '@/lib/shopify'

export const revalidate = 60

export const metadata = {
  title: 'Drop 001 — POSTED UP — POSTED HAWAI\u02BBI',
  description: 'A focused first release of everyday staples — heavyweight tees and fitted caps built for life in Honolulu.',
}

export default async function DropPage() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative min-h-[70vh]">
          <Image
            src="/images/hero/homepage-hero.png"
            alt="Drop 001 — POSTED UP"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-16">
            <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-coral">
              DROP 001
            </p>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase text-white tracking-tight mt-2">
              POSTED UP
            </h1>
          </div>
        </section>

        {/* Description */}
        <section className="bg-cream py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center px-6">
            <p className="font-body text-lg md:text-xl text-asphalt/70 leading-relaxed">
              A focused first release of everyday staples — heavyweight tees and fitted caps built for life in Honolulu. Designed for the crew that makes these islands home.
            </p>
          </div>
        </section>

        {/* Product grid */}
        <section className="bg-white py-16">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-asphalt/40 mb-10 text-center">
            SHOP THE DROP
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto px-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
