'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COLLECTIONS } from '@/lib/constants'
import { Container } from '@/components/ui/Container'

export function CollectionShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    panelRefs.current.forEach((panel, index) => {
      if (!panel) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index)
          }
        },
        { threshold: 0.5 }
      )

      observer.observe(panel)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="bg-cream">
      <Container className="pt-section pb-8">
        <h2 className="font-display font-black text-hero uppercase tracking-tight text-asphalt">
          The Collections.
        </h2>
      </Container>

      <div className="relative">
        <Container>
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Left: scrolling text panels */}
            <div>
              {COLLECTIONS.map((collection, index) => (
                <div
                  key={collection.id}
                  ref={(el) => { panelRefs.current[index] = el }}
                  className="flex flex-col justify-center min-h-screen py-20 lg:py-0"
                >
                  {/* Mobile: show image inline above text */}
                  <div className="lg:hidden relative aspect-square w-full mb-8 rounded-brand overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>

                  <p className="font-display font-bold text-coral uppercase tracking-wider text-lg">
                    {collection.name}
                  </p>
                  <p className="font-display font-black text-section text-asphalt mt-2">
                    {collection.tagline}
                  </p>
                  <p className="font-body text-asphalt/80 text-lg mt-4 max-w-md leading-relaxed">
                    {collection.description}
                  </p>
                  <Link
                    href={collection.href}
                    className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider text-coral hover:text-coral/80 transition-colors mt-8"
                  >
                    Shop {collection.name}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Right: sticky pinned image (desktop only) */}
            <div className="hidden lg:block">
              <div className="sticky top-0 h-screen flex items-center">
                <div className="relative aspect-square w-full rounded-brand overflow-hidden">
                  {COLLECTIONS.map((collection, index) => (
                    <Image
                      key={collection.id}
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className={`showcase-image object-cover ${index === activeIndex ? 'active' : ''}`}
                      sizes="50vw"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
