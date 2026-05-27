import type { Metadata } from 'next'
import { Cormorant_Garamond, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['300', '400', '700'],
  style: ['normal'],
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
    <html lang="de" className={`bg-background ${cormorant.variable} ${lato.variable}`}>
      <body
        className="font-sans antialiased min-h-screen flex flex-col"
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
