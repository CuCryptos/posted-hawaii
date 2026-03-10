import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Lookbook — POSTED HAWAI\u02BBI',
  description: 'Visual stories from POSTED HAWAI\u02BBI.',
}

const LOOKBOOK_ENTRIES = [
  {
    title: 'Drop 001 — Posted Up',
    date: 'March 2026',
    image: '/images/hero/homepage-hero.png',
    href: '/lookbook/drop-001',
  },
  {
    title: 'Honolulu Nights',
    date: 'June 2026',
    image: '/images/lifestyle/kakaako-hoodie.png',
    href: '/lookbook/honolulu-nights',
  },
]

export default function LookbookPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="h-20" />

        {/* Header */}
        <section className="py-24 text-center">
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase text-asphalt tracking-tight">
            LOOKBOOK
          </h1>
        </section>

        {/* Cards */}
        <div className="space-y-8 max-w-5xl mx-auto px-6 pb-24">
          {LOOKBOOK_ENTRIES.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="relative overflow-hidden group cursor-pointer block"
            >
              <div className="relative aspect-[16/9] md:aspect-[2/1] bg-warm-sand overflow-hidden">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 960px"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8">
                  <h2 className="font-display font-black text-2xl md:text-3xl uppercase text-white tracking-tight">
                    {entry.title}
                  </h2>
                  <p className="font-display text-xs uppercase tracking-[0.3em] text-white/60 mt-2">
                    {entry.date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
