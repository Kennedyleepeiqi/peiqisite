'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Tracks a node's relationship to the viewport in two stages.
 *
 * `warm` latches on once the node is nearly in range, which is when a heavy
 * child is worth mounting. `visible` follows the node in and out, which is what
 * gates rendering: two WebGL canvases on one page will both keep drawing while
 * scrolled away and fight over the same GPU, and the cost lands on whichever
 * one the visitor is actually looking at.
 */
export default function useOnScreen({ warmMargin = '60%' } = {}) {
  const ref = useRef(null)
  const [warm, setWarm] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ahead = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setWarm(true)
        ahead.disconnect()
      },
      { rootMargin: `${warmMargin} 0px` },
    )

    // A little slack either side, so rendering resumes just before the node
    // edges into view rather than a frame after.
    const onScreen = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '15% 0px' },
    )

    ahead.observe(el)
    onScreen.observe(el)
    return () => {
      ahead.disconnect()
      onScreen.disconnect()
    }
  }, [warmMargin])

  return { ref, warm, visible }
}
