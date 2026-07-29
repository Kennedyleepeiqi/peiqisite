'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A custom two-part cursor: a precise center dot plus a lagging ring that
 * expands and labels itself when hovering interactive / data-cursor elements.
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [label, setLabel] = useState('')
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    document.body.classList.add('custom-cursor')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }
    let raf

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }

      const target = e.target.closest('a, button, [data-cursor]')
      if (target) {
        setHovering(true)
        setLabel(target.getAttribute('data-cursor') || '')
      } else {
        setHovering(false)
        setLabel('')
      }
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.15
      ringPos.y += (pos.y - ringPos.y) * 0.15
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.body.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-1 -mt-1 h-2 w-2 rounded-full bg-ink mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ring}
        className={`pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center rounded-full border border-ink/40 text-[0.6rem] uppercase tracking-[0.2em] text-ink mix-blend-difference transition-[width,height,opacity] duration-300 ease-lux ${
          hovering ? 'h-16 w-16 border-transparent bg-ink/5' : 'h-9 w-9'
        }`}
        style={{ marginLeft: hovering ? -32 : -18, marginTop: hovering ? -32 : -18, willChange: 'transform' }}
      >
        {label}
      </div>
    </>
  )
}
