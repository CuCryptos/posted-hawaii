import 'server-only'

const RESEND_API_URL = 'https://api.resend.com/emails'

type ResendConfig = {
  apiKey: string
  fromEmail: string
  toEmail: string[]
}

type ContactEmailInput = {
  name: string
  email: string
  message: string
}

function getResendConfig(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL?.trim()
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (!apiKey && !fromEmail && (!toEmail || toEmail.length === 0)) {
    return null
  }

  if (!apiKey || !fromEmail || !toEmail || toEmail.length === 0) {
    throw new Error('Resend contact configuration is incomplete')
  }

  return { apiKey, fromEmail, toEmail }
}

function formatContactEmailText({ name, email, message }: ContactEmailInput) {
  return [
    'New POSTED contact form submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n')
}

async function resendFetch(body: Record<string, unknown>) {
  const config = getResendConfig()

  if (!config) {
    throw new Error('Resend contact configuration is missing')
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
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
      message?: string
      error?: string
      name?: string
    }
    message = parsedBody.message ?? parsedBody.error ?? parsedBody.name
  } catch {}

  throw new Error(message ?? rawBody ?? `Resend API error: ${response.status}`)
}

export function hasResendContactConfig() {
  return getResendConfig() !== null
}

export async function sendResendContactEmail(input: ContactEmailInput) {
  const config = getResendConfig()

  if (!config) {
    throw new Error('Resend contact configuration is missing')
  }

  await resendFetch({
    from: config.fromEmail,
    to: config.toEmail,
    reply_to: input.email,
    subject: `POSTED contact: ${input.name}`,
    text: formatContactEmailText(input),
  })

  return { destination: 'resend' as const }
}
