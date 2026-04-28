import 'server-only'

const KLAVIYO_API_URL = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/'
const KLAVIYO_API_REVISION = process.env.KLAVIYO_API_REVISION?.trim() || '2025-07-15'

type KlaviyoConfig = {
  privateApiKey: string
  newsletterListId: string
}

function getKlaviyoConfig(): KlaviyoConfig | null {
  const privateApiKey = process.env.KLAVIYO_PRIVATE_API_KEY?.trim()
  const newsletterListId = process.env.KLAVIYO_NEWSLETTER_LIST_ID?.trim()

  if (!privateApiKey && !newsletterListId) {
    return null
  }

  if (!privateApiKey || !newsletterListId) {
    throw new Error('Klaviyo newsletter configuration is incomplete')
  }

  return { privateApiKey, newsletterListId }
}

async function klaviyoFetch(body: Record<string, unknown>) {
  const config = getKlaviyoConfig()

  if (!config) {
    throw new Error('Klaviyo newsletter configuration is missing')
  }

  const response = await fetch(KLAVIYO_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${config.privateApiKey}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      revision: KLAVIYO_API_REVISION,
    },
    cache: 'no-store',
    body: JSON.stringify(body),
  })

  if (response.ok) {
    return
  }

  const rawBody = await response.text()
  let message: string | undefined

  try {
    const parsedBody = JSON.parse(rawBody) as {
      errors?: Array<{ detail?: string; title?: string }>
    }
    message = parsedBody.errors?.[0]?.detail ?? parsedBody.errors?.[0]?.title
  } catch {}

  throw new Error(message ?? rawBody ?? `Klaviyo API error: ${response.status}`)
}

export function hasKlaviyoNewsletterConfig() {
  return getKlaviyoConfig() !== null
}

export async function addKlaviyoNewsletterSubscriber(email: string) {
  const config = getKlaviyoConfig()

  if (!config) {
    throw new Error('Klaviyo newsletter configuration is missing')
  }

  await klaviyoFetch({
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: 'POSTED website',
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: {
                email,
                subscriptions: {
                  email: {
                    marketing: {
                      consent: 'SUBSCRIBED',
                    },
                  },
                },
              },
            },
          ],
        },
      },
      relationships: {
        list: {
          data: {
            type: 'list',
            id: config.newsletterListId,
          },
        },
      },
    },
  })

  return { destination: 'klaviyo' as const }
}
