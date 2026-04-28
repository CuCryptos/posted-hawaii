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

const PRODUCTS_PAGE_SIZE = 50

type ShopifyProductConnection = {
  edges: { node: ShopifyProduct }[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

type ShopifyProductHandleConnection = {
  edges: { node: { handle: string } }[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

function escapeSearchValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

async function getProductsPage({
  after,
  query,
  first = PRODUCTS_PAGE_SIZE,
  fragment,
}: {
  after?: string | null
  query?: string
  first?: number
  fragment: string
}) {
  const data = await shopifyFetch<{
    products: ShopifyProductConnection
  }>({
    query: `
      query ProductsPage($after: String, $first: Int!, $query: String) {
        products(first: $first, sortKey: TITLE, after: $after, query: $query) {
          edges {
            node {
              ...ProductCardFields
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
      ${fragment}
    `,
    variables: {
      after: after ?? null,
      first,
      query,
    },
  })

  return data.products
}

async function getAllProducts(query?: string): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = []
  let after: string | null = null
  let hasNextPage = true

  while (hasNextPage) {
    const page = await getProductsPage({
      after,
      query,
      fragment: PRODUCT_CARD_FRAGMENT,
    })
    products.push(...page.edges.map((edge) => edge.node))
    hasNextPage = page.pageInfo.hasNextPage
    after = page.pageInfo.endCursor
  }

  return products
}

async function getProductHandlesPage(after?: string | null) {
  const data = await shopifyFetch<{
    products: ShopifyProductHandleConnection
  }>({
    query: `
      query ProductHandles($after: String, $first: Int!) {
        products(first: $first, sortKey: TITLE, after: $after) {
          edges {
            node {
              handle
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: {
      after: after ?? null,
      first: PRODUCTS_PAGE_SIZE,
    },
  })

  return data.products
}

// ---------- Product Queries ----------

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFields on Product {
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
    images(first: 2) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
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

const PRODUCT_DETAIL_FRAGMENT = `
  fragment ProductDetailFields on Product {
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
  return getAllProducts()
}

export async function getProductsByTag(tag: string): Promise<ShopifyProduct[]> {
  return getAllProducts(`tag:"${escapeSearchValue(tag)}"`)
}

export async function getProductHandles(): Promise<string[]> {
  const handles: string[] = []
  let after: string | null = null
  let hasNextPage = true

  while (hasNextPage) {
    const page = await getProductHandlesPage(after)

    handles.push(...page.edges.map((edge) => edge.node.handle))
    hasNextPage = page.pageInfo.hasNextPage
    after = page.pageInfo.endCursor
  }

  return handles
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    productByHandle: ShopifyProduct | null
  }>({
    query: `
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductDetailFields
        }
      }
      ${PRODUCT_DETAIL_FRAGMENT}
    `,
    variables: { handle },
  })
  return data.productByHandle
}

async function getProductCardByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    productByHandle: ShopifyProduct | null
  }>({
    query: `
      query ProductCardByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductCardFields
        }
      }
      ${PRODUCT_CARD_FRAGMENT}
    `,
    variables: { handle },
  })

  return data.productByHandle
}

export async function getProductsByHandles(
  handles: string[]
): Promise<ShopifyProduct[]> {
  const uniqueHandles = Array.from(new Set(handles.map((handle) => handle.trim()).filter(Boolean)))
  const products = await Promise.all(
    uniqueHandles.map((handle) => getProductCardByHandle(handle))
  )

  return products.filter((product): product is ShopifyProduct => product !== null)
}

export async function getRelatedProducts({
  productType,
  excludeHandle,
  limit = 4,
}: {
  productType: string
  excludeHandle: string
  limit?: number
}): Promise<ShopifyProduct[]> {
  const page = await getProductsPage({
    query: `product_type:"${escapeSearchValue(productType)}"`,
    first: limit + 1,
    fragment: PRODUCT_CARD_FRAGMENT,
  })

  return page.edges
    .map((edge) => edge.node)
    .filter((product) => product.handle !== excludeHandle)
    .slice(0, limit)
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
