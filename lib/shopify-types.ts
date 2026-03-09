// Shopify Storefront API response types

export type ShopifyImage = {
  url: string
  altText: string | null
  width: number
  height: number
}

export type ShopifyPrice = {
  amount: string
  currencyCode: string
}

export type ShopifyProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyPrice
  selectedOptions: { name: string; value: string }[]
  image: ShopifyImage | null
}

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  productType: string
  tags: string[]
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ShopifyProductVariant }[] }
  priceRange: {
    minVariantPrice: ShopifyPrice
  }
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      handle: string
      title: string
    }
    image: ShopifyImage | null
    price: ShopifyPrice
    selectedOptions: { name: string; value: string }[]
  }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyPrice
    totalAmount: ShopifyPrice
    totalTaxAmount: ShopifyPrice | null
  }
  lines: { edges: { node: ShopifyCartLine }[] }
}
