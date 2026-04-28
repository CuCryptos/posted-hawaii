import 'server-only'

import { addKlaviyoNewsletterSubscriber, hasKlaviyoNewsletterConfig } from '@/lib/klaviyo'
import { addShopifyNewsletterSubscriber } from '@/lib/shopify-admin'

export async function addNewsletterSubscriber(email: string) {
  if (hasKlaviyoNewsletterConfig()) {
    return addKlaviyoNewsletterSubscriber(email)
  }

  return addShopifyNewsletterSubscriber(email)
}
