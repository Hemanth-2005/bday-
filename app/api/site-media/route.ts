import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { NextResponse } from 'next/server'

function sanitizeSegment(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
}

function sanitizeFilename(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, '-')
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  const section = String(formData.get('section') || 'general')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file upload.' }, { status: 400 })
  }

  const safeSection = sanitizeSegment(section || 'general')
  const extension = path.extname(file.name) || ''
  const baseName = path.basename(file.name, extension)
  const safeName = `${Date.now()}-${sanitizeFilename(baseName)}${extension}`
  const relativePath = `/uploads/${safeSection}/${safeName}`
  const targetDirectory = path.join(process.cwd(), 'public', 'uploads', safeSection)
  const targetPath = path.join(targetDirectory, safeName)

  await mkdir(targetDirectory, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(targetPath, buffer)

  return NextResponse.json({ ok: true, path: relativePath })
}
