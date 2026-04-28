'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartProvider'

type LookbookItem = {
  image: string
  name: string
  price: number
  href: string
  variantId?: string
}

type LookbookDrawerProps = {
  open: boolean
  onClose: () => void
  item: LookbookItem | null
}

export function LookbookDrawer({ open, onClose, item }: LookbookDrawerProps) {
  const { addToCart, loading, pendingTarget, error, clearError } = useCart()
  const [addedItemHref, setAddedItemHref] = useState<string | null>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!item) return null

  const added = addedItemHref === item.href

  async function handleAdd() {
    if (!item?.variantId) return
    clearError()
    const didAdd = await addToCart(item.variantId)
    if (didAdd) {
      setAddedItemHref(item.href)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`drawer-panel absolute right-0 top-0 h-full w-full sm:w-[400px] bg-cream overflow-y-auto shadow-xl ${open ? 'open' : ''}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-asphalt p-2 -m-2 z-10"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 pt-16">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="400px"
            />
          </div>

          <div className="mt-6">
            <h3 className="font-display font-bold text-[13px] uppercase tracking-wider text-asphalt">
              {item.name}
            </h3>
            <p className="font-display text-[13px] text-asphalt/60 mt-1">
              ${item.price}
            </p>
          </div>

          {item.variantId ? (
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full mt-6 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-5 hover:bg-coral/90 transition-colors disabled:opacity-50"
            >
              {added ? 'Added!' : loading && pendingTarget === item.variantId ? 'Adding...' : 'Add to Bag'}
            </button>
          ) : (
            <Link
              href={item.href}
              className="block w-full mt-6 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-5 text-center hover:bg-coral/90 transition-colors"
            >
              View Options
            </Link>
          )}
          {error && (
            <p className="mt-3 font-body text-[14px] text-lava">
              {error}
            </p>
          )}

          <Link
            href={item.href}
            className="block text-center mt-4 font-display text-[11px] uppercase tracking-widest text-asphalt/60 hover:text-asphalt transition-colors"
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export type { LookbookItem }
