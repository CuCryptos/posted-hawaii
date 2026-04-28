import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import {
  getLaunchBySlug,
  getLaunches,
  getLaunchMerchandisingHref,
  getLaunchMerchandisingLabel,
} from '@/lib/launches'
import { getProductsByHandles } from '@/lib/shopify'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const launches = await getLaunches()
  return launches.map((launch) => ({ slug: launch.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const launch = await getLaunchBySlug(slug)
  if (!launch) return { title: 'Lookbook — POSTED HAWAIʻI' }

  return {
    title: `${launch.lookbook.title} — ${launch.lookbook.subtitle} Lookbook — POSTED HAWAIʻI`,
    description: launch.lookbook.description,
  }
}

export default async function LookbookDetailPage({ params }: Props) {
  const { slug } = await params
  const launch = await getLaunchBySlug(slug)
  if (!launch) notFound()

  const featuredProducts = launch.merchandising?.featuredProductHandles?.length
    ? await getProductsByHandles(launch.merchandising.featuredProductHandles)
    : []

  return (
    <>
      <Navbar variant="dark" />
      <main className="bg-cream min-h-screen">
        <div className="h-20" />

        <section className="py-16 text-center">
          <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-asphalt tracking-tight">
            {launch.lookbook.title} &mdash; {launch.lookbook.subtitle}
          </h1>
          <p className="font-body text-sm text-asphalt/50 mt-2 italic">
            {launch.lookbook.description}
          </p>
        </section>

        <div className="space-y-2 md:space-y-4 max-w-7xl mx-auto px-6">
          {launch.lookbook.images.map((img) => (
            <div key={img.src}>
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
              <p className="font-display text-xs uppercase tracking-[0.2em] text-asphalt/40 text-right pr-6 mt-2">
                {img.caption}
              </p>
            </div>
          ))}
        </div>

        {featuredProducts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-asphalt/40 mb-10 text-center">
                FEATURED PIECES
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 text-center">
          <Link
            href={getLaunchMerchandisingHref(launch)}
            className="inline-block border-2 border-asphalt text-asphalt px-10 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-asphalt hover:text-cream transition-colors"
          >
            {getLaunchMerchandisingLabel(launch).toUpperCase()}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
