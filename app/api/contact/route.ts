import { NextRequest, NextResponse } from 'next/server'
import { saveContactInquiry } from '@/lib/contact'

export const runtime = 'nodejs'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const company = typeof body.company === 'string' ? body.company.trim() : ''

    if (company) {
      return NextResponse.json({ ok: true })
    }

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json(
        { ok: false, error: 'Enter your name.' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Enter a valid email address.' },
        { status: 400 }
      )
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { ok: false, error: 'Message must be between 10 and 2000 characters.' },
        { status: 400 }
      )
    }

    await saveContactInquiry({ name, email, message })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact submission failed', error)
    return NextResponse.json(
      { ok: false, error: 'Unable to send your message right now.' },
      { status: 500 }
    )
  }
}
