import { NextRequest, NextResponse } from 'next/server'
import { Bus } from '@/lib/quine-bus'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Daily Quine bus heartbeat.
 *
 * Scheduled by `vercel.json` at 15:30 UTC (05:30 HST), so it always lands
 * before the bus's 06:00 HST digest cut. Vercel signs cron requests with
 * the platform-issued CRON_SECRET; we reject anything else to keep the
 * route from being scraped publicly.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const checks = {
    storefront_responsive: Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN),
    printify_api: Boolean(process.env.PRINTIFY_API_TOKEN),
    shopify_api: Boolean(process.env.SHOPIFY_ADMIN_TOKEN),
  }

  try {
    const bus = Bus.fromEnv('vercel:scheduled-task:posted-hawaii')
    const result = await bus.emit({
      event_type: 'posted-hawaii.service.health',
      severity: 'info',
      payload: {
        status: 'ok',
        checks,
      },
    })
    return NextResponse.json({ ok: true, event_id: result.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('cron/health: bus emit failed', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
