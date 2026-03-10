import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JOURNAL_ENTRIES, getJournalEntry, getAdjacentEntries } from '@/lib/journal'

export function generateStaticParams() {
  return JOURNAL_ENTRIES.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getJournalEntry(slug)

  if (!entry) {
    return {
      title: 'Not Found — POSTED HAWAI\u02BBI',
    }
  }

  return {
    title: `${entry.title} — POSTED HAWAI\u02BBI`,
    description: entry.excerpt,
  }
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getJournalEntry(slug)

  if (!entry) {
    notFound()
  }

  const { prev, next } = getAdjacentEntries(slug)

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        {/* Hero */}
        <section className="relative min-h-[60vh]">
          <Image
            src={entry.image}
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
            {new Date(entry.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div
            className="font-body text-base md:text-lg text-asphalt/80 leading-relaxed mt-8 [&>p]:mb-6 last:[&>p]:mb-0"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </article>

        {/* Prev / Next */}
        <nav className="border-t border-asphalt/10 pt-8 mt-16 max-w-2xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 gap-8">
            <div>
              {prev ? (
                <Link
                  href={`/journal/${prev.slug}`}
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
              {next ? (
                <Link
                  href={`/journal/${next.slug}`}
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
