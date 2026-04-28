import { NextRequest, NextResponse } from 'next/server'
import { addNewsletterSubscriber } from '@/lib/newsletter'

export const runtime = 'nodejs'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const company = typeof body.company === 'string' ? body.company.trim() : ''

    if (company) {
      return NextResponse.json({ ok: true })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Enter a valid email address.' },
        { status: 400 }
      )
    }

    await addNewsletterSubscriber(email)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Newsletter signup failed', error)
    return NextResponse.json(
      { ok: false, error: 'Unable to save your signup right now.' },
      { status: 500 }
    )
  }
}
