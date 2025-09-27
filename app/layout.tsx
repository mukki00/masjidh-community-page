import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { LoadingProvider } from '@/components/loading-provider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://balangodajummahmasjidh.org.lk'), // <-- Replace with your actual domain
  title: 'Balangoda Grand Mosque',
  description: 'Balangoda Grand Mosque - Community website for prayer times, notices, and SANDA collection',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
    <html lang="en" className="w-full">
      <head>
        {/* Favicon files for better browser and search engine support */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#059669" />
        <meta name="msapplication-TileColor" content="#059669" />
      </head>
      {/* add suppressHydrationWarning to avoid dev-time mismatch warnings caused by extensions/clients */}
      <body
        suppressHydrationWarning
        className={`w-full min-h-screen font-sans ${GeistSans.variable} ${GeistMono.variable} overflow-x-hidden`}
      >
        <LoadingProvider>
          {children}
        </LoadingProvider>
        <Analytics />
      </body>
    </html>
  )
}