'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
                  <label className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-transparent border border-asphalt/20 font-display text-[13px] text-asphalt placeholder:text-asphalt/30 focus:outline-none focus:border-coral transition-colors"
                  />
                </div>
                <div>
                  <label className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-transparent border border-asphalt/20 font-display text-[13px] text-asphalt placeholder:text-asphalt/30 focus:outline-none focus:border-coral transition-colors"
                  />
                </div>
                <div>
                  <label className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-transparent border border-asphalt/20 font-display text-[13px] text-asphalt placeholder:text-asphalt/30 focus:outline-none focus:border-coral transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-coral text-white font-display font-bold text-[11px] uppercase tracking-widest py-4 hover:bg-coral/90 transition-colors"
                >
                  Send
                </button>
              </form>
            )}

            <div className="mt-16 pt-8 border-t border-asphalt/10">
              <p className="font-display font-bold text-[11px] uppercase tracking-widest text-asphalt">
                Email
              </p>
              <p className="font-body text-[14px] text-asphalt/60 mt-1">
                hello@postedhi.com
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
