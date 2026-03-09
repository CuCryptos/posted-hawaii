import type { Metadata } from 'next'
import { dmSans, lora } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'POSTED HAWAI\u02BBI \u2014 You know where to find us.',
  description: 'Honolulu-based streetwear. Bold with discipline.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css"
        />
      </head>
      <body className="font-body antialiased">
        {children}

        {/* Snipcart container */}
        <div
          hidden
          id="snipcart"
          data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}
          data-config-modal-style="side"
          data-currency="usd"
        />
        <script
          async
          src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js"
        />
      </body>
    </html>
  )
}
