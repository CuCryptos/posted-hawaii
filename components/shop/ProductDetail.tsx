'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify-types'
import { useCart } from '@/components/cart/CartProvider'

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

  const [selectedImage, setSelectedImage] = useState(0)

  // Find the matching variant
  const selectedVariant: ShopifyProductVariant | undefined = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    )
  }, [variants, selectedOptions])

  const price = selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount

  async function handleAddToCart() {
    if (!selectedVariant) return
    await addToCart(selectedVariant.id)
  }

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-16">
      {/* Image gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-warm-sand">
          {images[selectedImage] && (
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].altText || product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-16 overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? 'border-asphalt' : 'border-transparent'
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
      </div>

      {/* Product info */}
      <div className="mt-8 lg:mt-0">
        <h1 className="font-display font-black text-[1.75rem] uppercase tracking-tight text-asphalt">
          {product.title}
        </h1>
        <p className="font-display text-[15px] text-asphalt/60 mt-2">
          ${parseFloat(price).toFixed(0)}
        </p>

        <p className="font-body text-[15px] text-asphalt/80 mt-6 leading-relaxed">
          {product.description}
        </p>

        {/* Option selectors */}
        {options.map((option) => (
          <div key={option.name} className="mt-8">
            <p className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt mb-3">
              {option.name}{option.name === 'Color' ? ` — ${selectedOptions[option.name]}` : ''}
            </p>
            <div className="flex gap-2">
              {option.values.map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))
                  }
                  className={`${
                    option.name === 'Size' ? 'w-12 h-12' : 'px-4 h-12'
                  } border font-display text-[12px] transition-colors ${
                    selectedOptions[option.name] === value
                      ? 'border-asphalt bg-asphalt text-cream'
                      : 'border-asphalt/20 text-asphalt hover:border-asphalt'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Add to bag */}
        <button
          onClick={handleAddToCart}
          disabled={loading || !selectedVariant?.availableForSale}
          className="w-full mt-8 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-5 hover:bg-coral/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!selectedVariant?.availableForSale
            ? 'Sold Out'
            : loading
              ? 'Adding...'
              : `Add to Bag — $${parseFloat(price).toFixed(0)}`}
        </button>
      </div>
    </div>
  )
}
