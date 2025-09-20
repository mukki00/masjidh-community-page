import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://balangodajummahmasjidh.org.lk'), // <-- Replace with your actual domain
  title: 'Balangoda Grand Mosque',
  description: 'Balangoda Grand Mosque',
  keywords: [
    'Balangoda Grand Mosque',
    'Balangoda Jummah Mosque',
    'Balangoda Mosque',
    'Mosque',
    'Sri Lanka',
    'Prayer Times',
    'Islamic Center',
    'Community',
    'Ramadan',
    'SANDA Collection',
    'Jummah',
    'Muslim',
    'Balangoda'
  ],
  authors: [{ name: 'Under One Shadow', url: 'https://yourdomain.lk' }],
  openGraph: {
    title: 'Balangoda Grand Mosque',
    description: 'Sheltering communities with compassion and unity. Find prayer times, notices, and community updates.',
    url: 'https://yourdomain.lk',
    siteName: 'Balangoda Grand Mosque',
    images: [
      {
        url: '/images/jummah-masjid-hero.png',
        width: 1200,
        height: 630,
        alt: 'Balangoda Grand Mosque',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balangoda Grand Mosque',
    description: 'Sheltering communities with compassion and unity. Find prayer times, notices, and community updates.',
    images: '/images/jummah-masjid-hero.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/jummah-masjid-hero.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
