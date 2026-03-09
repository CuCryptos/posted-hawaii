'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/products'

export function ProductDetail({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.includes('M') ? 'M' : product.sizes[0]
  )
  const [selectedImage, setSelectedImage] = useState(0)

  const currentColor = product.colors[selectedColor]

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-16">
      {/* Image gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-warm-sand">
          <Image
            src={product.images[selectedImage] || currentColor.image}
            alt={`${product.name} — ${currentColor.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-16 overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? 'border-asphalt' : 'border-transparent'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
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
          {product.name}
        </h1>
        <p className="font-display text-[15px] text-asphalt/60 mt-2">
          ${product.price}
        </p>

        <p className="font-body text-[15px] text-asphalt/80 mt-6 leading-relaxed">
          {product.description}
        </p>

        {/* Color selector */}
        {product.colors.length > 1 && (
          <div className="mt-8">
            <p className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt mb-3">
              Color — {currentColor.name}
            </p>
            <div className="flex gap-2">
              {product.colors.map((color, i) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(i)
                    setSelectedImage(i)
                  }}
                  className={`w-10 h-10 rounded-full border-2 transition-colors ${
                    selectedColor === i ? 'border-asphalt' : 'border-asphalt/10'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        <div className="mt-8">
          <p className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt mb-3">
            Size
          </p>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 border font-display text-[12px] transition-colors ${
                  selectedSize === size
                    ? 'border-asphalt bg-asphalt text-cream'
                    : 'border-asphalt/20 text-asphalt hover:border-asphalt'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to bag */}
        <button
          className="snipcart-add-item w-full mt-8 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-5 hover:bg-coral/90 transition-colors"
          data-item-id={`${product.slug}-${currentColor.name}-${selectedSize}`}
          data-item-name={product.name}
          data-item-price={product.price}
          data-item-url={`/shop/${product.slug}`}
          data-item-image={currentColor.image}
          data-item-custom1-name="Size"
          data-item-custom1-value={selectedSize}
          data-item-custom2-name="Color"
          data-item-custom2-value={currentColor.name}
          data-item-custom3-name="printify_product_id"
          data-item-custom3-value={product.printifyProductId || ''}
          data-item-custom3-type="hidden"
        >
          Add to Bag — ${product.price}
        </button>

        {/* Details */}
        <div className="mt-10 pt-8 border-t border-asphalt/10">
          <p className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt mb-4">
            Details
          </p>
          <ul className="space-y-2">
            {product.details.map((detail) => (
              <li
                key={detail}
                className="font-body text-[14px] text-asphalt/70 leading-relaxed"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
