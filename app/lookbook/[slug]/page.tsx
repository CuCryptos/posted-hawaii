import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Drop 001 — Posted Up Lookbook — POSTED HAWAI\u02BBI',
  description: 'Shot in Kaka\u02BBako, Honolulu.',
}

const LOOKBOOK_IMAGES = [
  {
    src: '/images/hero/homepage-hero.png',
    caption: 'Kaka\u02BBako, Honolulu',
  },
  {
    src: '/images/lifestyle/kakaako-hoodie.png',
    caption: 'Ala Moana Beach Park',
  },
  {
    src: '/images/products/sandys-tee-black.png',
    caption: 'Chinatown',
  },
]

export default function LookbookDetailPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="h-20" />

        {/* Header */}
        <section className="py-16 text-center">
          <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-asphalt tracking-tight">
            DROP 001 — POSTED UP
          </h1>
          <p className="font-body text-sm text-asphalt/50 mt-2 italic">
            Shot in Kaka&#x02BB;ako, Honolulu
          </p>
        </section>

        {/* Images */}
        <div className="space-y-2 md:space-y-4 max-w-7xl mx-auto px-6">
          {LOOKBOOK_IMAGES.map((img) => (
            <div key={img.src}>
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
              <p className="font-display text-xs uppercase tracking-[0.2em] text-asphalt/40 text-right pr-6 mt-2">
                {img.caption}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="py-16 text-center">
          <Link
            href="/shop"
            className="inline-block border-2 border-asphalt text-asphalt px-10 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-asphalt hover:text-cream transition-colors"
          >
            SHOP THE DROP
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
