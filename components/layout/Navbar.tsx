'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'
import { useCart } from '@/components/cart/CartProvider'

const NAV_LEFT = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { cart } = useCart()

  const itemCount = cart?.totalQuantity ?? 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 flex items-center justify-between h-16">
        {/* Left: nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-8 flex-1">
          {NAV_LEFT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display font-medium text-[11px] uppercase tracking-widest transition-colors ${
                scrolled ? 'text-asphalt hover:text-coral' : 'text-white hover:text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/brand/posted-wordmark.svg"
            alt="POSTED"
            width={160}
            height={40}
            className={`h-9 md:h-10 w-auto transition-all duration-300 ${scrolled ? 'invert drop-shadow-none' : 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'}`}
            priority
          />
        </Link>

        {/* Right: icons (desktop) + mobile menu */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
          <button
            aria-label="Search"
            className={`p-2 -m-2 transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className={`p-2 -m-2 relative transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <MobileMenu scrolled={scrolled} />
      </div>
    </header>
  )
}
