import Link from 'next/link'
import Image from 'next/image'
import { NAV_LINKS } from '@/lib/constants'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-asphalt/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/brand/posted-wordmark.svg"
            alt="POSTED"
            width={120}
            height={32}
            className="h-6 w-auto invert"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display font-medium text-sm uppercase tracking-wider text-asphalt hover:text-coral transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileMenu />
      </div>
    </header>
  )
}
