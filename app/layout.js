import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import Cursor from '@/components/ui/Cursor'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Peiqi — Interactive Media & Brand Design',
  description:
    'Portfolio of Peiqi, a creator specialising in interactive media, digital arts, and luxury brand identity.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}
    >
      <body className="grain font-sans antialiased">
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
