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
  title: 'Peiqi — Brand Strategy, Visual Identity & UX/UI Web Design in Singapore',
  description:
    'Peiqi lifts how brands are seen and builds the digital presence that sells — strategy, logo and identity design, print and NFC collateral, UX/UI, websites, e-commerce and campaigns for companies, product businesses and founders.',
  keywords: [
    'brand strategy Singapore',
    'logo design Singapore',
    'visual identity',
    'corporate rebranding',
    'namecard and stationery design',
    'NFC business card design',
    'UX UI design Singapore',
    'website design Singapore',
    'e-commerce design',
    'portfolio website design',
  ],
  openGraph: {
    title: 'Peiqi — Distinctive design for every touchpoint',
    description:
      'Brand strategy, visual identity, UX/UI and digital design for companies, product businesses and founders.',
    type: 'website',
    locale: 'en_SG',
  },
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
