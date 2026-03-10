import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'About — POSTED HAWAI\u02BBI',
  description: 'Honolulu-based streetwear. Bold with discipline. You know where to find us.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-end">
          <Image
            src="/images/hero/homepage-hero.png"
            alt="POSTED HAWAI\u02BBI"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative w-full text-center pb-16 px-6">
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase text-white tracking-tight">
              POSTED HAWAI&#x02BB;I
            </h1>
            <p className="font-body text-lg text-white/70 mt-3">
              Founded in Honolulu
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-cream py-20">
          <div className="max-w-2xl mx-auto text-center px-6">
            <div className="font-body text-lg md:text-xl text-asphalt/70 leading-relaxed space-y-6">
              <p>
                POSTED is inspired by everyday island life — the rhythm of the streets, the ocean,
                and the people who make Hawai&#x02BB;i home.
              </p>
              <p>
                We design simple pieces that fit anywhere: from town to the beach, from dawn patrol
                to late nights in Kaka&#x02BB;ako. No costumes, no performing — just clothes for the crew.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="aspect-square relative">
              <Image
                src="/images/lifestyle/kakaako-hoodie.png"
                alt="Kaka&#x02BB;ako, Honolulu"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 md:p-16 flex flex-col justify-center space-y-8">
              {[
                { title: 'PRESENCE', text: 'Be where you are' },
                { title: 'COMMUNITY', text: 'The crew comes first' },
                { title: 'AUTHENTICITY', text: 'No costumes, no performing' },
                { title: 'CRAFT', text: 'Bold with discipline' },
                { title: 'ALOHA', text: 'The door is open' },
              ].map((value) => (
                <div key={value.title}>
                  <h3 className="font-display font-black text-xl uppercase text-asphalt tracking-tight">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm text-asphalt/50 mt-1">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="relative min-h-[50vh] flex items-center justify-center">
          <Image
            src="/images/hero/homepage-hero.png"
            alt="POSTED HAWAI\u02BBI"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <p className="relative font-body text-2xl md:text-3xl text-white italic text-center max-w-xl mx-auto px-6">
            &ldquo;You know where to find us.&rdquo;
          </p>
        </section>

        {/* Contact Block */}
        <section className="bg-asphalt py-16 text-center">
          <p className="font-display font-black text-2xl text-cream">
            POSTED HAWAI&#x02BB;I
          </p>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-cream/40 mt-2">
            EST. 2026 &middot; HONOLULU
          </p>
          <Link
            href="mailto:info@postedhi.com"
            className="font-body text-sm text-coral mt-4 inline-block hover:underline"
          >
            info@postedhi.com
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
