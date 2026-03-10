'use client'

import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image — Replace with hero image */}
      <Image
        src="/images/hero/homepage-hero.png"
        alt="POSTED HAWAI'I lifestyle"
        fill
        className="object-cover"
        priority
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Text content — bottom-left aligned */}
      <div className="absolute inset-0 flex items-end">
        <div className="px-6 md:px-12 lg:px-16 pb-24 md:pb-28">
          <h1 className="animate-fade-up font-display font-black text-5xl md:text-7xl lg:text-8xl uppercase text-white tracking-tight leading-[0.9]">
            POSTED
          </h1>
          <p className="animate-fade-up-delay-1 font-body text-lg md:text-xl text-white/80 mt-4 max-w-md">
            Modern Hawai&#x02BB;i streetwear rooted in Honolulu.
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex gap-4">
            <Link
              href="/shop"
              className="bg-coral text-cream px-8 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-coral/90 transition-colors"
            >
              SHOP DROP 001
            </Link>
            <Link
              href="/lookbook"
              className="border-2 border-white text-white px-8 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-asphalt transition-colors"
            >
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/60"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  )
}
