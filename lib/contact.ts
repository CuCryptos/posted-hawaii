import 'server-only'

import { sendResendContactEmail, hasResendContactConfig } from '@/lib/resend'
import { saveShopifyContactInquiry } from '@/lib/shopify-admin'

type ContactInput = {
  name: string
  email: string
  message: string
}

export async function saveContactInquiry(input: ContactInput) {
  if (hasResendContactConfig()) {
    return sendResendContactEmail(input)
  }

  return saveShopifyContactInquiry(input)
}
