import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Drops — POSTED HAWAI\u02BBI',
  description: 'The POSTED timeline. Every drop, every release.',
}

export default function DropsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="h-20" />

        {/* Header */}
        <section className="py-24 md:py-32 text-center">
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase text-asphalt tracking-tight">
            DROPS
          </h1>
          <p className="font-body text-lg text-asphalt/50 mt-4">
            The POSTED timeline.
          </p>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          {/* Year label */}
          <p className="font-display font-black text-6xl md:text-8xl text-asphalt/10 mb-8">
            2026
          </p>

          {/* Drop 1 — Image left, text right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-16 md:mb-0">
            <div className="relative aspect-[4/3] bg-warm-sand overflow-hidden">
              <Image
                src="/images/hero/homepage-hero.png"
                alt="Drop 001 — POSTED UP"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-coral mb-2">
                DROP 001
              </p>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase text-asphalt tracking-tight">
                POSTED UP
              </h2>
              <p className="font-body text-base text-asphalt/60 mt-4 leading-relaxed">
                A focused first release of everyday staples — heavyweight tees and fitted caps built for life in Honolulu.
              </p>
              <p className="font-display text-xs text-asphalt/40 mt-6">
                6 pieces &middot; March 2026
              </p>
              <Link
                href="/drops/posted-up"
                className="font-display text-sm font-bold uppercase tracking-widest text-asphalt hover:text-coral transition-colors mt-6 inline-block"
              >
                VIEW DROP &rarr;
              </Link>
            </div>
          </div>

          {/* Drop 2 — Text left, image right (reversed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-16 md:mb-0">
            <div className="relative aspect-[4/3] bg-warm-sand overflow-hidden md:order-2">
              <Image
                src="/images/lifestyle/kakaako-hoodie.png"
                alt="Drop 002 — POSTED LATE"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center md:order-1">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-coral mb-2">
                DROP 002
              </p>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase text-asphalt tracking-tight">
                POSTED LATE
              </h2>
              <p className="font-body text-base text-asphalt/60 mt-4 leading-relaxed">
                Evening essentials for Honolulu nights — hoodies, crews, and premium pieces for when the sun drops.
              </p>
              <p className="font-display text-xs text-asphalt/40 mt-6">
                4 pieces &middot; June 2026
              </p>
              <span className="font-display text-sm font-bold uppercase tracking-widest text-asphalt/40 cursor-default mt-6 inline-block">
                COMING SOON
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
