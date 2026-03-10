'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify-types'
import { useCart } from '@/components/cart/CartProvider'

const COLOR_MAP: Record<string, string> = {
  Black: '#0D0D0D',
  Sand: '#E8DDD3',
  Navy: '#1A4A5A',
  Coral: '#C4705A',
  Bone: '#F0EBE3',
  White: '#FFFFFF',
}

export function ProductDetail({ product }: { product: ShopifyProduct }) {
  const { addToCart, loading } = useCart()
  const variants = product.variants.edges.map((e) => e.node)
  const images = product.images.edges.map((e) => e.node)

  // Extract unique options (e.g., Size, Color)
  const options = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const v of variants) {
      for (const opt of v.selectedOptions) {
        if (!map.has(opt.name)) map.set(opt.name, [])
        const values = map.get(opt.name)!
        if (!values.includes(opt.value)) values.push(opt.value)
      }
    }
    return Array.from(map.entries()).map(([name, values]) => ({ name, values }))
  }, [variants])

  // Track selected option values
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    for (const opt of options) {
      if (opt.name === 'Size' && opt.values.includes('M')) {
        defaults[opt.name] = 'M'
      } else {
        defaults[opt.name] = opt.values[0]
      }
    }
    return defaults
  })

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string>('details')
  const [addedToCart, setAddedToCart] = useState(false)

  // Find the matching variant
  const selectedVariant: ShopifyProductVariant | undefined = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    )
  }, [variants, selectedOptions])

  // Check if a specific size is available for the current color selection
  const isSizeAvailable = (size: string): boolean => {
    const optionsWithSize: Record<string, string> = { ...selectedOptions, Size: size }
    const variant = variants.find((v) =>
      v.selectedOptions.every((opt) => optionsWithSize[opt.name] === opt.value)
    )
    return variant?.availableForSale ?? true
  }

  const price = selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount
  const formattedPrice = `$${parseFloat(price).toFixed(0)}`
  const isSoldOut = selectedVariant && !selectedVariant.availableForSale

  async function handleAddToCart() {
    if (!selectedVariant || isSoldOut) return
    await addToCart(selectedVariant.id)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const colorOption = options.find((o) => o.name === 'Color')
  const sizeOption = options.find((o) => o.name === 'Size')

  const accordions = [
    {
      key: 'details',
      title: 'Details',
      content: product.description || 'Premium heavyweight cotton with a relaxed fit. Screen-printed graphics designed in Honolulu. Pre-shrunk and garment-dyed for a worn-in feel from day one.',
    },
    {
      key: 'fit',
      title: 'Fit & Sizing',
      content: 'Relaxed, slightly oversized fit. We recommend your usual size for the intended look, or size down for a more fitted silhouette. Model is 5\'11" wearing size M.',
    },
    {
      key: 'care',
      title: 'Care',
      content: 'Machine wash cold, inside out. Tumble dry low or hang dry. Do not bleach. Iron inside out if needed. Printed graphics are durable but gentle care extends the life of the garment.',
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left — Gallery */}
      <div>
        {/* Desktop: thumbnails + main image */}
        <div className="hidden lg:flex gap-4">
          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex flex-col gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative w-16 aspect-square bg-warm-sand overflow-hidden cursor-pointer border-2 transition-colors ${
                    selectedImageIndex === i ? 'border-asphalt' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.title} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
          {/* Main image */}
          <div className="relative flex-1 aspect-[3/4] bg-warm-sand overflow-hidden">
            {images[selectedImageIndex] && (
              <Image
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].altText || product.title}
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
            )}
          </div>
        </div>

        {/* Mobile: horizontal scroll carousel */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-full flex-shrink-0 aspect-[3/4] bg-warm-sand overflow-hidden snap-center"
              >
                <Image
                  src={img.url}
                  alt={img.altText || `${product.title} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selectedImageIndex === i ? 'bg-asphalt' : 'bg-asphalt/20'
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right — Product Info */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        {/* Collection label */}
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-coral mb-3">
          DROP 001 — POSTED UP
        </p>

        {/* Title */}
        <h1 className="font-display font-black text-2xl md:text-3xl uppercase text-asphalt tracking-tight">
          {product.title}
        </h1>

        {/* Price */}
        <p className="font-display text-xl text-asphalt mt-2">
          {formattedPrice}
        </p>

        {/* Statement */}
        <p className="font-body text-base text-asphalt/70 mt-4 leading-relaxed max-w-sm">
          {product.description}
        </p>

        {/* Divider */}
        <div className="border-t border-asphalt/10 my-6" />

        {/* Color selector */}
        {colorOption && (
          <div className="mb-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-asphalt mb-3">
              Color — {selectedOptions.Color}
            </p>
            <div className="flex gap-3">
              {colorOption.values.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, Color: color }))
                  }
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${
                    selectedOptions.Color === color
                      ? 'border-asphalt ring-2 ring-offset-2 ring-asphalt'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: COLOR_MAP[color] || '#CCCCCC' }}
                  aria-label={color}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        {sizeOption && (
          <div className="mb-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-asphalt mb-3">
              Size
            </p>
            <div className="flex gap-2">
              {sizeOption.values.map((size) => {
                const available = isSizeAvailable(size)
                const isSelected = selectedOptions.Size === size
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (available) {
                        setSelectedOptions((prev) => ({ ...prev, Size: size }))
                      }
                    }}
                    disabled={!available}
                    className={`w-12 h-12 flex items-center justify-center font-display text-sm font-bold uppercase border-2 transition-colors ${
                      !available
                        ? 'text-asphalt/20 border-asphalt/10 cursor-not-allowed line-through'
                        : isSelected
                          ? 'bg-asphalt text-cream border-asphalt'
                          : 'bg-transparent text-asphalt border-asphalt/20 hover:border-asphalt'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={loading || !!isSoldOut}
          className={`w-full py-4 font-display font-bold text-sm uppercase tracking-widest transition-colors duration-300 ${
            isSoldOut
              ? 'bg-asphalt/30 text-asphalt/50 cursor-not-allowed'
              : addedToCart
                ? 'bg-palm text-cream'
                : 'bg-asphalt text-cream hover:bg-coral'
          }`}
        >
          {isSoldOut
            ? 'SOLD OUT'
            : addedToCart
              ? 'ADDED \u2713'
              : loading
                ? 'ADDING...'
                : `ADD TO CART \u2014 ${formattedPrice}`}
        </button>

        {/* Accordions */}
        <div className="mt-8 border-t border-asphalt/10">
          {accordions.map((acc) => (
            <div key={acc.key} className="border-b border-asphalt/10">
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === acc.key ? '' : acc.key)
                }
                className="w-full flex justify-between items-center py-4"
              >
                <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-asphalt">
                  {acc.title}
                </span>
                <svg
                  className={`w-4 h-4 text-asphalt transition-transform duration-200 ${
                    openAccordion === acc.key ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordion === acc.key && (
                <div className="font-body text-sm text-asphalt/70 leading-relaxed pb-6 pt-2">
                  {acc.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
