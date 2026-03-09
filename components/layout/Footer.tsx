import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All', href: '/shop' },
      { label: 'Tees', href: '/shop' },
      { label: 'Hoodies', href: '/shop' },
      { label: 'Caps', href: '/shop' },
    ],
  },
  {
    title: 'Posted',
    links: [
      { label: 'Drops', href: '/drops' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Info',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Follow Us',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/postedhawaii' },
      { label: 'TikTok', href: 'https://tiktok.com/@postedhawaii' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-asphalt/10 bg-cream">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Logo */}
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/images/brand/posted-wordmark.svg"
              alt="POSTED"
              width={80}
              height={24}
              className="h-5 w-auto invert"
            />
          </div>

          {/* Columns 2-5: Links */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-display text-[11px] uppercase tracking-wider text-asphalt/50 hover:text-asphalt transition-colors py-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-asphalt/10">
          <p className="font-display text-[10px] uppercase tracking-wider text-asphalt/30">
            &copy; 2026 POSTED HAWAI&#x02BB;I
          </p>
        </div>
      </Container>
    </footer>
  )
}
