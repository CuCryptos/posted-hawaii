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
