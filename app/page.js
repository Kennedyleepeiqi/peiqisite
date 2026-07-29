import Navbar from '@/components/Navbar'
import Hero from '@/components/hero/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Work from '@/components/sections/Work'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Work />
      <Contact />
      <Footer />
    </main>
  )
}
