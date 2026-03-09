const PRINTIFY_BASE = 'https://api.printify.com/v1'

function headers() {
  return {
    Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

function shopId() {
  const id = process.env.PRINTIFY_SHOP_ID
  if (!id) throw new Error('PRINTIFY_SHOP_ID is not set')
  return id
}

// ---- Types ----

export type PrintifyVariant = {
  id: number
  title: string
  sku: string
  cost: number
  price: number
  is_enabled: boolean
  is_available: boolean
  options: number[]
}

export type PrintifyImage = {
  src: string
  variant_ids: number[]
  position: string
  is_default: boolean
}

export type PrintifyProduct = {
  id: string
  title: string
  description: string
  tags: string[]
  variants: PrintifyVariant[]
  images: PrintifyImage[]
  created_at: string
  updated_at: string
  visible: boolean
  is_locked: boolean
  blueprint_id: number
  print_provider_id: number
  print_areas: unknown[]
}

export type PrintifyOrderLineItem = {
  product_id: string
  variant_id: number
  quantity: number
}

export type PrintifyAddress = {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  region: string
  address1: string
  address2?: string
  city: string
  zip: string
}

// ---- API Methods ----

export async function getProducts(): Promise<PrintifyProduct[]> {
  const res = await fetch(`${PRINTIFY_BASE}/shops/${shopId()}/products.json`, {
    headers: headers(),
    next: { revalidate: 300 }, // cache for 5 minutes
  })
  if (!res.ok) throw new Error(`Printify API error: ${res.status}`)
  const data = await res.json()
  return data.data
}

export async function getProduct(productId: string): Promise<PrintifyProduct> {
  const res = await fetch(
    `${PRINTIFY_BASE}/shops/${shopId()}/products/${productId}.json`,
    { headers: headers(), next: { revalidate: 300 } }
  )
  if (!res.ok) throw new Error(`Printify API error: ${res.status}`)
  return res.json()
}

export async function createOrder(
  lineItems: PrintifyOrderLineItem[],
  address: PrintifyAddress
) {
  const res = await fetch(
    `${PRINTIFY_BASE}/shops/${shopId()}/orders.json`,
    {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        external_id: `posted-${Date.now()}`,
        label: 'POSTED HAWAI\u02BBI Order',
        line_items: lineItems,
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: address,
      }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify order error: ${res.status} — ${err}`)
  }
  return res.json()
}

export async function getShippingRates(
  lineItems: PrintifyOrderLineItem[],
  address: Pick<PrintifyAddress, 'country' | 'region' | 'zip'>
) {
  const res = await fetch(
    `${PRINTIFY_BASE}/shops/${shopId()}/orders/shipping.json`,
    {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        line_items: lineItems,
        address_to: address,
      }),
    }
  )
  if (!res.ok) throw new Error(`Printify shipping error: ${res.status}`)
  return res.json()
}
