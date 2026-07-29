'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

/** Fade + rise into view once, on scroll. */
export default function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

const word = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.8, ease } },
}

/**
 * Word-by-word masked reveal for large statement copy.
 *
 * The viewport trigger lives on the unclipped wrapper rather than on each
 * word: an IntersectionObserver accounts for ancestor clipping, so a word
 * parked below its own overflow-hidden mask never registers as in view and
 * would deadlock. The wrapper is observed instead and the state cascades to
 * the words through variants.
 */
export function RevealWords({ text, className = '', wordClassName = '' }) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ staggerChildren: 0.045 }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={word}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
