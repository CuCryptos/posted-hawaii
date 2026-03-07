import Link from 'next/link'

type ButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}

export function Button({ href, children, variant = 'primary', className = '' }: ButtonProps) {
  const base = 'inline-block font-display font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-brand transition-colors'
  const variants = {
    primary: 'bg-coral text-white hover:bg-coral/90',
    outline: 'border-2 border-asphalt text-asphalt hover:bg-asphalt hover:text-cream',
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}
