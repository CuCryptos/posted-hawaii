import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

const ADMIN_API_VERSION = '2024-10'

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  const domain = getRequiredEnv('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN')
  const adminToken = getRequiredEnv('SHOPIFY_ADMIN_TOKEN')

  const response = await fetch(
    `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}

function printCheck(label: string, passed: boolean, detail: string) {
  const prefix = passed ? 'PASS' : 'FAIL'
  console.log(`${prefix} ${label}: ${detail}`)
}

async function main() {
  const expectedMetaobjectType = process.env.SHOPIFY_LAUNCH_METAOBJECT_TYPE?.trim() || 'launch'
  const domain = getRequiredEnv('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN')

  console.log(`Checking Shopify Admin API for ${domain}`)
  console.log('')

  let accessScopes: string[] = []

  try {
    const data = await shopifyAdminFetch<{
      shop: {
        name: string
        myshopifyDomain: string
      }
      appInstallation: {
        accessScopes: { handle: string }[]
      }
    }>({
      query: `
        query AdminHealthcheck {
          shop {
            name
            myshopifyDomain
          }
          appInstallation {
            accessScopes {
              handle
            }
          }
        }
      `,
    })

    accessScopes = data.appInstallation.accessScopes.map((scope) => scope.handle)

    printCheck('Admin token', true, 'authenticated successfully')
    printCheck(
      'Store match',
      data.shop.myshopifyDomain === domain,
      `${data.shop.name} (${data.shop.myshopifyDomain})`
    )
    console.log('')
  } catch (error) {
    printCheck(
      'Admin token',
      false,
      error instanceof Error ? error.message : String(error)
    )
    process.exit(1)
  }

  const requiredScopes = ['write_metaobjects', 'read_products', 'read_files']
  const recommendedScopes = ['read_metaobjects']

  for (const scope of requiredScopes) {
    printCheck(
      `Scope ${scope}`,
      accessScopes.includes(scope),
      accessScopes.includes(scope) ? 'granted' : 'missing'
    )
  }

  for (const scope of recommendedScopes) {
    printCheck(
      `Scope ${scope}`,
      accessScopes.includes(scope),
      accessScopes.includes(scope) ? 'granted' : 'recommended but missing'
    )
  }

  console.log('')

  try {
    const data = await shopifyAdminFetch<{
      products: {
        nodes: { handle: string }[]
      }
      files: {
        nodes: { id: string }[]
      }
      metaobjects: {
        nodes: { handle: string }[]
      }
    }>({
      query: `
        query LaunchCapabilityCheck($type: String!) {
          products(first: 1) {
            nodes {
              handle
            }
          }
          files(first: 1, query: "media_type:IMAGE") {
            nodes {
              id
            }
          }
          metaobjects(type: $type, first: 1) {
            nodes {
              handle
            }
          }
        }
      `,
      variables: {
        type: expectedMetaobjectType,
      },
    })

    printCheck(
      'Products access',
      true,
      data.products.nodes[0]?.handle || 'query succeeded'
    )
    printCheck(
      'Files access',
      true,
      data.files.nodes.length > 0 ? 'image file query succeeded' : 'query succeeded but no files found'
    )
    printCheck(
      `Metaobjects access (${expectedMetaobjectType})`,
      true,
      data.metaobjects.nodes.length > 0
        ? `found ${data.metaobjects.nodes.length} entry/entries`
        : 'query succeeded but no entries found'
    )
  } catch (error) {
    printCheck(
      'Capability check',
      false,
      error instanceof Error ? error.message : String(error)
    )
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
