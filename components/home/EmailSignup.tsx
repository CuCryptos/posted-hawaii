'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="py-10 lg:py-12 bg-asphalt">
      <Container>
        {submitted ? (
          <p className="font-display font-bold text-[11px] uppercase tracking-widest text-coral text-center">
            You&apos;re in. We&apos;ll be in touch.
          </p>
        ) : (
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-white">
              Join the crew.
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 lg:w-64 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-display text-[11px] uppercase tracking-wider focus:outline-none focus:border-coral transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest hover:bg-coral/90 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </Container>
    </section>
  )
}
