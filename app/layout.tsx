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
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
