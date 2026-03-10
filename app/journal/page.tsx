import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Journal — POSTED HAWAI\u02BBI',
  description: 'Drops, culture, and behind-the-scenes from POSTED.',
}

const ENTRIES = [
  {
    category: 'DROP',
    title: 'Drop 001 — Posted Up',
    date: 'March 2026',
    image: '/images/hero/homepage-hero.png',
    href: '/journal/drop-001-posted-up',
  },
  {
    category: 'CULTURE',
    title: 'A Day in Kaka\u02BBako',
    date: 'March 2026',
    image: '/images/lifestyle/kakaako-hoodie.png',
    href: '/journal/a-day-in-kakaako',
  },
  {
    category: 'BEHIND THE SCENES',
    title: 'Making the Sandy\u2019s Tee',
    date: 'March 2026',
    image: '/images/products/sandys-tee-black.png',
    href: '/journal/making-the-sandys-tee',
  },
  {
    category: 'STREET',
    title: 'Where We\u2019re Posted This Week',
    date: 'March 2026',
    image: '/images/products/og-cap-black.png',
    href: '/journal/where-were-posted',
  },
]

export default function JournalPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="h-20" />

        {/* Header */}
        <section className="py-24 text-center">
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase text-asphalt tracking-tight">
            Journal
          </h1>
        </section>

        {/* Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6 pb-20">
          {ENTRIES.map((entry) => (
            <Link key={entry.href} href={entry.href} className="group cursor-pointer">
              <div className="aspect-[3/2] bg-warm-sand overflow-hidden relative">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-coral mt-4">
                {entry.category}
              </p>
              <h2 className="font-display font-bold text-lg uppercase text-asphalt tracking-tight mt-1">
                {entry.title}
              </h2>
              <p className="font-display text-xs uppercase tracking-[0.2em] text-asphalt/40 mt-1">
                {entry.date}
              </p>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
