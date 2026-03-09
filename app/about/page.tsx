import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { EmailSignup } from '@/components/home/EmailSignup'

export const metadata = {
  title: 'About — POSTED HAWAI\u02BBI',
  description: 'Honolulu-based streetwear. Bold with discipline. You know where to find us.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        {/* Hero */}
        <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          <Image
            src="/images/hero/homepage-hero.png"
            alt="POSTED HAWAI\u02BBI"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 lg:px-10 pb-12 max-w-[1440px] mx-auto w-full">
            <h1 className="font-display font-black text-[2.5rem] lg:text-[3.5rem] uppercase leading-none text-white">
              About
            </h1>
          </div>
        </section>

        {/* Story */}
        <Container className="py-16 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="font-display font-black text-[1.5rem] uppercase tracking-tight text-asphalt">
              You know where to find us.
            </h2>
            <div className="mt-8 space-y-6 font-body text-[15px] text-asphalt/80 leading-relaxed">
              <p>
                POSTED started the way most real things do — from the crew. A group of friends who
                grew up on O&apos;ahu, posted up at the same spots, wearing the same brands that never
                quite felt like home.
              </p>
              <p>
                We wanted something that looked like us. That felt like a Saturday morning surf check
                at Sandy&apos;s, like a late-night food run to Chinatown, like pulling up to the beach park
                and seeing your whole crew already there.
              </p>
              <p>
                POSTED is streetwear rooted in Honolulu. We design for the people who live here — not
                the tourists passing through. Every piece is named after the spots we grew up at, the
                moments we remember, the energy we carry.
              </p>
              <p>
                Bold with discipline. That&apos;s the rule. We don&apos;t do loud for the sake of loud. We don&apos;t
                do minimal for the sake of minimal. We make pieces that feel right — that your crew
                reaches for first.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-20 pt-12 border-t border-asphalt/10">
            <h2 className="font-display font-black text-[1.25rem] uppercase tracking-tight text-asphalt">
              What we stand on
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { title: 'Presence', text: 'Be where you are. Not on your phone, not somewhere else. Here.' },
                { title: 'Community', text: 'The crew comes first. We build for the people around us.' },
                { title: 'Authenticity', text: 'No costumes, no performing. Just be you.' },
                { title: 'Craft', text: 'Bold with discipline. Every detail is intentional.' },
                { title: 'Aloha', text: 'The door is open. Everyone is welcome at the table.' },
              ].map((value) => (
                <div key={value.title}>
                  <h3 className="font-display font-bold text-[12px] uppercase tracking-widest text-coral">
                    {value.title}
                  </h3>
                  <p className="font-body text-[14px] text-asphalt/70 mt-2 leading-relaxed">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mt-20 pt-12 border-t border-asphalt/10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-display font-black text-[1.25rem] uppercase tracking-tight text-asphalt">
                  Honolulu, Hawai&#x02BB;i
                </h2>
                <p className="font-body text-[15px] text-asphalt/80 mt-4 leading-relaxed max-w-md">
                  Born and raised on O&apos;ahu. We design here, we test here, we wear it here.
                  If you see us around — come say what&apos;s up.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 relative aspect-[4/3] overflow-hidden bg-warm-sand">
                <Image
                  src="/images/lifestyle/kakaako-hoodie.png"
                  alt="Kaka\u02BBako, Honolulu"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>

        <EmailSignup />
      </main>
      <Footer />
    </>
  )
}
