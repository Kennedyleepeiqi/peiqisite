'use client'

import { useEffect, useState } from 'react'

export default function Footer() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      )
    }
    tick()
    const id = setInterval(tick, 1000 * 30)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="relative overflow-hidden bg-ink text-canvas">
      <div className="container-lux py-20">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="eyebrow !text-canvas/50">Peiqi Studio</p>
            <p className="mt-4 max-w-sm text-sm text-canvas/60">
              Brand strategy, visual identity, UX/UI and web design for
              companies, product businesses and founders — built to lift how you
              are seen and to bring in work.
            </p>
          </div>
          <div className="text-sm text-canvas/60 md:text-right">
            <p>Currently taking on new projects</p>
            <p className="mt-1">Local time — {time || '—'}</p>
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <h2 className="select-none whitespace-nowrap font-serif text-[clamp(3rem,16vw,14rem)] font-light leading-none tracking-tightest text-canvas/95">
            Peiqi<span className="text-canvas/45">.</span>
          </h2>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs uppercase tracking-[0.2em] text-canvas/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Peiqi — All rights reserved</span>
          <span>Designed & built with obsession</span>
        </div>
      </div>
    </footer>
  )
}
