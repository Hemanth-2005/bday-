import { NextResponse } from 'next/server'

import { type SiteContent } from '@/lib/site-content'
import { readMergedSiteContent, writeSiteContentOverrides } from '@/lib/site-content-storage'

export async function GET() {
  const content = await readMergedSiteContent()
  return NextResponse.json(content)
}

export async function POST(request: Request) {
  const content = (await request.json()) as SiteContent
  await writeSiteContentOverrides(content)
  return NextResponse.json({ ok: true })
}
