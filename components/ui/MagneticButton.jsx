'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * A button/link that subtly follows the cursor while hovered — a signature
 * "magnetic" micro-interaction.
 */
export default function MagneticButton({
  children,
  as = 'button',
  className = '',
  strength = 24,
  ...props
}) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(${(x / rect.width) * strength}px, ${
      (y / rect.height) * strength
    }px)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0px, 0px)'
  }

  const MotionTag = motion[as] ?? motion.button

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-flex items-center justify-center transition-transform duration-500 ease-lux will-change-transform ${className}`}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
