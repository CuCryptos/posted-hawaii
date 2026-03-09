import { NextRequest, NextResponse } from 'next/server'

// Snipcart validates products by fetching this URL before adding to cart.
// It checks that the price and product info match what's on your site.
// Return the product JSON that matches the Snipcart button attributes.

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  // Fetch the product page to let Snipcart validate the price
  // In production, you'd look up the product in your database instead
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}${url}`)

  if (!res.ok) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const html = await res.text()
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
