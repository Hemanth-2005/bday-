'use client'

import { useEffect } from 'react'

/**
 * Scroll animations are now handled per-component via IntersectionObserver.
 * GSAP ScrollTrigger is disabled because it conflicts with CSS scroll-snap.
 * This hook is kept as a no-op to avoid import errors.
 */
export const useScrollAnimation = () => {
  useEffect(() => {
    // No-op: each section manages its own reveal via IntersectionObserver
  }, [])
}
