import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { GhostButton } from '@/components/ui/GhostButton'
import { DROPS } from '@/lib/products'
import { DropCountdown } from '@/components/drops/DropCountdown'

export const metadata = {
  title: 'Drops — POSTED HAWAI\u02BBI',
  description: 'Upcoming and past drops from POSTED.',
}

export default function DropsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <PageHero title="Drops" subtitle="Every drop is limited. When it's gone, it's gone." />
        <Container className="py-10 lg:py-12">
          <div className="space-y-16">
            {DROPS.map((drop) => (
              <article key={drop.number} className="lg:grid lg:grid-cols-2 lg:gap-12">
                <div className="relative aspect-[4/3] overflow-hidden bg-warm-sand">
                  <Image
                    src={drop.image}
                    alt={drop.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {!drop.isLive && (
                    <div className="absolute top-4 left-4">
                      <span className="font-display font-bold text-[10px] uppercase tracking-widest bg-coral text-white px-3 py-1.5">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-6 lg:mt-0 flex flex-col justify-center">
                  <p className="font-display font-bold text-[11px] uppercase tracking-widest text-coral">
                    {drop.collection}
                  </p>
                  <h2 className="font-display font-black text-[1.5rem] lg:text-[2rem] uppercase tracking-tight text-asphalt mt-2">
                    {drop.name}
                  </h2>
                  <p className="font-body italic text-asphalt/70 mt-3 max-w-md leading-relaxed">
                    {drop.description}
                  </p>
                  <div className="mt-6">
                    <DropCountdown releaseDate={drop.releaseDate} isLive={drop.isLive} />
                  </div>
                  <div className="mt-6">
                    {drop.isLive ? (
                      <GhostButton href={`/shop?collection=${drop.collection.toLowerCase().replace(' ', '-')}`} variant="dark">
                        Shop Drop
                      </GhostButton>
                    ) : (
                      <GhostButton href="#notify" variant="dark">
                        Notify Me
                      </GhostButton>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
