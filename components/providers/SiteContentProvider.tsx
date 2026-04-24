'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { defaultSiteContent, type SiteContent } from '@/lib/site-content'

const SiteContentContext = createContext<SiteContent>(defaultSiteContent)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch('/api/site-content', { cache: 'no-store' })
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as SiteContent
        if (!cancelled) {
          setContent(data)
        }
      } catch {
        // Keep defaults if custom content is unavailable.
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => content, [content])

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
