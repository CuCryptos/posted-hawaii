import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export function BrandStory() {
  return (
    <section className="py-section bg-warm-sand">
      <Container>
        <div className="lg:grid lg:grid-cols-5 lg:gap-16 items-center">
          <div className="lg:col-span-3">
            <h2 className="font-display font-black text-section uppercase tracking-tight text-asphalt">
              Bold with discipline.
            </h2>
            <div className="mt-6 space-y-4 font-body text-asphalt/80 text-lg leading-relaxed max-w-xl">
              <p>
                POSTED started the way most real things do — from the crew. A group of friends
                in Honolulu who got tired of choosing between tourist merch and mainland brands
                that didn&apos;t get it.
              </p>
              <p>
                We wanted something that felt like home. Something you could wear from a morning
                session at Sandy&apos;s to a night out in Chinatown without switching up. Bold enough
                to stand out, disciplined enough to last.
              </p>
              <p>
                Every piece is rooted in O&apos;ahu — named after the spots we grew up at, designed
                for the people who never left. This isn&apos;t for everyone. It&apos;s for the crew.
              </p>
            </div>
            <div className="mt-8">
              <Button href="/about" variant="outline">Our Story</Button>
            </div>
          </div>

          <div className="lg:col-span-2 mt-12 lg:mt-0">
            <div className="relative aspect-[4/5] rounded-brand overflow-hidden">
              <Image
                src="/images/lifestyle/kakaako-hoodie.png"
                alt="POSTED lifestyle — Kaka'ako, Honolulu"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
