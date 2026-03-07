import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { BRAND } from '@/lib/constants'

const footerLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="bg-asphalt border-t border-white/10 py-16">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div>
            <Image
              src="/images/brand/posted-hawaii-lockup.svg"
              alt={BRAND.fullName}
              width={160}
              height={60}
              className="h-12 w-auto"
            />
            <p className="font-body italic text-cream/50 text-sm mt-4">
              {BRAND.tagline}
            </p>
          </div>

          <nav className="flex gap-12">
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-display font-medium text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="font-display text-xs text-cream/40">
            &copy; {BRAND.established} {BRAND.fullName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
