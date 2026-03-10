import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LOOKBOOKS, getLookbook } from '@/lib/lookbook'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return LOOKBOOKS.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = getLookbook(slug)
  if (!entry) return { title: 'Lookbook \u2014 POSTED HAWAI\u02BBI' }

  return {
    title: `${entry.title} \u2014 ${entry.subtitle} Lookbook \u2014 POSTED HAWAI\u02BBI`,
    description: entry.description,
  }
}

export default async function LookbookDetailPage({ params }: Props) {
  const { slug } = await params
  const entry = getLookbook(slug)
  if (!entry) notFound()

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="h-20" />

        {/* Header */}
        <section className="py-16 text-center">
          <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-asphalt tracking-tight">
            {entry.title} &mdash; {entry.subtitle}
          </h1>
          <p className="font-body text-sm text-asphalt/50 mt-2 italic">
            {entry.description}
          </p>
        </section>

        {/* Images — vertical scroll editorial layout */}
        <div className="space-y-2 md:space-y-4 max-w-7xl mx-auto px-6">
          {entry.images.map((img) => (
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

        {/* CTA */}
        <section className="py-16 text-center">
          <Link
            href="/shop"
            className="inline-block border-2 border-asphalt text-asphalt px-10 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-asphalt hover:text-cream transition-colors"
          >
            SHOP THE DROP
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
