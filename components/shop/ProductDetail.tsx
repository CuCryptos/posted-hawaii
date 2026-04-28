'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify-types'
import type { Launch } from '@/lib/launches'
import { useCart } from '@/components/cart/CartProvider'

const COLOR_MAP: Record<string, string> = {
  Black: '#0D0D0D',
  Sand: '#E8DDD3',
  Navy: '#1A4A5A',
  Coral: '#C4705A',
  Bone: '#F0EBE3',
  White: '#FFFFFF',
}

export function ProductDetail({
  product,
  launch,
}: {
  product: ShopifyProduct
  launch?: Launch
}) {
  const { addToCart, loading, pendingTarget, error, clearError } = useCart()
  const variants = product.variants.edges.map((e) => e.node)
  const images = product.images.edges.map((e) => e.node)

  // Extract unique options
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
  const [activeTab, setActiveTab] = useState<'description' | 'fit' | 'shipping'>('description')
  const [addedToCart, setAddedToCart] = useState(false)

  const selectedVariant: ShopifyProductVariant | undefined = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    )
  }, [variants, selectedOptions])

  const isSizeAvailable = (size: string): boolean => {
    const optionsWithSize: Record<string, string> = { ...selectedOptions, Size: size }
    const variant = variants.find((v) =>
      v.selectedOptions.every((opt) => optionsWithSize[opt.name] === opt.value)
    )
    return variant?.availableForSale ?? true
  }

  const price = selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount
  const formattedPrice = `$${parseFloat(price).toFixed(2)}`
  const isSoldOut = selectedVariant && !selectedVariant.availableForSale

  async function handleAddToCart() {
    if (!selectedVariant || isSoldOut) return
    clearError()
    const didAdd = await addToCart(selectedVariant.id)
    if (didAdd) {
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 1500)
    }
  }

  const colorOption = options.find((o) => o.name === 'Color')
  const sizeOption = options.find((o) => o.name === 'Size')

  // Drop label
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Left — Gallery */}
      <div>
        {/* Desktop: thumbnails + main image */}
        <div className="hidden lg:flex gap-3">
          {images.length > 1 && (
            <div className="flex flex-col gap-2 w-[72px] flex-shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative aspect-square bg-[#F0F0F0] overflow-hidden cursor-pointer border transition-colors ${
                    selectedImageIndex === i ? 'border-asphalt' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.title} view ${i + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>
          )}
          {/* Main image */}
          <div className="relative flex-1 aspect-[3/4] bg-[#F0F0F0] overflow-hidden">
            {images[selectedImageIndex] && (
              <Image
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].altText || product.title}
                fill
                className="object-contain p-6"
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
                className="relative w-full flex-shrink-0 aspect-square bg-[#F0F0F0] overflow-hidden snap-center"
              >
                <Image
                  src={img.url}
                  alt={img.altText || `${product.title} view ${i + 1}`}
                  fill
                  className="object-contain p-6"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
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
      <div className="lg:sticky lg:top-28 lg:self-start">
        {/* Collection label */}
        {launch && (
          <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-asphalt/50 mb-2">
            {launch.collection.replace('_', ' ')}
          </p>
        )}

        {/* Title */}
        <h1 className="font-display font-black text-xl md:text-2xl text-asphalt tracking-tight">
          {product.title}
        </h1>

        {/* Price */}
        <p className="font-display text-base text-asphalt mt-2">
          {formattedPrice}
        </p>

        {/* Divider */}
        <div className="border-t border-asphalt/10 my-6" />

        {/* Color selector */}
        {colorOption && (
          <div className="mb-6">
            <p className="font-display text-xs font-medium uppercase tracking-[0.15em] text-asphalt/70 mb-3">
              Color: <span className="text-asphalt">{selectedOptions.Color}</span>
            </p>
            <div className="flex gap-2.5">
              {colorOption.values.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, Color: color }))
                  }
                  className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all ${
                    selectedOptions.Color === color
                      ? 'border-asphalt ring-1 ring-offset-2 ring-asphalt'
                      : 'border-asphalt/15 hover:border-asphalt/40'
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
            <div className="flex justify-between items-center mb-3">
              <p className="font-display text-xs font-medium uppercase tracking-[0.15em] text-asphalt/70">
                Size
              </p>
              <Link
                href="/size-guide"
                className="font-display text-xs font-medium uppercase tracking-[0.1em] text-asphalt/50 hover:text-asphalt transition-colors"
              >
                View Size Guide
              </Link>
            </div>
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
                    className={`min-w-[48px] h-11 px-3 flex items-center justify-center font-display text-sm font-medium border transition-colors ${
                      !available
                        ? 'text-asphalt/20 border-asphalt/5 cursor-not-allowed line-through'
                        : isSelected
                          ? 'bg-asphalt text-cream border-asphalt'
                          : 'bg-transparent text-asphalt border-asphalt/15 hover:border-asphalt'
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
          className={`w-full py-4 font-display font-bold text-sm uppercase tracking-widest transition-colors duration-200 ${
            isSoldOut
              ? 'bg-asphalt/20 text-asphalt/40 cursor-not-allowed'
              : addedToCart
                ? 'bg-palm text-cream'
                : 'bg-asphalt text-cream hover:bg-asphalt/90'
          }`}
        >
          {isSoldOut
            ? 'SOLD OUT'
            : addedToCart
              ? 'ADDED \u2713'
              : loading && pendingTarget === selectedVariant?.id
                ? 'ADDING...'
                : 'ADD TO CART'}
        </button>
        {error && (
          <p className="mt-3 font-body text-sm text-lava">
            {error}
          </p>
        )}

        {/* Tabs — Description / Fit / Shipping */}
        <div className="mt-8">
          <div className="flex border-b border-asphalt/10">
            {([
              { key: 'description', label: 'Description' },
              { key: 'fit', label: 'Size & Fit' },
              { key: 'shipping', label: 'Shipping & Returns' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`font-display text-xs font-bold uppercase tracking-[0.1em] py-3 mr-6 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-asphalt border-asphalt'
                    : 'text-asphalt/40 border-transparent hover:text-asphalt/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="py-5">
            {activeTab === 'description' && (
              <p className="font-body text-sm text-asphalt/70 leading-relaxed">
                {product.description || 'Premium heavyweight cotton with a relaxed fit. Screen-printed graphics designed in Honolulu. Pre-shrunk and garment-dyed for a worn-in feel from day one.'}
              </p>
            )}
            {activeTab === 'fit' && (
              <p className="font-body text-sm text-asphalt/70 leading-relaxed">
                Relaxed, slightly oversized fit. We recommend your usual size for the intended look, or size down for a more fitted silhouette.
              </p>
            )}
            {activeTab === 'shipping' && (
              <div className="font-body text-sm text-asphalt/70 leading-relaxed space-y-2">
                <p>Free shipping on orders over $100. Standard shipping 5-7 business days.</p>
                <p>Returns accepted within 30 days of delivery. Items must be unworn with original tags.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
