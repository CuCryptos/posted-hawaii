import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { BRAND } from '@/lib/constants'

export function Hero() {
  return (
    <section className="relative h-[80vh] lg:h-[85vh] w-full overflow-hidden">
      <Image
        src="/images/hero/homepage-hero.png"
        alt="POSTED HAWAI'I — streetwear from Honolulu"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display font-black text-hero text-white uppercase text-shadow-hero leading-none">
          {BRAND.name}
        </h1>
        <p className="font-display font-medium text-white/80 text-sm uppercase tracking-[0.3em] mt-2 text-shadow-hero">
          HAWAI&#x02BB;I
        </p>
        <p className="font-body italic text-white/90 text-lg mt-6 text-shadow-hero">
          {BRAND.tagline}
        </p>
        <div className="mt-8">
          <Button href="/shop">Shop Drop 001</Button>
        </div>
      </div>
    </section>
  )
}
