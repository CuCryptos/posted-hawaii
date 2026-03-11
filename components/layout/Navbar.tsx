'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MobileMenu } from './MobileMenu'
import { useCart } from '@/components/cart/CartProvider'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
]

export function Navbar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [scrolled, setScrolled] = useState(false)
  const { cart } = useCart()

  const itemCount = cart?.totalQuantity ?? 0

  // 'light' = white text (for dark backgrounds), 'dark' = asphalt text (for light backgrounds)
  const useDarkText = variant === 'dark' || scrolled

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
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Left: Logo */}
        <Link
          href="/"
          className={`font-display font-black text-2xl tracking-tight transition-colors ${
            useDarkText ? 'text-asphalt' : 'text-white'
          }`}
        >
          POSTED
        </Link>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                useDarkText ? 'text-asphalt hover:text-coral' : 'text-white hover:text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Cart + Mobile menu */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label="Cart"
            className={`p-2 -m-2 relative transition-colors ${
              useDarkText ? 'text-asphalt' : 'text-white'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <MobileMenu darkText={useDarkText} />
        </div>
      </div>
    </header>
  )
}
