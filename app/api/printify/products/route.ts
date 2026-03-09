import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/printify'

export async function GET() {
  try {
    const products = await getProducts()
    // Only return visible/published products
    const visible = products.filter((p) => p.visible)
    return NextResponse.json(visible)
  } catch (error) {
    console.error('Failed to fetch Printify products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
