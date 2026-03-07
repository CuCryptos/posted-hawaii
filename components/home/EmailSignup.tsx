'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-section bg-asphalt">
      <Container className="text-center">
        <h2 className="font-display font-black text-section uppercase tracking-tight text-white">
          Join the crew.
        </h2>
        <p className="font-body italic text-cream/70 text-lg mt-4 max-w-md mx-auto">
          Be first to know when Drop 001 hits.
        </p>

        {submitted ? (
          <p className="font-display font-bold text-coral text-lg mt-8">
            You&apos;re in. We&apos;ll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-brand bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-display text-sm focus:outline-none focus:border-coral transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-brand bg-coral text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-coral/90 transition-colors"
            >
              Sign Up
            </button>
          </form>
        )}
      </Container>
    </section>
  )
}
