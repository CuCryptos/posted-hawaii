'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          company,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to send your message right now.')
      }

      setName('')
      setEmail('')
      setMessage('')
      setCompany('')
      setSubmitted(true)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to send your message right now.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <PageHero title="Contact" subtitle="Questions, collabs, wholesale — we're all ears." />
        <Container className="py-10 lg:py-12">
          <div className="max-w-lg">
            {submitted ? (
              <div className="p-8 border border-asphalt/10">
                <p className="font-display font-bold text-[13px] uppercase tracking-widest text-coral">
                  Message sent.
                </p>
                <p className="font-body text-[14px] text-asphalt/60 mt-2">
                  We&apos;ll get back to you soon. Mahalo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt block mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-transparent border border-asphalt/20 font-display text-[13px] text-asphalt placeholder:text-asphalt/30 focus:outline-none focus:border-coral transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt block mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-transparent border border-asphalt/20 font-display text-[13px] text-asphalt placeholder:text-asphalt/30 focus:outline-none focus:border-coral transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt block mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-asphalt/20 font-display text-[13px] text-asphalt placeholder:text-asphalt/30 focus:outline-none focus:border-coral transition-colors resize-none"
                  />
                </div>
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
                  className="w-full bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-4 hover:bg-coral/90 transition-colors"
                >
                  {submitting ? 'Sending...' : 'Send'}
                </button>
                {error && (
                  <p className="font-body text-[14px] text-lava">
                    {error}
                  </p>
                )}
              </form>
            )}

            <div className="mt-16 pt-8 border-t border-asphalt/10">
              <p className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt">
                Email
              </p>
              <p className="font-body text-[14px] text-asphalt/60 mt-1">
                info@postedhi.com
              </p>

              <p className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt mt-6">
                Follow
              </p>
              <div className="flex gap-4 mt-1">
                <a href="https://instagram.com/postedhawaii" className="font-body text-[14px] text-asphalt/60 hover:text-coral transition-colors">
                  Instagram
                </a>
                <a href="https://tiktok.com/@postedhawaii" className="font-body text-[14px] text-asphalt/60 hover:text-coral transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
