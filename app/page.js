import Navbar from '@/components/Navbar'
import Hero from '@/components/hero/Hero'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      {/* Upcoming sections: About · Services · Selected Works · Contact */}
    </main>
  )
}
