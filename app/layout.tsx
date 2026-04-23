import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: "Jara's Kochbuch",
  description: 'Eine Sammlung leckerer Rezepte',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="bg-background">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <footer
          className="py-8 text-center text-sm text-muted-foreground"
          style={{ borderTop: '2px solid #6b1f2b' }}
        >
          <div className="container mx-auto px-4">
            Jara&apos;s Kochbuch &copy; {new Date().getFullYear()}
          </div>
        </footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
