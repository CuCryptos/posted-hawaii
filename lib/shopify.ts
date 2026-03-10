import type {
  ShopifyProduct,
  ShopifyCart,
} from './shopify-types'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}

// ---------- Product Queries ----------

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    productType
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`

export async function getProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: `
      query Products {
        products(first: 50, sortKey: TITLE) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
  })
  return data.products.edges.map((e) => e.node)
}

export async function getProductsByTag(tag: string): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: `
      query ProductsByTag($query: String!) {
        products(first: 50, sortKey: TITLE, query: $query) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { query: `tag:"${tag}"` },
  })
  return data.products.edges.map((e) => e.node)
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    productByHandle: ShopifyProduct | null
  }>({
    query: `
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductFields
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { handle },
  })
  return data.productByHandle
}

// ---------- Cart Mutations ----------

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                handle
                title
              }
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartCreate {
        cartCreate {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
  })
  return data.cartCreate.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{
    cart: ShopifyCart | null
  }>({
    query: `
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId },
  })
  return data.cart
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  })
  return data.cartLinesAdd.cart
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  })
  return data.cartLinesUpdate.cart
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart }
  }>({
    query: `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  })
  return data.cartLinesRemove.cart
}
