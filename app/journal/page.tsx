import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JOURNAL_ENTRIES } from '@/lib/journal'

export const metadata = {
  title: 'Journal — POSTED HAWAI\u02BBI',
  description: 'Drops, culture, and behind-the-scenes from POSTED.',
}

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
          {JOURNAL_ENTRIES.map((entry) => (
            <Link key={entry.slug} href={`/journal/${entry.slug}`} className="group cursor-pointer">
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
                {new Date(entry.date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
