import 'server-only'

const ADMIN_API_VERSION = '2024-10'
const CONTACT_TAG = 'contact-form'
const NEWSLETTER_TAG = 'newsletter'
const SITE_TAG = 'posted-site'

type ShopifyAdminUserError = {
  field?: string[] | null
  message: string
}

type ShopifyCustomerRecord = {
  id: string
  tags: string[]
  note: string | null
}

function getAdminConfig() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const adminToken = process.env.SHOPIFY_ADMIN_TOKEN

  if (!domain || !adminToken) {
    throw new Error('Missing Shopify Admin API configuration')
  }

  return { domain, adminToken }
}

async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  const { domain, adminToken } = getAdminConfig()

  const response = await fetch(
    `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      cache: 'no-store',
      body: JSON.stringify({ query, variables }),
    }
  )

  if (!response.ok) {
    throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}

function mergeTags(existingTags: string[], newTags: string[]) {
  return Array.from(new Set([...existingTags, ...newTags]))
}

function splitName(name: string) {
  const trimmed = name.trim()
  if (!trimmed) {
    return { firstName: '', lastName: '' }
  }

  const parts = trimmed.split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

function formatContactNote({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  return [
    `[${new Date().toISOString()}] Contact form submission`,
    `Name: ${name}`,
    `Email: ${email}`,
    'Message:',
    message,
  ].join('\n')
}

function assertNoUserErrors(errors: ShopifyAdminUserError[]) {
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join(', '))
  }
}

async function findCustomerByEmail(email: string): Promise<ShopifyCustomerRecord | null> {
  const data = await shopifyAdminFetch<{
    customers: { nodes: ShopifyCustomerRecord[] }
  }>({
    query: `
      query FindCustomerByEmail($query: String!) {
        customers(first: 1, query: $query) {
          nodes {
            id
            note
            tags
          }
        }
      }
    `,
    variables: { query: `email:${email}` },
  })

  return data.customers.nodes[0] ?? null
}

async function createCustomer(input: {
  email: string
  firstName?: string
  lastName?: string
  note?: string
  tags?: string[]
  emailMarketingConsent?: {
    marketingState: 'PENDING' | 'SUBSCRIBED' | 'NOT_SUBSCRIBED' | 'UNSUBSCRIBED'
    marketingOptInLevel: 'CONFIRMED_OPT_IN' | 'SINGLE_OPT_IN' | 'UNKNOWN'
    consentUpdatedAt: string
  }
}) {
  const data = await shopifyAdminFetch<{
    customerCreate: {
      customer: { id: string } | null
      userErrors: ShopifyAdminUserError[]
    }
  }>({
    query: `
      mutation CustomerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: { input },
  })

  assertNoUserErrors(data.customerCreate.userErrors)

  if (!data.customerCreate.customer) {
    throw new Error('Failed to create Shopify customer')
  }

  return data.customerCreate.customer
}

async function updateCustomer(input: {
  id: string
  firstName?: string
  lastName?: string
  note?: string
  tags?: string[]
}) {
  const data = await shopifyAdminFetch<{
    customerUpdate: {
      customer: { id: string } | null
      userErrors: ShopifyAdminUserError[]
    }
  }>({
    query: `
      mutation CustomerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: { input },
  })

  assertNoUserErrors(data.customerUpdate.userErrors)

  if (!data.customerUpdate.customer) {
    throw new Error('Failed to update Shopify customer')
  }

  return data.customerUpdate.customer
}

async function updateCustomerEmailMarketingConsent(customerId: string) {
  const consentUpdatedAt = new Date().toISOString()

  const data = await shopifyAdminFetch<{
    customerEmailMarketingConsentUpdate: {
      customer: { id: string } | null
      userErrors: ShopifyAdminUserError[]
    }
  }>({
    query: `
      mutation CustomerEmailMarketingConsentUpdate(
        $input: CustomerEmailMarketingConsentUpdateInput!
      ) {
        customerEmailMarketingConsentUpdate(input: $input) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        customerId,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
          consentUpdatedAt,
        },
      },
    },
  })

  assertNoUserErrors(data.customerEmailMarketingConsentUpdate.userErrors)

  if (!data.customerEmailMarketingConsentUpdate.customer) {
    throw new Error('Failed to update email marketing consent')
  }
}

export async function addShopifyNewsletterSubscriber(email: string) {
  const existingCustomer = await findCustomerByEmail(email)

  if (existingCustomer) {
    const tags = mergeTags(existingCustomer.tags, [NEWSLETTER_TAG, SITE_TAG])

    if (tags.length !== existingCustomer.tags.length) {
      await updateCustomer({
        id: existingCustomer.id,
        tags,
      })
    }

    await updateCustomerEmailMarketingConsent(existingCustomer.id)
    return { created: false }
  }

  await createCustomer({
    email,
    tags: [NEWSLETTER_TAG, SITE_TAG],
    emailMarketingConsent: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
      consentUpdatedAt: new Date().toISOString(),
    },
  })

  return { created: true }
}

export async function saveShopifyContactInquiry(input: {
  name: string
  email: string
  message: string
}) {
  const existingCustomer = await findCustomerByEmail(input.email)
  const tags = mergeTags(existingCustomer?.tags ?? [], [CONTACT_TAG, SITE_TAG])
  const note = formatContactNote(input)

  if (existingCustomer) {
    await updateCustomer({
      id: existingCustomer.id,
      note: existingCustomer.note ? `${note}\n\n---\n\n${existingCustomer.note}` : note,
      tags,
    })

    return { created: false }
  }

  const { firstName, lastName } = splitName(input.name)

  await createCustomer({
    email: input.email,
    firstName,
    lastName,
    note,
    tags,
  })

  return { created: true }
}
