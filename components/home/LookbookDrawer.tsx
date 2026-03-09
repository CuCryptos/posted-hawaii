'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type LookbookItem = {
  image: string
  name: string
  price: number
  href: string
  printifyProductId?: string
  printifyVariantId?: string
}

type LookbookDrawerProps = {
  open: boolean
  onClose: () => void
  item: LookbookItem | null
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL'] as const

export function LookbookDrawer({ open, onClose, item }: LookbookDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<string>('M')

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

          {/* Size selector */}
          <div className="mt-6 flex gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-11 h-11 border font-display text-[11px] transition-colors ${
                  selectedSize === size
                    ? 'border-asphalt bg-asphalt text-cream'
                    : 'border-asphalt/20 text-asphalt hover:border-asphalt'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            className="snipcart-add-item w-full mt-6 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-5 hover:bg-coral/90 transition-colors"
            data-item-id={`${item.href}-${selectedSize}`}
            data-item-name={item.name}
            data-item-price={item.price}
            data-item-url={item.href}
            data-item-image={item.image}
            data-item-custom1-name="Size"
            data-item-custom1-value={selectedSize}
            data-item-custom2-name="printify_product_id"
            data-item-custom2-value={item.printifyProductId || ''}
            data-item-custom2-type="hidden"
            data-item-custom3-name="printify_variant_id"
            data-item-custom3-value={item.printifyVariantId || ''}
            data-item-custom3-type="hidden"
          >
            Add to Bag
          </button>

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
