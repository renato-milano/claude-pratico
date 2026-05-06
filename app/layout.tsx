import type { Metadata } from 'next'
import { Libre_Caslon_Text, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const libreCaslon = Libre_Caslon_Text({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})
// Inter as the sans (Geist is only available in next/font from Next 14.2+).
// If you're on Next 14.2+ and want Geist, swap this back to: import { Geist } from 'next/font/google'
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Claude Potential Map',
  description: 'Scopri come Claude può trasformare il tuo lavoro quotidiano',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${libreCaslon.variable} ${sans.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
