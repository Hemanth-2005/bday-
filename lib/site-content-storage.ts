import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { defaultSiteContent, type SiteContent } from '@/lib/site-content'

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

const overridesFilePath = path.join(process.cwd(), 'data', 'site-content-overrides.json')

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function mergeSiteContent<T>(base: T, overrides?: DeepPartial<T>): T {
  if (overrides === undefined) {
    return base
  }

  if (Array.isArray(base)) {
    return (Array.isArray(overrides) ? overrides : base) as T
  }

  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return (overrides as T) ?? base
  }

  const result: Record<string, unknown> = { ...base }

  for (const key of Object.keys(overrides) as Array<keyof typeof overrides>) {
    const resultKey = String(key)
    const baseValue = result[resultKey]
    const overrideValue = overrides[key]

    if (overrideValue === undefined) {
      continue
    }

    if (Array.isArray(baseValue)) {
      result[resultKey] = Array.isArray(overrideValue) ? overrideValue : baseValue
      continue
    }

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[resultKey] = mergeSiteContent(baseValue, overrideValue)
      continue
    }

    result[resultKey] = overrideValue
  }

  return result as T
}

export async function readSiteContentOverrides(): Promise<DeepPartial<SiteContent>> {
  try {
    const raw = await readFile(overridesFilePath, 'utf8')
    return JSON.parse(raw) as DeepPartial<SiteContent>
  } catch {
    return {}
  }
}

export async function readMergedSiteContent(): Promise<SiteContent> {
  const overrides = await readSiteContentOverrides()
  return mergeSiteContent(defaultSiteContent, overrides)
}

export async function writeSiteContentOverrides(content: SiteContent) {
  await mkdir(path.dirname(overridesFilePath), { recursive: true })
  await writeFile(overridesFilePath, JSON.stringify(content, null, 2), 'utf8')
}
