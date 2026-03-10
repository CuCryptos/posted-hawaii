'use client'

import { useState } from 'react'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log('Email signup:', email)
      setSubmitted(true)
    }
  }

  return (
    <section className="bg-coral py-20 md:py-24">
      <div className="max-w-xl mx-auto text-center px-6">
        {submitted ? (
          <p className="font-display font-black text-xl md:text-2xl uppercase text-cream tracking-tight">
            You&apos;re in.
          </p>
        ) : (
          <>
            <h2 className="font-display font-black text-xl md:text-2xl uppercase text-cream tracking-tight">
              GET FIRST ACCESS TO DROPS
            </h2>
            <form onSubmit={handleSubmit} className="mt-8 flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/20 text-cream placeholder-cream/50 px-6 py-4 font-body text-base border-0 focus:outline-none focus:ring-2 focus:ring-cream/30 rounded-none"
              />
              <button
                type="submit"
                className="bg-asphalt text-cream px-6 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors"
              >
                &rarr;
              </button>
            </form>
            <p className="font-body text-sm text-cream/60 mt-4">
              No spam. Just drops.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
