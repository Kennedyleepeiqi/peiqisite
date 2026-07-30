'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ActionButton from '@/components/ui/ActionButton'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-line bg-canvas/70 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="container-lux flex items-center justify-between py-5">
        <a href="#home" className="font-serif text-lg tracking-tight text-ink">
          Peiqi<span className="text-muted">.</span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-500 ease-lux group-hover:w-full" />
            </a>
          ))}
        </nav>

        <ActionButton
          as="a"
          href="#contact"
          variant="outline"
          data-cursor="Say hi"
          className="bg-surface/60 px-5 py-2.5 text-sm backdrop-blur"
        >
          Contact
        </ActionButton>
      </div>
    </motion.header>
  )
}
