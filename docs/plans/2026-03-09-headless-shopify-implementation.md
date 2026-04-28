---
project: "POSTED HAWAI'I"
type: "implementation-plan"
module: "Headless Shopify"
created: "2026-03-09"
tags: [posted, shopify, migration, plan, implementation]
---

# Headless Shopify Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate POSTED HAWAI'I from Snipcart to headless Shopify — keep the Next.js frontend, use Shopify Storefront API for products/cart/checkout, Printify auto-fulfills via native Shopify integration.

**Architecture:** Next.js fetches products from Shopify Storefront API via GraphQL. Cart state managed by a React context that calls Shopify cart mutations. Checkout redirects to Shopify hosted checkout. Printify syncs orders through Shopify automatically.

**Tech Stack:** Next.js 16, React 19, Shopify Storefront API (GraphQL), TypeScript, Tailwind CSS 4

---

### Task 0: Shopify Store Setup (Manual — User Does This)

**Before any code changes, the user must complete these steps in Shopify admin:**

1. Create Shopify store at shopify.com (store name: POSTED HAWAI'I)
2. Install Printify app → Connect existing Printify account (Shop ID 26715541)
3. Verify all 7 products synced with correct variants, pricing, images
4. Create a custom app for Storefront API access:
   - Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app
   - Name: "POSTED Frontend"
   - Configure Storefront API scopes: `unauthenticated_read_products`, `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`
   - Install app → copy Storefront access token
5. Note your store domain (e.g. `posted-hawaii.myshopify.com`)

**Confirmation:** User provides the store domain and Storefront API token before proceeding.

---

### Task 1: Shopify Client Library

**Files:**
- Create: `lib/shopify.ts`
- Create: `lib/shopify-types.ts`
- Modify: `package.json` (no new deps needed — uses native fetch)

**Step 1: Create TypeScript types for Shopify Storefront API responses**

Create `lib/shopify-types.ts`:

```typescript
// Shopify Storefront API response types

export type ShopifyImage = {
  url: string
  altText: string | null
  width: number
  height: number
}

export type ShopifyPrice = {
  amount: string
  currencyCode: string
}

export type ShopifyProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyPrice
  selectedOptions: { name: string; value: string }[]
  image: ShopifyImage | null
}

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  productType: string
  tags: string[]
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ShopifyProductVariant }[] }
  priceRange: {
    minVariantPrice: ShopifyPrice
  }
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      handle: string
      title: string
    }
    image: ShopifyImage | null
    price: ShopifyPrice
    selectedOptions: { name: string; value: string }[]
  }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyPrice
    totalAmount: ShopifyPrice
    totalTaxAmount: ShopifyPrice | null
  }
  lines: { edges: { node: ShopifyCartLine }[] }
}
```

**Step 2: Create the Shopify Storefront API client**

Create `lib/shopify.ts`:

```typescript
import type {
  ShopifyProduct,
  ShopifyCart,
} from './shopify-types'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}

// ---------- Product Queries ----------

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    productType
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`

export async function getProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: `
      query Products {
        products(first: 50, sortKey: TITLE) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
  })
  return data.products.edges.map((e) => e.node)
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    productByHandle: ShopifyProduct | null
  }>({
    query: `
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductFields
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { handle },
  })
  return data.productByHandle
}

// ---------- Cart Mutations ----------

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                handle
                title
              }
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartCreate {
        cartCreate {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
  })
  return data.cartCreate.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{
    cart: ShopifyCart | null
  }>({
    query: `
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId },
  })
  return data.cart
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  })
  return data.cartLinesAdd.cart
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  })
  return data.cartLinesUpdate.cart
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  })
  return data.cartLinesRemove.cart
}
```

**Step 3: Add environment variables**

Create `.env.local` (or update existing):
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=posted-hawaii.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_token_here
```

**Step 4: Verify the client compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 5: Commit**

```bash
git add lib/shopify.ts lib/shopify-types.ts
git commit -m "feat: add Shopify Storefront API client and types"
```

---

### Task 2: Cart Provider

**Files:**
- Create: `components/cart/CartProvider.tsx`

**Step 1: Create the cart context provider**

Create `components/cart/CartProvider.tsx`:

```tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { ShopifyCart } from '@/lib/shopify-types'
import {
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  updateCartLine as shopifyUpdateCartLine,
  removeCartLine as shopifyRemoveCartLine,
} from '@/lib/shopify'

type CartContextType = {
  cart: ShopifyCart | null
  loading: boolean
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const CART_ID_KEY = 'posted-cart-id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [loading, setLoading] = useState(false)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    async function initCart() {
      const storedCartId = localStorage.getItem(CART_ID_KEY)
      if (storedCartId) {
        const existingCart = await getCart(storedCartId)
        if (existingCart) {
          setCart(existingCart)
          return
        }
      }
      // No valid stored cart — create a new one
      const newCart = await createCart()
      localStorage.setItem(CART_ID_KEY, newCart.id)
      setCart(newCart)
    }
    initCart()
  }, [])

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!cart) return
      setLoading(true)
      try {
        const updatedCart = await shopifyAddToCart(cart.id, variantId, quantity)
        setCart(updatedCart)
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return
      setLoading(true)
      try {
        if (quantity <= 0) {
          const updatedCart = await shopifyRemoveCartLine(cart.id, lineId)
          setCart(updatedCart)
        } else {
          const updatedCart = await shopifyUpdateCartLine(cart.id, lineId, quantity)
          setCart(updatedCart)
        }
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return
      setLoading(true)
      try {
        const updatedCart = await shopifyRemoveCartLine(cart.id, lineId)
        setCart(updatedCart)
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add components/cart/CartProvider.tsx
git commit -m "feat: add CartProvider with Shopify cart state management"
```

---

### Task 3: Wire CartProvider into Layout + Remove Snipcart

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Replace Snipcart with CartProvider**

Replace the entire content of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { dmSans, lora } from './fonts'
import './globals.css'
import { CartProvider } from '@/components/cart/CartProvider'

export const metadata: Metadata = {
  title: 'POSTED HAWAI\u02BBI \u2014 You know where to find us.',
  description: 'Honolulu-based streetwear. Bold with discipline.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
```

**What changed:**
- Removed: `<link rel="preconnect" href="https://cdn.snipcart.com" />`
- Removed: Snipcart CSS link
- Removed: `<head>` block entirely (Next.js handles it via metadata)
- Removed: `#snipcart` hidden div
- Removed: Snipcart JS script tag
- Added: `CartProvider` wrapping `{children}`

**Step 2: Verify dev server starts**

Run: `npm run dev`
Expected: Site loads without errors (cart won't work yet until env vars are set, but page should render)

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: replace Snipcart with CartProvider in root layout"
```

---

### Task 4: Update Navbar Cart Button

**Files:**
- Modify: `components/layout/Navbar.tsx`

**Step 1: Replace Snipcart cart button with useCart hook**

Replace the entire content of `components/layout/Navbar.tsx` with:

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'
import { useCart } from '@/components/cart/CartProvider'

const NAV_LEFT = [
  { label: 'Shop', href: '/shop' },
  { label: 'Drops', href: '/drops' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { cart } = useCart()

  const itemCount = cart?.totalQuantity ?? 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 flex items-center justify-between h-16">
        {/* Left: nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-8 flex-1">
          {NAV_LEFT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display font-medium text-[11px] uppercase tracking-widest transition-colors ${
                scrolled ? 'text-asphalt hover:text-coral' : 'text-white hover:text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/brand/posted-wordmark.svg"
            alt="POSTED"
            width={160}
            height={40}
            className={`h-9 md:h-10 w-auto transition-all duration-300 ${scrolled ? 'invert drop-shadow-none' : 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'}`}
            priority
          />
        </Link>

        {/* Right: icons (desktop) + mobile menu */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
          <button
            aria-label="Search"
            className={`p-2 -m-2 transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className={`p-2 -m-2 transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className={`p-2 -m-2 relative transition-colors ${scrolled ? 'text-asphalt' : 'text-white'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <MobileMenu scrolled={scrolled} />
      </div>
    </header>
  )
}
```

**What changed:**
- Added `useCart` import and hook call
- Cart button changed from `<button className="snipcart-checkout">` to `<Link href="/cart">`
- Cart count badge changed from `<span className="snipcart-items-count">` to dynamic `{itemCount}` from cart state
- Badge only shows when `itemCount > 0`

**Step 2: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: replace Snipcart cart button with Shopify cart link"
```

---

### Task 5: Shop Page — Fetch Products from Shopify

**Files:**
- Modify: `app/shop/page.tsx`

**Step 1: Rewrite shop page to fetch from Shopify**

Replace the entire content of `app/shop/page.tsx` with:

```tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { ShopGrid } from '@/components/shop/ShopGrid'
import { getProducts } from '@/lib/shopify'

export const revalidate = 60

export const metadata = {
  title: 'Shop — POSTED HAWAI\u02BBI',
  description: 'Shop the latest POSTED drops.',
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <PageHero title="Shop" />
        <Container className="py-10 lg:py-12">
          <ShopGrid products={products} />
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Create the ShopGrid client component for filtering**

Create `components/shop/ShopGrid.tsx`:

```tsx
'use client'

import { useState } from 'react'
import type { ShopifyProduct } from '@/lib/shopify-types'
import { ProductCard } from './ProductCard'

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'tees', label: 'Tees' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'caps', label: 'Caps' },
] as const

export function ShopGrid({ products }: { products: ShopifyProduct[] }) {
  const [category, setCategory] = useState('all')

  const filtered =
    category === 'all'
      ? products
      : products.filter((p) =>
          p.productType.toLowerCase() === category ||
          p.tags.some((t) => t.toLowerCase() === category)
        )

  return (
    <>
      <div className="flex gap-6 border-b border-asphalt/10 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setCategory(cat.slug)}
            className={`font-display font-bold text-[11px] uppercase tracking-widest transition-colors pb-1 ${
              category === cat.slug
                ? 'text-asphalt border-b-2 border-coral'
                : 'text-asphalt/40 hover:text-asphalt'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-body italic text-asphalt/40 text-center mt-16">
          Coming soon.
        </p>
      )}
    </>
  )
}
```

**Step 3: Rewrite ProductCard for Shopify data shape**

Replace the entire content of `components/shop/ProductCard.tsx` with:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify-types'

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const image = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice.amount

  return (
    <Link href={`/shop/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-warm-sand">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display font-bold text-[12px] uppercase tracking-wider text-asphalt">
          {product.title}
        </h3>
        <p className="font-display text-[12px] text-asphalt/60 mt-0.5">
          ${parseFloat(price).toFixed(0)}
        </p>
      </div>
    </Link>
  )
}
```

**Step 4: Commit**

```bash
git add app/shop/page.tsx components/shop/ShopGrid.tsx components/shop/ProductCard.tsx
git commit -m "feat: shop page fetches products from Shopify Storefront API"
```

---

### Task 6: Product Detail Page — Shopify Data + Add to Cart

**Files:**
- Modify: `app/shop/[slug]/page.tsx`
- Modify: `components/shop/ProductDetail.tsx`

**Step 1: Rewrite the product page to fetch from Shopify**

Replace the entire content of `app/shop/[slug]/page.tsx` with:

```tsx
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { ProductDetail } from '@/components/shop/ProductDetail'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProductByHandle, getProducts } from '@/lib/shopify'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.handle }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  if (!product) return {}
  return {
    title: `${product.title} — POSTED HAWAI\u02BBI`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  if (!product) notFound()

  const allProducts = await getProducts()
  const related = allProducts
    .filter((p) => p.productType === product.productType && p.handle !== product.handle)
    .slice(0, 4)

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="bg-asphalt pt-28 pb-6 lg:pt-32 lg:pb-8" />
        <Container className="py-10 lg:py-12">
          <ProductDetail product={product} />

          {related.length > 0 && (
            <section className="mt-20 pt-12 border-t border-asphalt/10">
              <h2 className="font-display font-black text-[1.25rem] uppercase tracking-tight text-asphalt mb-8">
                You might also like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.handle} product={p} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Rewrite ProductDetail for Shopify data + useCart**

Replace the entire content of `components/shop/ProductDetail.tsx` with:

```tsx
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
      // Default to 'M' for Size if available, otherwise first value
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
```

**What changed:**
- Uses `ShopifyProduct` type instead of local `Product` type
- Dynamically extracts options (Size, Color) from variant data
- Finds matching variant based on selected options
- Uses `useCart().addToCart(variantId)` instead of Snipcart data attributes
- Shows "Sold Out" state from `availableForSale`
- Shows loading state while adding
- Product details (material, fit, etc.) come from Shopify description — no separate `details` array

**Step 3: Commit**

```bash
git add app/shop/[slug]/page.tsx components/shop/ProductDetail.tsx
git commit -m "feat: product detail page with Shopify data and cart integration"
```

---

### Task 7: Cart Page

**Files:**
- Create: `app/cart/page.tsx`

**Step 1: Create the cart page**

Create `app/cart/page.tsx`:

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { useCart } from '@/components/cart/CartProvider'

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart()
  const lines = cart?.lines.edges.map((e) => e.node) ?? []

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="bg-asphalt pt-28 pb-6 lg:pt-32 lg:pb-8" />
        <Container className="py-10 lg:py-12">
          <h1 className="font-display font-black text-[1.75rem] uppercase tracking-tight text-asphalt">
            Your Bag
          </h1>

          {lines.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="font-body italic text-asphalt/40">
                Your bag is empty.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-6 font-display font-bold text-[11px] uppercase tracking-widest text-coral hover:text-coral/80 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-8 lg:grid lg:grid-cols-3 lg:gap-16">
              {/* Line items */}
              <div className="lg:col-span-2 divide-y divide-asphalt/10">
                {lines.map((line) => (
                  <div key={line.id} className="flex gap-4 py-6 first:pt-0">
                    {/* Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-warm-sand overflow-hidden">
                      {line.merchandise.image && (
                        <Image
                          src={line.merchandise.image.url}
                          alt={line.merchandise.image.altText || line.merchandise.product.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${line.merchandise.product.handle}`}
                        className="font-display font-bold text-[12px] uppercase tracking-wider text-asphalt hover:text-coral transition-colors"
                      >
                        {line.merchandise.product.title}
                      </Link>
                      <p className="font-display text-[11px] text-asphalt/50 mt-1">
                        {line.merchandise.selectedOptions.map((o) => o.value).join(' / ')}
                      </p>
                      <p className="font-display text-[13px] text-asphalt mt-2">
                        ${parseFloat(line.merchandise.price.amount).toFixed(0)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          disabled={loading}
                          className="w-8 h-8 border border-asphalt/20 font-display text-[12px] text-asphalt hover:border-asphalt transition-colors disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="font-display text-[12px] text-asphalt w-6 text-center">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          disabled={loading}
                          className="w-8 h-8 border border-asphalt/20 font-display text-[12px] text-asphalt hover:border-asphalt transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(line.id)}
                          disabled={loading}
                          className="ml-auto font-display text-[10px] uppercase tracking-widest text-asphalt/40 hover:text-coral transition-colors disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="mt-8 lg:mt-0">
                <div className="bg-warm-sand p-6">
                  <h2 className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt">
                    Order Summary
                  </h2>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between font-display text-[13px] text-asphalt/70">
                      <span>Subtotal</span>
                      <span>${parseFloat(cart?.cost.subtotalAmount.amount ?? '0').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-display text-[13px] text-asphalt/70">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-asphalt/10 flex justify-between font-display font-bold text-[14px] text-asphalt">
                    <span>Total</span>
                    <span>${parseFloat(cart?.cost.totalAmount.amount ?? '0').toFixed(2)}</span>
                  </div>
                  <a
                    href={cart?.checkoutUrl}
                    className="block w-full mt-6 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-5 text-center hover:bg-coral/90 transition-colors"
                  >
                    Checkout
                  </a>
                  <Link
                    href="/shop"
                    className="block text-center mt-4 font-display text-[11px] uppercase tracking-widest text-asphalt/50 hover:text-asphalt transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Commit**

```bash
git add app/cart/page.tsx
git commit -m "feat: add dedicated cart page with Shopify checkout redirect"
```

---

### Task 8: Update LookbookDrawer

**Files:**
- Modify: `components/home/LookbookDrawer.tsx`

**Step 1: Replace Snipcart add-to-cart with useCart**

The LookbookDrawer needs a Shopify variant ID to add to cart. Update the `LookbookItem` type and the button to use `useCart`. Since the lookbook items will need variant IDs from Shopify, the parent component that renders the lookbook must pass them.

Replace the entire content of `components/home/LookbookDrawer.tsx` with:

```tsx
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
  const { addToCart, loading } = useCart()
  const [added, setAdded] = useState(false)

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset "added" state when item changes
  useEffect(() => {
    setAdded(false)
  }, [item])

  if (!item) return null

  async function handleAdd() {
    if (!item?.variantId) return
    await addToCart(item.variantId)
    setAdded(true)
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
              {added ? 'Added!' : loading ? 'Adding...' : 'Add to Bag'}
            </button>
          ) : (
            <Link
              href={item.href}
              className="block w-full mt-6 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-5 text-center hover:bg-coral/90 transition-colors"
            >
              View Options
            </Link>
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
```

**What changed:**
- Removed Snipcart data attributes and `snipcart-add-item` class
- Added `useCart()` hook for `addToCart`
- Simplified to single variant (if `variantId` provided, quick-add; otherwise "View Options" link)
- Removed size selector (user picks size/color on full product page)
- Added "Added!" confirmation state
- Removed `printifyProductId` and `printifyVariantId` from `LookbookItem` type

**Step 2: Commit**

```bash
git add components/home/LookbookDrawer.tsx
git commit -m "feat: update LookbookDrawer to use Shopify cart"
```

---

### Task 9: Clean Up — Delete Old Code

**Files:**
- Delete: `lib/products.ts` — **WAIT**: `DROPS` and `Drop` type are still used by `app/drops/page.tsx`
- Delete: `lib/printify.ts`
- Delete: `app/api/snipcart/webhook/route.ts`
- Delete: `app/api/snipcart/validate/route.ts`
- Delete: `app/api/printify/products/route.ts`
- Delete: `components/shop/CategoryFilter.tsx` (replaced by inline filter in ShopGrid)
- Modify: `lib/products.ts` → keep only `DROPS` data and `Drop` type

**Step 1: Trim lib/products.ts to only DROPS data**

Replace the entire content of `lib/products.ts` with:

```typescript
export type Drop = {
  number: number
  name: string
  collection: string
  description: string
  releaseDate: string
  image: string
  isLive: boolean
  productSlugs: string[]
}

export const DROPS: Drop[] = [
  {
    number: 1,
    name: 'Drop 001',
    collection: 'POSTED UP',
    description: "The first drop. The tees, the caps, the staples. If you know, you know.",
    releaseDate: '2026-04-01T10:00:00-10:00',
    image: '/images/hero/homepage-hero.png',
    isLive: false,
    productSlugs: ['the-posted-tee', 'the-sandys-tee', 'the-town-tee', 'the-og-cap', 'the-ala-moana-tee', 'the-crew-cap'],
  },
  {
    number: 2,
    name: 'Drop 002',
    collection: 'POSTED LATE',
    description: 'Evening essentials. When the sun dips and the fits level up.',
    releaseDate: '2026-06-01T10:00:00-10:00',
    image: '/images/lifestyle/kakaako-hoodie.png',
    isLive: false,
    productSlugs: ['the-bonfire-hoodie'],
  },
]
```

**Step 2: Delete the old files**

```bash
rm lib/printify.ts
rm app/api/snipcart/webhook/route.ts
rm app/api/snipcart/validate/route.ts
rm app/api/printify/products/route.ts
rm components/shop/CategoryFilter.tsx
```

**Step 3: Remove the empty api directories if they have no other files**

```bash
rmdir app/api/snipcart 2>/dev/null
rmdir app/api/printify 2>/dev/null
```

**Step 4: Verify no broken imports**

Run: `npx tsc --noEmit`
Expected: No type errors. If any file still imports from deleted modules, fix them.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove Snipcart, Printify direct API, and hardcoded product data"
```

---

### Task 10: Environment Variables + Shopify Domain Allowlist

**Files:**
- Modify: `next.config.ts` (or `next.config.js`)
- Create/update: `.env.local`

**Step 1: Allow Shopify image domains in Next.js config**

Read the current `next.config.ts` and add Shopify's CDN domain to the images config. The images come from `cdn.shopify.com`:

```typescript
// Add to next.config.ts images section:
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.shopify.com',
    },
  ],
},
```

**Step 2: Ensure .env.local has the Shopify variables**

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=posted-hawaii.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<token from Task 0>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds (may fail on Shopify fetch if token not set — that's expected for CI, works locally)

**Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: add Shopify CDN to Next.js image domains"
```

---

### Task 11: End-to-End Smoke Test

**No new files. Verify the full flow works.**

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Test product listing**

- Visit `http://localhost:3000/shop`
- Verify products load from Shopify (names, prices, images)
- Verify category filter works
- Click a product → verify product detail page loads

**Step 3: Test add to cart**

- On product detail page, select size/color
- Click "Add to Bag"
- Verify button shows "Adding..." then resets
- Verify navbar cart badge shows count

**Step 4: Test cart page**

- Click cart icon in navbar → verify `/cart` page loads
- Verify line items show with correct info
- Test quantity +/- buttons
- Test "Remove" button
- Verify subtotal updates

**Step 5: Test checkout redirect**

- Click "Checkout" on cart page
- Verify redirect to Shopify checkout with correct items
- Do NOT complete a real purchase — just verify the checkout page loads with the right products

**Step 6: Test drops page**

- Visit `http://localhost:3000/drops`
- Verify drops still render correctly (they use local DROPS data, not Shopify)

**Step 7: Commit any fixes, then push**

```bash
git push origin main
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 0 | Shopify store setup (manual) | — |
| 1 | Shopify API client + types | `lib/shopify.ts`, `lib/shopify-types.ts` |
| 2 | CartProvider context | `components/cart/CartProvider.tsx` |
| 3 | Wire CartProvider, remove Snipcart | `app/layout.tsx` |
| 4 | Navbar cart button | `components/layout/Navbar.tsx` |
| 5 | Shop page + ProductCard | `app/shop/page.tsx`, `components/shop/ShopGrid.tsx`, `components/shop/ProductCard.tsx` |
| 6 | Product detail page | `app/shop/[slug]/page.tsx`, `components/shop/ProductDetail.tsx` |
| 7 | Cart page | `app/cart/page.tsx` |
| 8 | LookbookDrawer | `components/home/LookbookDrawer.tsx` |
| 9 | Delete old Snipcart/Printify code | Multiple deletions |
| 10 | Next.js config + env vars | `next.config.ts`, `.env.local` |
| 11 | End-to-end smoke test | — |
