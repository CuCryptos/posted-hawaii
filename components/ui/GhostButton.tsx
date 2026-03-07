import Link from 'next/link'

type GhostButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'light' | 'dark'
  className?: string
}

export function GhostButton({ href, children, variant = 'light', className = '' }: GhostButtonProps) {
  const variants = {
    light: 'border-white text-white hover:bg-white hover:text-asphalt',
    dark: 'border-asphalt text-asphalt hover:bg-asphalt hover:text-cream',
  }

  return (
    <Link
      href={href}
      className={`inline-block font-display font-bold text-[11px] uppercase tracking-widest px-8 py-3 border transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}
