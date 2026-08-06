import Navbar from '@/components/Navbar'
import Hero from '@/components/hero/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Software from '@/components/sections/Software'
import Work from '@/components/sections/Work'
import Redesign from '@/components/sections/Redesign'
import QrShowcase from '@/components/sections/QrShowcase'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/Footer'
import NavDock from '@/components/ui/NavDock'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <NavDock />
      <Hero />
      <About />
      <Services />
      <Software />
      <Work />
      <Redesign />
      <QrShowcase />
      <Contact />
      <Footer />
    </main>
  )
}
