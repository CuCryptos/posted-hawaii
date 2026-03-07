'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LookbookDrawer } from './LookbookDrawer'
import type { LookbookItem } from './LookbookDrawer'

type LookbookGridProps = {
  items: LookbookItem[]
}

export function LookbookGrid({ items }: LookbookGridProps) {
  const [activeItem, setActiveItem] = useState<LookbookItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveItem(item)}
            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            {/* Bag icon */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <LookbookDrawer
        open={activeItem !== null}
        onClose={() => setActiveItem(null)}
        item={activeItem}
      />
    </>
  )
}
