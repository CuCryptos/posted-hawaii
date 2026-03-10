'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const PRIMARY_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
  { label: 'Size Guide', href: '/size-guide' },
]

const SECONDARY_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/postedhawaii' },
  { label: 'TikTok', href: 'https://tiktok.com/@postedhawaii' },
  { label: 'Contact', href: '/contact' },
]

export function MobileMenu({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`lg:hidden p-2 -m-2 transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
        aria-label="Open menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 bg-asphalt z-50 flex flex-col">
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-6 right-6 text-cream p-2 -m-2"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Primary links */}
          <nav className="mt-24 px-6 flex flex-col space-y-6">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="font-display font-black text-3xl uppercase text-cream tracking-tight hover:text-coral active:text-coral transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-cream/10 my-8 w-24 mx-6" />

          {/* Secondary links */}
          <div className="px-6 flex flex-col space-y-4">
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="font-display text-sm uppercase tracking-[0.2em] text-cream/50 hover:text-coral transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Brand footer */}
          <div className="absolute bottom-8 left-6">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-cream/30">
              POSTED HAWAI&#x02BB;I
            </p>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-cream/20 mt-1">
              Honolulu
            </p>
          </div>
        </div>
      )}
    </>
  )
}
