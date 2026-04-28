import { cache } from 'react'

export type LaunchStatus = 'upcoming' | 'live' | 'sold_out'

export type LaunchLookbookImage = {
  src: string
  caption: string
}

export type LaunchLookbook = {
  title: string
  subtitle: string
  description: string
  images: LaunchLookbookImage[]
}

export type LaunchMerchandising = {
  featuredProductHandles?: string[]
  ctaLabel?: string
  ctaHref?: string
}

export type Launch = {
  slug: string
  number: number
  name: string
  fullName: string
  collection: string
  description: string
  date: string
  status: LaunchStatus
  tag: string
  lookbook: LaunchLookbook
  merchandising?: LaunchMerchandising
}

type ShopifyMetaobjectImageRef = {
  __typename: 'MediaImage'
  image: {
    url: string
    altText: string | null
    width: number
    height: number
  } | null
}

type ShopifyMetaobjectProductRef = {
  __typename: 'Product'
  handle: string
}

type ShopifyMetaobjectRef = ShopifyMetaobjectImageRef | ShopifyMetaobjectProductRef

type ShopifyMetaobjectField = {
  key: string
  value: string | null
  reference: ShopifyMetaobjectRef | null
  references: {
    nodes: ShopifyMetaobjectRef[]
  } | null
}

type ShopifyLaunchMetaobject = {
  handle: string
  fields: ShopifyMetaobjectField[]
}

const storefrontDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
const launchMetaobjectType = process.env.SHOPIFY_LAUNCH_METAOBJECT_TYPE || 'launch'

const LOCAL_LAUNCHES: Launch[] = [
  {
    slug: 'drop-001-posted-up',
    number: 1,
    name: 'POSTED UP',
    fullName: 'Drop 001 — POSTED UP',
    collection: 'posted_up',
    description:
      'The first drop. Core everyday pieces for the crew. Heavyweight tees, pullover hoodies, and structured snapbacks — all designed in Honolulu.',
    date: '2026-03-15',
    status: 'live',
    tag: 'drop 001',
    lookbook: {
      title: 'Drop 001',
      subtitle: 'POSTED UP',
      description:
        'The first collection. Heavyweight essentials designed in Honolulu — shot across the south shore and Kakaʻako.',
      images: [
        { src: '/images/hero/homepage-hero.png', caption: 'Kakaʻako, Honolulu' },
        {
          src: '/images/lifestyle/kakaako-hoodie.png',
          caption: 'The Diamond Head Hoodie',
        },
      ],
    },
    merchandising: {
      featuredProductHandles: [
        'the-808-cap',
        'the-808-cap-letterman',
        'the-ala-moana-hoodie',
      ],
      ctaLabel: 'Shop the Drop',
      ctaHref: '/drops/drop-001-posted-up',
    },
  },
]

export const LAUNCHES: Launch[] = LOCAL_LAUNCHES

function isLaunchStatus(value: string | null | undefined): value is LaunchStatus {
  return value === 'upcoming' || value === 'live' || value === 'sold_out'
}

function getField(fields: ShopifyMetaobjectField[], key: string) {
  return fields.find((field) => field.key === key)
}

function getFieldValue(fields: ShopifyMetaobjectField[], key: string) {
  return getField(fields, key)?.value?.trim() || undefined
}

function getFieldImageRefs(fields: ShopifyMetaobjectField[], key: string): LaunchLookbookImage[] {
  const field = getField(fields, key)
  const refs = field?.references?.nodes ?? []

  return refs
    .filter(
      (ref): ref is ShopifyMetaobjectImageRef =>
        ref.__typename === 'MediaImage' && ref.image !== null
    )
    .map((ref, index) => ({
      src: ref.image!.url,
      caption: ref.image!.altText?.trim() || `Launch image ${index + 1}`,
    }))
}

function getFieldProductHandles(fields: ShopifyMetaobjectField[], key: string): string[] {
  const field = getField(fields, key)
  const refs = field?.references?.nodes ?? []

  return refs
    .filter((ref): ref is ShopifyMetaobjectProductRef => ref.__typename === 'Product')
    .map((ref) => ref.handle)
}

async function storefrontMetaobjectFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  if (!storefrontDomain || !storefrontToken) {
    throw new Error('Missing Shopify storefront configuration')
  }

  const response = await fetch(
    `https://${storefrontDomain}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    }
  )

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}

async function getStorefrontLaunchMetaobjects(): Promise<ShopifyLaunchMetaobject[]> {
  const data = await storefrontMetaobjectFetch<{
    metaobjects: {
      nodes: ShopifyLaunchMetaobject[]
    }
  }>({
    query: `
      query LaunchMetaobjects($type: String!, $first: Int!) {
        metaobjects(type: $type, first: $first) {
          nodes {
            handle
            fields {
              key
              value
              reference {
                __typename
                ... on Product {
                  handle
                }
                ... on MediaImage {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              references(first: 20) {
                nodes {
                  __typename
                  ... on Product {
                    handle
                  }
                  ... on MediaImage {
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
          }
        }
      }
    `,
    variables: {
      type: launchMetaobjectType,
      first: 20,
    },
  })

  return data.metaobjects.nodes
}

function parseLaunchMetaobject(
  metaobject: ShopifyLaunchMetaobject,
  fallback?: Launch
): Launch {
  const numberValue = Number.parseInt(getFieldValue(metaobject.fields, 'number') || '', 10)
  const date = getFieldValue(metaobject.fields, 'date') || fallback?.date || ''
  const statusValue = getFieldValue(metaobject.fields, 'status')
  const lookbookImages = getFieldImageRefs(metaobject.fields, 'lookbook_images')
  const featuredProductHandles = getFieldProductHandles(metaobject.fields, 'featured_products')

  return {
    slug: metaobject.handle || fallback?.slug || '',
    number:
      Number.isFinite(numberValue) && numberValue > 0
        ? numberValue
        : fallback?.number || 1,
    name: getFieldValue(metaobject.fields, 'name') || fallback?.name || '',
    fullName:
      getFieldValue(metaobject.fields, 'full_name') ||
      fallback?.fullName ||
      '',
    collection:
      getFieldValue(metaobject.fields, 'collection') || fallback?.collection || '',
    description:
      getFieldValue(metaobject.fields, 'description') || fallback?.description || '',
    date,
    status: isLaunchStatus(statusValue) ? statusValue : fallback?.status || 'upcoming',
    tag: getFieldValue(metaobject.fields, 'tag') || fallback?.tag || '',
    lookbook: {
      title:
        getFieldValue(metaobject.fields, 'lookbook_title') ||
        fallback?.lookbook.title ||
        '',
      subtitle:
        getFieldValue(metaobject.fields, 'lookbook_subtitle') ||
        fallback?.lookbook.subtitle ||
        '',
      description:
        getFieldValue(metaobject.fields, 'lookbook_description') ||
        fallback?.lookbook.description ||
        '',
      images: lookbookImages.length > 0 ? lookbookImages : fallback?.lookbook.images || [],
    },
    merchandising: {
      featuredProductHandles:
        featuredProductHandles.length > 0
          ? featuredProductHandles
          : fallback?.merchandising?.featuredProductHandles,
      ctaLabel:
        getFieldValue(metaobject.fields, 'cta_label') ||
        fallback?.merchandising?.ctaLabel,
      ctaHref:
        getFieldValue(metaobject.fields, 'cta_href') ||
        fallback?.merchandising?.ctaHref,
    },
  }
}

const getResolvedLaunches = cache(async (): Promise<Launch[]> => {
  try {
    const metaobjects = await getStorefrontLaunchMetaobjects()

    if (metaobjects.length === 0) {
      return LOCAL_LAUNCHES
    }

    const localBySlug = new Map(LOCAL_LAUNCHES.map((launch) => [launch.slug, launch]))
    const parsedLaunches = metaobjects
      .map((metaobject) => parseLaunchMetaobject(metaobject, localBySlug.get(metaobject.handle)))
      .filter((launch) => launch.slug && launch.name && launch.tag)

    if (parsedLaunches.length === 0) {
      return LOCAL_LAUNCHES
    }

    return parsedLaunches
  } catch (error) {
    console.warn('Falling back to local launches:', error)
    return LOCAL_LAUNCHES
  }
})

export async function getLaunches(): Promise<Launch[]> {
  return getResolvedLaunches()
}

export async function getLaunchBySlug(slug: string): Promise<Launch | undefined> {
  const launches = await getResolvedLaunches()
  return launches.find((launch) => launch.slug === slug)
}

export async function getLaunchByTag(tag: string): Promise<Launch | undefined> {
  const normalizedTag = tag.trim().toLowerCase()
  const launches = await getResolvedLaunches()
  return launches.find((launch) => launch.tag.toLowerCase() === normalizedTag)
}

export async function getLaunchForProductTags(tags: string[]): Promise<Launch | undefined> {
  const normalizedTags = tags.map((tag) => tag.toLowerCase())
  const launches = await getResolvedLaunches()
  return launches.find((launch) => normalizedTags.includes(launch.tag.toLowerCase()))
}

export function isLaunchLive(launch: Launch): boolean {
  return launch.status === 'live'
}

export function getLaunchMerchandisingHref(launch: Launch): string {
  const explicitHref = launch.merchandising?.ctaHref?.trim()
  if (explicitHref) return explicitHref

  const featuredHandle = launch.merchandising?.featuredProductHandles?.[0]
  if (featuredHandle) return `/shop/${featuredHandle}`

  return `/drops/${launch.slug}`
}

export function getLaunchMerchandisingLabel(launch: Launch): string {
  return launch.merchandising?.ctaLabel?.trim() || 'Shop the Drop'
}
