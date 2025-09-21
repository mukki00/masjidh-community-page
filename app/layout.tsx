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
        url: '/favicon.ico',
        width: 64,
        height: 64,
        alt: 'Balangoda Grand Mosque',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balangoda Grand Mosque',
    description: 'Sheltering communities with compassion and unity. Find prayer times, notices, and community updates.',
    images: '/favicon.ico',
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
        {/* Favicon files — add public/favicon.ico and optionally a PNG in public/ */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        {/* Optional: theme color */}
        <meta name="theme-color" content="#eafaf0" />
      </head>
      {/* add suppressHydrationWarning to avoid dev-time mismatch warnings caused by extensions/clients */}
      <body
        suppressHydrationWarning
        className={`w-full min-h-screen font-sans ${GeistSans.variable} ${GeistMono.variable} overflow-x-hidden`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}