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
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 1.05, ease } },
}

/**
 * Word-by-word masked reveal for large statement copy.
 *
 * The viewport trigger lives on the unclipped wrapper rather than on each
 * word: an IntersectionObserver accounts for ancestor clipping, so a word
 * parked below its own overflow-hidden mask never registers as in view and
 * would deadlock. The wrapper is observed instead and the state cascades to
 * the words through variants.
 *
 * `accentFrom` marks a trailing run of words for different styling — negative
 * values count back from the end, as with Array.slice.
 */
export function RevealWords({
  text,
  className = '',
  wordClassName = '',
  accentClassName = '',
  accentFrom = null,
  delay = 0,
}) {
  const words = text.split(' ')
  const accentAt =
    accentFrom === null
      ? words.length
      : accentFrom < 0
        ? words.length + accentFrom
        : accentFrom

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {words.map((w, i) => (
        // The mask's padding box is pushed below the baseline and pulled back
        // by an equal negative margin: descenders clear the clip without the
        // line box growing. Tight leading alone would shear the j and y.
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.22em] -mb-[0.22em] align-bottom"
        >
          <motion.span
            className={`inline-block ${wordClassName} ${i >= accentAt ? accentClassName : ''}`}
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
