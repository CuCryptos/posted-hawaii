import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const ENTRIES: Record<string, {
  category: string
  title: string
  date: string
  heroImage: string
  paragraphs: string[]
  prev: { label: string; href: string } | null
  next: { label: string; href: string } | null
}> = {
  'drop-001-posted-up': {
    category: 'DROP',
    title: 'Drop 001 — Posted Up',
    date: 'March 2026',
    heroImage: '/images/hero/homepage-hero.png',
    paragraphs: [
      'The first POSTED drop is here. Six pieces — three tees, two caps, one hoodie — built around the simplest idea: clothes that belong in Honolulu.',
      'Every piece in Drop 001 is designed to move with you — from morning surf checks to late nights in Kaka\u02BBako. No logos screaming for attention. Just clean graphics, heavyweight cotton, and a local point of view.',
      'POSTED UP is the everyday collection. The staples your crew reaches for first. Built for life on the island.',
    ],
    prev: null,
    next: { label: 'NEXT', href: '/journal/a-day-in-kakaako' },
  },
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 16 async params — but we can use a sync approach for static metadata
  return {
    title: 'Journal — POSTED HAWAI\u02BBI',
    description: 'Drops, culture, and behind-the-scenes from POSTED.',
  }
}

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = ENTRIES[slug]

  if (!entry) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        {/* Hero */}
        <section className="relative min-h-[60vh]">
          <Image
            src={entry.heroImage}
            alt={entry.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </section>

        {/* Article */}
        <article className="max-w-2xl mx-auto px-6 py-16">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-coral mb-2">
            {entry.category}
          </p>
          <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-asphalt tracking-tight">
            {entry.title}
          </h1>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-asphalt/40 mt-3">
            {entry.date}
          </p>
          <div className="font-body text-base md:text-lg text-asphalt/80 leading-relaxed mt-8 space-y-6">
            {entry.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>

        {/* Prev / Next */}
        <nav className="border-t border-asphalt/10 pt-8 mt-16 max-w-2xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 gap-8">
            <div>
              {entry.prev ? (
                <Link
                  href={entry.prev.href}
                  className="font-display text-sm font-bold uppercase text-asphalt hover:text-coral transition-colors"
                >
                  &larr; PREVIOUS
                </Link>
              ) : (
                <span className="font-display text-sm font-bold uppercase text-asphalt/30">
                  &larr; PREVIOUS
                </span>
              )}
            </div>
            <div className="text-right">
              {entry.next ? (
                <Link
                  href={entry.next.href}
                  className="font-display text-sm font-bold uppercase text-asphalt hover:text-coral transition-colors"
                >
                  NEXT &rarr;
                </Link>
              ) : (
                <span className="font-display text-sm font-bold uppercase text-asphalt/30">
                  NEXT &rarr;
                </span>
              )}
            </div>
          </div>
        </nav>
      </main>
      <Footer />
    </>
  )
}
