'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { GhostButton } from '@/components/ui/GhostButton'
import { FEATURED_PRODUCTS } from '@/lib/constants'

export function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-16 lg:py-20 bg-cream">
      <Container>
        <h2 className="font-display font-black text-lg uppercase tracking-tight text-asphalt mb-8">
          The Essentials.
        </h2>
      </Container>

      <div className="relative">
        {/* Prev button */}
        <button
          onClick={() => scroll('left')}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-cream/80 backdrop-blur-sm text-asphalt hover:bg-cream transition-colors"
          aria-label="Scroll left"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="rotate-180"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={() => scroll('right')}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-cream/80 backdrop-blur-sm text-asphalt hover:bg-cream transition-colors"
          aria-label="Scroll right"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-6 lg:px-8"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group flex-shrink-0 w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image container */}
              <div className="relative aspect-square overflow-hidden bg-warm-sand">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                {/* Alt image (hover swap) — using same image for now */}
                <Image
                  src={product.image}
                  alt={`${product.name} alternate view`}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Product info */}
              <p className="font-display font-medium text-[11px] uppercase tracking-wider text-asphalt mt-3">
                {product.name}
              </p>
              <p className="font-display text-[11px] text-asphalt/60 mt-0.5">
                ${product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Shop All CTA */}
      <div className="flex justify-center mt-10">
        <GhostButton href="/shop" variant="dark">
          Shop All
        </GhostButton>
      </div>
    </section>
  )
}
