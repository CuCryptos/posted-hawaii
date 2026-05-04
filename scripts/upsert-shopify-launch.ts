import path from 'node:path'
import process from 'node:process'
import dotenv from 'dotenv'
import { LAUNCHES } from '@/lib/launches'
import { Bus } from '@/lib/quine-bus'

dotenv.config({ path: '.env.local' })
dotenv.config()

const ADMIN_API_VERSION = '2024-10'

type ShopifyAdminUserError = {
  field?: string[] | null
  message: string
}

type ShopifyProductNode = {
  id: string
  handle: string
}

type ShopifyFileNode = {
  id: string
  alt: string | null
  image: {
    url: string
  } | null
}

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
    throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}

function basenameFromLaunchImage(src: string) {
  return path.posix.basename(src)
}

async function getProductsByHandles(handles: string[]) {
  const uniqueHandles = Array.from(new Set(handles))
  const products = await Promise.all(
    uniqueHandles.map(async (handle) => {
      const data = await shopifyAdminFetch<{
        products: {
          nodes: ShopifyProductNode[]
        }
      }>({
        query: `
          query ProductByHandle($query: String!) {
            products(first: 1, query: $query) {
              nodes {
                id
                handle
              }
            }
          }
        `,
        variables: {
          query: `handle:${handle}`,
        },
      })

      return data.products.nodes[0] ?? null
    })
  )

  return products.filter((product): product is ShopifyProductNode => product !== null)
}

async function getShopifyImageFiles() {
  const data = await shopifyAdminFetch<{
    files: {
      nodes: Array<
        | ({
            __typename: 'MediaImage'
          } & ShopifyFileNode)
        | {
            __typename: string
          }
      >
    }
  }>({
    query: `
      query LaunchImages {
        files(first: 100, query: "media_type:IMAGE") {
          nodes {
            __typename
            ... on MediaImage {
              id
              alt
              image {
                url
              }
            }
          }
        }
      }
    `,
  })

  return data.files.nodes.filter(
    (node): node is { __typename: 'MediaImage' } & ShopifyFileNode =>
      node.__typename === 'MediaImage'
  )
}

function resolveImageIdsFromEnv() {
  const explicitIds = process.env.SHOPIFY_LAUNCH_LOOKBOOK_IMAGE_IDS?.trim()
  if (!explicitIds) return []

  return explicitIds
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

async function resolveLookbookImageIds(imageSrcs: string[]) {
  const explicitIds = resolveImageIdsFromEnv()
  if (explicitIds.length > 0) {
    return { imageIds: explicitIds, missingBasenames: [] as string[] }
  }

  const shopifyFiles = await getShopifyImageFiles()
  const fileMap = new Map<string, string>()

  for (const file of shopifyFiles) {
    const url = file.image?.url
    if (!url) continue
    const basename = path.posix.basename(new URL(url).pathname)
    if (!fileMap.has(basename)) {
      fileMap.set(basename, file.id)
    }
  }

  const imageIds: string[] = []
  const missingBasenames: string[] = []

  for (const src of imageSrcs) {
    const basename = basenameFromLaunchImage(src)
    const matchedId = fileMap.get(basename)

    if (matchedId) {
      imageIds.push(matchedId)
    } else {
      missingBasenames.push(basename)
    }
  }

  return { imageIds, missingBasenames }
}

function buildFieldInput({
  key,
  value,
}: {
  key: string
  value: string | undefined
}) {
  if (!value) return null
  return { key, value }
}

async function main() {
  const slug = process.argv[2]?.trim() || 'drop-001-posted-up'
  const launchType = process.env.SHOPIFY_LAUNCH_METAOBJECT_TYPE?.trim() || 'launch'

  const launch = LAUNCHES.find((entry) => entry.slug === slug)

  if (!launch) {
    throw new Error(`No local launch seed found for slug: ${slug}`)
  }

  const featuredHandles = launch.merchandising?.featuredProductHandles ?? []
  const featuredProducts = await getProductsByHandles(featuredHandles)
  const missingProductHandles = featuredHandles.filter(
    (handle) => !featuredProducts.some((product) => product.handle === handle)
  )

  if (missingProductHandles.length > 0) {
    throw new Error(
      `Could not resolve Shopify products for handles: ${missingProductHandles.join(', ')}`
    )
  }

  const { imageIds, missingBasenames } = await resolveLookbookImageIds(
    launch.lookbook.images.map((image) => image.src)
  )

  const fields = [
    buildFieldInput({ key: 'name', value: launch.name }),
    buildFieldInput({ key: 'full_name', value: launch.fullName }),
    buildFieldInput({ key: 'collection', value: launch.collection }),
    buildFieldInput({ key: 'description', value: launch.description }),
    buildFieldInput({ key: 'date', value: launch.date }),
    buildFieldInput({ key: 'status', value: launch.status }),
    buildFieldInput({ key: 'tag', value: launch.tag }),
    buildFieldInput({ key: 'lookbook_title', value: launch.lookbook.title }),
    buildFieldInput({ key: 'lookbook_subtitle', value: launch.lookbook.subtitle }),
    buildFieldInput({
      key: 'lookbook_description',
      value: launch.lookbook.description,
    }),
    imageIds.length > 0
      ? buildFieldInput({
          key: 'lookbook_images',
          value: JSON.stringify(imageIds),
        })
      : null,
    featuredProducts.length > 0
      ? buildFieldInput({
          key: 'featured_products',
          value: JSON.stringify(featuredProducts.map((product) => product.id)),
        })
      : null,
    buildFieldInput({
      key: 'cta_label',
      value: launch.merchandising?.ctaLabel,
    }),
    buildFieldInput({
      key: 'cta_href',
      value: launch.merchandising?.ctaHref,
    }),
  ].filter((field): field is { key: string; value: string } => field !== null)

  const data = await shopifyAdminFetch<{
    metaobjectUpsert: {
      metaobject: {
        id: string
        handle: string
        type: string
      } | null
      userErrors: ShopifyAdminUserError[]
    }
  }>({
    query: `
      mutation UpsertLaunchMetaobject(
        $handle: MetaobjectHandleInput!
        $metaobject: MetaobjectUpsertInput!
      ) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
          metaobject {
            id
            handle
            type
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      handle: {
        type: launchType,
        handle: launch.slug,
      },
      metaobject: {
        fields,
      },
    },
  })

  if (data.metaobjectUpsert.userErrors.length > 0) {
    throw new Error(
      data.metaobjectUpsert.userErrors.map((error) => error.message).join(', ')
    )
  }

  if (!data.metaobjectUpsert.metaobject) {
    throw new Error('Shopify did not return an upserted launch metaobject')
  }

  console.log(
    `Upserted ${data.metaobjectUpsert.metaobject.type}:${data.metaobjectUpsert.metaobject.handle}`
  )

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://postedhi.com'
  const launchUrl = `${siteUrl}/drops/${data.metaobjectUpsert.metaobject.handle}`

  if (process.env.QUINE_BUS_URL && process.env.QUINE_BUS_KEY) {
    try {
      const bus = Bus.fromEnv('cli:script:posted-hawaii')
      const emitted = await bus.emit({
        event_type: 'posted.content.published',
        severity: 'info',
        payload: {
          listing_id: data.metaobjectUpsert.metaobject.id,
          platform: 'shopify',
          url: launchUrl,
          metaobject_type: data.metaobjectUpsert.metaobject.type,
          handle: data.metaobjectUpsert.metaobject.handle,
        },
      })
      console.log(`Emitted posted.content.published to Quine bus: ${emitted.id}`)
    } catch (error) {
      console.warn(
        `Quine bus emit failed (non-fatal): ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  if (missingBasenames.length > 0) {
    console.warn('')
    console.warn('Missing Shopify image files for:')
    for (const basename of missingBasenames) {
      console.warn(`- ${basename}`)
    }
    console.warn(
      'Upload those images to Shopify Files and rerun, or set SHOPIFY_LAUNCH_LOOKBOOK_IMAGE_IDS with MediaImage GIDs.'
    )
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
