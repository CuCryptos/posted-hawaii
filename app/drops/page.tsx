import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DROPS } from '@/lib/drops'

export const metadata = {
  title: 'Drops — POSTED HAWAI\u02BBI',
  description: 'The POSTED timeline. Every drop, every release.',
}

function formatDropNumber(n: number): string {
  return String(n).padStart(3, '0')
}

function formatDropDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function DropsPage() {
  return (
    <>
      <Navbar variant="dark" />
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

          {DROPS.map((drop, index) => {
            const isReversed = index % 2 !== 0
            const isLive = drop.status === 'live'

            return (
              <div
                key={drop.slug}
                className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-16 md:mb-0"
              >
                {/* Image placeholder — uses brand color background */}
                <div
                  className={`relative aspect-[4/3] bg-warm-sand overflow-hidden ${
                    isReversed ? 'md:order-2' : ''
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-display font-black text-4xl md:text-5xl uppercase text-asphalt/10 tracking-tight">
                      {drop.name}
                    </p>
                  </div>
                </div>

                {/* Text */}
                <div
                  className={`p-8 md:p-12 flex flex-col justify-center ${
                    isReversed ? 'md:order-1' : ''
                  }`}
                >
                  <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-coral mb-2">
                    DROP {formatDropNumber(drop.number)}
                  </p>
                  <h2 className="font-display font-black text-2xl md:text-3xl uppercase text-asphalt tracking-tight">
                    {drop.name}
                  </h2>
                  <p className="font-body text-base text-asphalt/60 mt-4 leading-relaxed">
                    {drop.description}
                  </p>
                  <p className="font-display text-xs text-asphalt/40 mt-6">
                    {formatDropDate(drop.date)}
                  </p>
                  {isLive ? (
                    <Link
                      href={`/drops/${drop.slug}`}
                      className="font-display text-sm font-bold uppercase tracking-widest text-asphalt hover:text-coral transition-colors mt-6 inline-block"
                    >
                      VIEW DROP &rarr;
                    </Link>
                  ) : (
                    <span className="font-display text-sm font-bold uppercase tracking-widest text-asphalt/40 cursor-default mt-6 inline-block">
                      COMING SOON
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
