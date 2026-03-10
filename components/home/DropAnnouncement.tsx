import Link from 'next/link'

export function DropAnnouncement() {
  return (
    <section className="bg-cream py-32 md:py-40">
      <div className="max-w-2xl mx-auto text-center px-6">
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-coral mb-4">
          DROP 001
        </p>
        <h2 className="font-display font-black text-4xl md:text-6xl uppercase text-asphalt tracking-tight">
          POSTED UP
        </h2>
        <p className="font-body text-lg md:text-xl text-asphalt/70 mt-6 leading-relaxed">
          A focused first release of everyday staples — heavyweight tees and
          fitted caps built for life in Honolulu.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-block bg-asphalt text-cream px-10 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-coral transition-colors"
        >
          SHOP THE DROP
        </Link>
      </div>
    </section>
  )
}
