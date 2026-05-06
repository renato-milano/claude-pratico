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
  description: 'Descrivi il tuo ruolo e scopri scenari concreti su come Claude può aiutarti ogni giorno, in Chat, Cowork e Code.',
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
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
