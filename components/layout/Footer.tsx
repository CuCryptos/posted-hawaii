import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
]

const CONNECT_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/postedhawaii' },
  { label: 'TikTok', href: 'https://tiktok.com/@postedhawaii' },
  { label: 'Contact', href: '/contact' },
  { label: 'info@postedhi.com', href: 'mailto:info@postedhi.com' },
]

export function Footer() {
  return (
    <footer className="bg-asphalt pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Col 1 — Brand */}
          <div>
            <p className="font-display font-black text-2xl text-cream">POSTED</p>
            <p className="font-body text-sm text-cream/40 mt-2">Honolulu, HI</p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-cream/40 mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/70 hover:text-coral transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Connect */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-cream/40 mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              {CONNECT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/70 hover:text-coral transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-cream/10 mt-12 pt-6">
          <p className="font-body text-xs text-cream/30">
            &copy; 2026 POSTED HAWAI&#x02BB;I
          </p>
        </div>
      </div>
    </footer>
  )
}
