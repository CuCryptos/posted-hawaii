import { NextRequest, NextResponse } from 'next/server'
import { createOrder, type PrintifyAddress, type PrintifyOrderLineItem } from '@/lib/printify'

type SnipcartItem = {
  id: string
  uniqueId: string
  name: string
  price: number
  quantity: number
  customFields?: { name: string; value: string }[]
}

type SnipcartOrder = {
  token: string
  invoiceNumber: string
  email: string
  items: SnipcartItem[]
  billingAddress: {
    fullName: string
    address1: string
    address2?: string
    city: string
    province: string
    country: string
    postalCode: string
    phone?: string
  }
  shippingAddress: {
    fullName: string
    address1: string
    address2?: string
    city: string
    province: string
    country: string
    postalCode: string
    phone?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Snipcart sends different event types
    if (body.eventName !== 'order.completed') {
      return NextResponse.json({ ok: true })
    }

    const order: SnipcartOrder = body.content

    // Map Snipcart items → Printify line items
    // Each Snipcart item needs customFields with printify_product_id and printify_variant_id
    const lineItems: PrintifyOrderLineItem[] = order.items.map((item) => {
      const productId = item.customFields?.find((f) => f.name === 'printify_product_id')?.value
      const variantId = item.customFields?.find((f) => f.name === 'printify_variant_id')?.value

      if (!productId || !variantId) {
        throw new Error(`Missing Printify IDs for item: ${item.name}`)
      }

      return {
        product_id: productId,
        variant_id: Number(variantId),
        quantity: item.quantity,
      }
    })

    // Parse shipping address
    const ship = order.shippingAddress
    const [firstName, ...lastParts] = ship.fullName.split(' ')
    const address: PrintifyAddress = {
      first_name: firstName,
      last_name: lastParts.join(' ') || firstName,
      email: order.email,
      phone: ship.phone || '',
      country: ship.country,
      region: ship.province,
      address1: ship.address1,
      address2: ship.address2,
      city: ship.city,
      zip: ship.postalCode,
    }

    const printifyOrder = await createOrder(lineItems, address)

    console.log(`Printify order created: ${printifyOrder.id} for Snipcart #${order.invoiceNumber}`)

    return NextResponse.json({ ok: true, printifyOrderId: printifyOrder.id })
  } catch (error) {
    console.error('Snipcart webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}
