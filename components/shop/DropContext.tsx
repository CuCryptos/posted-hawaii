import Link from 'next/link'

export function DropContext() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="max-w-2xl mx-auto text-center px-6">
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-coral mb-2">
          DROP 001
        </p>
        <h2 className="font-display font-black text-xl md:text-2xl uppercase text-asphalt tracking-tight">
          Posted Up
        </h2>
        <p className="font-body text-base text-asphalt/60 mt-4 leading-relaxed">
          Part of the first POSTED release — a focused collection of everyday
          staples built around logo tees, fitted caps, and island essentials.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block border-2 border-asphalt text-asphalt px-8 py-3 font-display font-bold text-xs uppercase tracking-widest hover:bg-asphalt hover:text-cream transition-colors"
        >
          Shop the Collection
        </Link>
      </div>
    </section>
  )
}
