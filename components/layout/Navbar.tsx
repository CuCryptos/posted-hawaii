'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'

const NAV_LEFT = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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
            width={120}
            height={32}
            className={`h-6 w-auto transition-all duration-300 ${scrolled ? 'invert' : ''}`}
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
            href="/account"
            aria-label="Account"
            className={`p-2 -m-2 transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <button
            aria-label="Cart"
            className={`p-2 -m-2 relative transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-coral text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>

        <MobileMenu scrolled={scrolled} />
      </div>
    </header>
  )
}
