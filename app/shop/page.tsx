'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { CategoryFilter } from '@/components/shop/CategoryFilter'
import { ProductCard } from '@/components/shop/ProductCard'
import { PRODUCTS, getProductsByCategory } from '@/lib/products'

export default function ShopPage() {
  const [category, setCategory] = useState('all')
  const products = getProductsByCategory(category)

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <PageHero title="Shop" />
        <Container className="py-10 lg:py-12">
          <CategoryFilter active={category} onChange={setCategory} />
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="font-body italic text-asphalt/40 text-center mt-16">
              Coming soon.
            </p>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
