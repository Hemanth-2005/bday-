'use client'

import { useEffect, useState } from 'react'

function getViewportWidth() {
  return 1280
}

export function useViewportWidth() {
  const [width, setWidth] = useState<number>(getViewportWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

export function useIsMobile(maxWidth = 767) {
  return useViewportWidth() <= maxWidth
}
