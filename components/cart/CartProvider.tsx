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
  initializing: boolean
  error: string | null
  pendingTarget: string | null
  clearError: () => void
  addToCart: (variantId: string, quantity?: number) => Promise<boolean>
  updateQuantity: (lineId: string, quantity: number) => Promise<boolean>
  removeItem: (lineId: string) => Promise<boolean>
}

const CartContext = createContext<CartContextType | null>(null)

const CART_ID_KEY = 'posted-cart-id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingTarget, setPendingTarget] = useState<string | null>(null)

  const clearStoredCartId = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
  }, [])

  const persistCart = useCallback((nextCart: ShopifyCart) => {
    localStorage.setItem(CART_ID_KEY, nextCart.id)
    setCart(nextCart)
  }, [])

  const createAndPersistCart = useCallback(async () => {
    const newCart = await createCart()
    persistCart(newCart)
    return newCart
  }, [persistCart])

  const ensureCart = useCallback(async (): Promise<ShopifyCart> => {
    if (cart) {
      return cart
    }

    const storedCartId = localStorage.getItem(CART_ID_KEY)
    if (storedCartId) {
      try {
        const existingCart = await getCart(storedCartId)
        if (existingCart) {
          persistCart(existingCart)
          return existingCart
        }
      } catch {}

      clearStoredCartId()
    }

    return createAndPersistCart()
  }, [cart, clearStoredCartId, createAndPersistCart, persistCart])

  const runCartMutation = useCallback(
    async (
      target: string,
      action: (currentCart: ShopifyCart) => Promise<ShopifyCart>,
      failureMessage: string
    ) => {
      setLoading(true)
      setPendingTarget(target)
      setError(null)

      try {
        const currentCart = await ensureCart()
        const updatedCart = await action(currentCart)
        persistCart(updatedCart)
        return true
      } catch (mutationError) {
        console.error('Cart mutation failed', mutationError)
        setError(failureMessage)
        return false
      } finally {
        setLoading(false)
        setPendingTarget(null)
      }
    },
    [ensureCart, persistCart]
  )

  useEffect(() => {
    let cancelled = false

    async function initCart() {
      setLoading(true)
      setError(null)

      try {
        const storedCartId = localStorage.getItem(CART_ID_KEY)
        if (storedCartId) {
          try {
            const existingCart = await getCart(storedCartId)
            if (existingCart) {
              if (!cancelled) {
                persistCart(existingCart)
              }
              return
            }
          } catch {}

          clearStoredCartId()
        }

        const initialCart = await createAndPersistCart()
        if (!cancelled) {
          setCart(initialCart)
        }
      } catch (initializationError) {
        console.error('Cart initialization failed', initializationError)
        clearStoredCartId()
        if (!cancelled) {
          setError('Unable to load your bag right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setInitializing(false)
        }
      }
    }

    initCart()

    return () => {
      cancelled = true
    }
  }, [clearStoredCartId, createAndPersistCart, persistCart])

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      return runCartMutation(
        variantId,
        (currentCart) => shopifyAddToCart(currentCart.id, variantId, quantity),
        'Unable to add this item to your bag right now.'
      )
    },
    [runCartMutation]
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      return runCartMutation(
        lineId,
        (currentCart) => {
          if (quantity <= 0) {
            return shopifyRemoveCartLine(currentCart.id, lineId)
          }

          return shopifyUpdateCartLine(currentCart.id, lineId, quantity)
        },
        'Unable to update your bag right now.'
      )
    },
    [runCartMutation]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      return runCartMutation(
        lineId,
        (currentCart) => shopifyRemoveCartLine(currentCart.id, lineId),
        'Unable to remove this item right now.'
      )
    },
    [runCartMutation]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        initializing,
        error,
        pendingTarget,
        clearError,
        addToCart,
        updateQuantity,
        removeItem,
      }}
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
