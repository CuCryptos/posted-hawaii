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
