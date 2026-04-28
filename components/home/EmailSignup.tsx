'use client'

import { useState } from 'react'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          company,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to save your signup right now.')
      }

      setEmail('')
      setSubmitted(true)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to save your signup right now.'
      )
    } finally {
      setSubmitting(false)
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
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="flex-1 bg-white/20 text-cream placeholder-cream/50 px-6 py-4 font-body text-base border-0 focus:outline-none focus:ring-2 focus:ring-cream/30 rounded-none"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-asphalt text-cream px-6 py-4 font-display font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors"
              >
                {submitting ? '...' : '\u2192'}
              </button>
            </form>
            <p className="font-body text-sm text-cream/60 mt-4">
              No spam. Just drops.
            </p>
            {error && (
              <p className="font-body text-sm text-cream mt-3">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
