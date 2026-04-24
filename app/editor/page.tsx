'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'

import type { MediaAsset } from '@/lib/media'
import { defaultSiteContent, type SiteContent } from '@/lib/site-content'

function cloneContent(content: SiteContent) {
  return JSON.parse(JSON.stringify(content)) as SiteContent
}

function SectionCard({
  title,
  advice,
  children,
}: {
  title: string
  advice: string
  children: ReactNode
}) {
  return (
    <details open className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur sm:rounded-[2rem] sm:p-5 md:p-7">
      <summary className="cursor-pointer list-none">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-[2rem] leading-none text-[#fff4ee] sm:text-3xl">
            {title}
          </h2>
          <span className="pt-2 text-[0.65rem] uppercase tracking-[0.26em] text-white/34">
            Tap to toggle
          </span>
        </div>
        <p className="mt-2 pr-4 text-xs leading-6 text-white/58 sm:text-sm sm:leading-7">{advice}</p>
      </summary>
      <div className="mt-6 space-y-5">{children}</div>
    </details>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-[#ffc7d5]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#12070c]/80 px-4 py-3 text-sm text-white outline-none"
      />
    </label>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-[#ffc7d5]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full rounded-2xl border border-white/10 bg-[#12070c]/80 px-4 py-3 text-sm leading-7 text-white outline-none"
      />
    </label>
  )
}

function MediaField({
  label,
  asset,
  onChange,
  onUpload,
  uploading,
  accept,
}: {
  label: string
  asset: MediaAsset
  onChange: (next: MediaAsset) => void
  onUpload: (file: File) => Promise<void>
  uploading: boolean
  accept: string
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
      <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/46">{label}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Path or URL" value={asset.src || ''} onChange={(src) => onChange({ ...asset, src })} />
        <Field label="Alt text" value={asset.alt} onChange={(alt) => onChange({ ...asset, alt })} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/74 sm:w-auto sm:justify-start sm:py-2">
          {uploading ? 'Uploading...' : 'Upload file'}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              void onUpload(file)
              event.currentTarget.value = ''
            }}
          />
        </label>
        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-white/34 sm:text-xs sm:tracking-[0.2em]">
          Uploads save into `public/uploads`
        </span>
      </div>
    </div>
  )
}

export default function EditorPage() {
  const [content, setContent] = useState<SiteContent>(() => cloneContent(defaultSiteContent))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadingKey, setUploadingKey] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch('/api/site-content', { cache: 'no-store' })
        if (!response.ok) return
        const data = (await response.json()) as SiteContent
        if (!cancelled) {
          setContent(data)
        }
      } catch {
        // keep defaults
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const saveContent = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        throw new Error('Failed to save content')
      }

      setMessage('Saved. Refresh the main page to see the latest content.')
    } catch {
      setMessage('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const uploadFile = async (section: string, file: File) => {
    setUploadingKey(section)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('section', section)

      const response = await fetch('/api/site-media', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = (await response.json()) as { path: string }
      return data.path
    } finally {
      setUploadingKey('')
    }
  }

  const sectionCountLabel = useMemo(
    () =>
      `${content.memoryGalleryImages.length} memories, ${content.journeyImages.length} journey photos, ${content.specialWishEntries.length} wishes`,
    [content]
  )

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#090306_0%,_#12070d_42%,_#0b0408_100%)] px-4 py-8 pb-32 text-white sm:px-8 sm:py-10 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#ffc7d5]">Content editor</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.7rem,12vw,4.5rem)] text-[#fff5ef]">
              Edit the birthday website section by section
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62">
              Use this page to update text, swap photos, upload videos or audio, and keep the
              whole site easier to maintain. Right now the content set includes {sectionCountLabel}.
            </p>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            <button
              type="button"
              onClick={() => {
                setContent(cloneContent(defaultSiteContent))
                setMessage('Reset to defaults locally. Save if you want to keep it.')
              }}
              className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/72"
            >
              Reset local form
            </button>
            <button
              type="button"
              onClick={saveContent}
              disabled={saving}
              className="rounded-full bg-[#f5d8d7] px-6 py-3 text-sm font-medium text-[#2f1118] disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/72"
            >
              Back to website
            </Link>
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-[#ffe3ea]">
            {message}
          </div>
        ) : null}

        <div className="grid gap-8">
          <SectionCard
            title="Opening hero"
            advice="Best image ratio: portrait 4:5 or soft vertical crop. Recommended resolution: at least 1400x1750 so the pixel formation still looks rich."
          >
            <Field
              label="Eyebrow"
              value={content.heroPixelSectionContent.eyebrow}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  heroPixelSectionContent: { ...prev.heroPixelSectionContent, eyebrow: value },
                }))
              }
            />
            <TextareaField
              label="Title"
              rows={3}
              value={content.heroPixelSectionContent.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  heroPixelSectionContent: { ...prev.heroPixelSectionContent, title: value },
                }))
              }
            />
            <TextareaField
              label="Body"
              value={content.heroPixelSectionContent.body}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  heroPixelSectionContent: { ...prev.heroPixelSectionContent, body: value },
                }))
              }
            />
            <Field
              label="Scroll hint"
              value={content.heroPixelSectionContent.hint}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  heroPixelSectionContent: { ...prev.heroPixelSectionContent, hint: value },
                }))
              }
            />
            <MediaField
              label="Hero image"
              asset={content.heroPixelSectionContent.image}
              onChange={(asset) =>
                setContent((prev) => ({
                  ...prev,
                  heroPixelSectionContent: { ...prev.heroPixelSectionContent, image: asset },
                }))
              }
              onUpload={async (file) => {
                const path = await uploadFile('hero', file)
                setContent((prev) => ({
                  ...prev,
                  heroPixelSectionContent: {
                    ...prev.heroPixelSectionContent,
                    image: { ...prev.heroPixelSectionContent.image, src: path },
                  },
                }))
              }}
              uploading={uploadingKey === 'hero'}
              accept="image/*"
            />
          </SectionCard>

          <SectionCard
            title="Memories"
            advice="Best gallery images: mixed portraits and landscapes are okay, but high-quality verticals feel strongest. Keep important faces centered because the 3D gallery crops dynamically."
          >
            {content.memoriesSectionContent.lines.map((line, index) => (
              <Field
                key={`memory-line-${index}`}
                label={`Memory line ${index + 1}`}
                value={line}
                onChange={(value) =>
                  setContent((prev) => {
                    const next = [...prev.memoriesSectionContent.lines]
                    next[index] = value
                    return {
                      ...prev,
                      memoriesSectionContent: {
                        ...prev.memoriesSectionContent,
                        lines: next,
                      },
                    }
                  })
                }
              />
            ))}

            {content.memoryGalleryImages.map((image, index) => (
              <div key={`memory-${index}`} className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/46">Memory {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Image path"
                    value={image.src || ''}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.memoryGalleryImages]
                        next[index] = { ...next[index], src: value }
                        return { ...prev, memoryGalleryImages: next }
                      })
                    }
                  />
                  <Field
                    label="Alt text"
                    value={image.alt}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.memoryGalleryImages]
                        next[index] = { ...next[index], alt: value }
                        return { ...prev, memoryGalleryImages: next }
                      })
                    }
                  />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Caption"
                    value={image.caption || ''}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.memoryGalleryImages]
                        next[index] = { ...next[index], caption: value }
                        return { ...prev, memoryGalleryImages: next }
                      })
                    }
                  />
                  <TextareaField
                    label="Note"
                    rows={3}
                    value={image.note || ''}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.memoryGalleryImages]
                        next[index] = { ...next[index], note: value }
                        return { ...prev, memoryGalleryImages: next }
                      })
                    }
                  />
                </div>
                <div className="mt-4">
                  <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/74 sm:w-auto sm:justify-start sm:py-2">
                    {uploadingKey === `memory-${index}` ? 'Uploading...' : 'Upload memory image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return
                        void (async () => {
                          const path = await uploadFile(`memory-${index}`, file)
                          setContent((prev) => {
                            const next = [...prev.memoryGalleryImages]
                            next[index] = { ...next[index], src: path }
                            return { ...prev, memoryGalleryImages: next }
                          })
                        })()
                        event.currentTarget.value = ''
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard
            title="Before you / color reveal"
            advice="Best ratio: portrait 4:5 or 3:4. Recommended resolution: 1500px or more on the shortest side for cleaner shader detail."
          >
            <Field
              label="Eyebrow"
              value={content.colorRevealSectionContent.eyebrow}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  colorRevealSectionContent: { ...prev.colorRevealSectionContent, eyebrow: value },
                }))
              }
            />
            <TextareaField
              label="Title"
              rows={3}
              value={content.colorRevealSectionContent.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  colorRevealSectionContent: { ...prev.colorRevealSectionContent, title: value },
                }))
              }
            />
            <TextareaField
              label="Paragraph one"
              value={content.colorRevealSectionContent.body}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  colorRevealSectionContent: { ...prev.colorRevealSectionContent, body: value },
                }))
              }
            />
            <TextareaField
              label="Paragraph two"
              value={content.colorRevealSectionContent.bodyTwo}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  colorRevealSectionContent: { ...prev.colorRevealSectionContent, bodyTwo: value },
                }))
              }
            />
            <MediaField
              label="Reveal image"
              asset={content.colorRevealSectionContent.image}
              onChange={(asset) =>
                setContent((prev) => ({
                  ...prev,
                  colorRevealSectionContent: { ...prev.colorRevealSectionContent, image: asset },
                }))
              }
              onUpload={async (file) => {
                const path = await uploadFile('color-reveal', file)
                setContent((prev) => ({
                  ...prev,
                  colorRevealSectionContent: {
                    ...prev.colorRevealSectionContent,
                    image: { ...prev.colorRevealSectionContent.image, src: path },
                  },
                }))
              }}
              uploading={uploadingKey === 'color-reveal'}
              accept="image/*"
            />
          </SectionCard>

          <SectionCard
            title="Your journey"
            advice="This animation looks best with many photos. Use at least 12 to 20 images. Portrait or square images work especially well because they stay readable inside the sphere."
          >
            <Field
              label="Eyebrow"
              value={content.journeySectionContent.eyebrow}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  journeySectionContent: { ...prev.journeySectionContent, eyebrow: value },
                }))
              }
            />
            <TextareaField
              label="Title"
              rows={3}
              value={content.journeySectionContent.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  journeySectionContent: { ...prev.journeySectionContent, title: value },
                }))
              }
            />
            <TextareaField
              label="Intro"
              value={content.journeySectionContent.intro}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  journeySectionContent: { ...prev.journeySectionContent, intro: value },
                }))
              }
            />
            <TextareaField
              label="Closing"
              value={content.journeySectionContent.closing}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  journeySectionContent: { ...prev.journeySectionContent, closing: value },
                }))
              }
            />

            {content.relationshipMilestones.map((milestone, index) => (
              <div key={`milestone-${index}`} className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/46">Milestone {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Label"
                    value={milestone.label}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.relationshipMilestones]
                        next[index] = { ...next[index], label: value }
                        return { ...prev, relationshipMilestones: next }
                      })
                    }
                  />
                  <Field
                    label="Title"
                    value={milestone.title}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.relationshipMilestones]
                        next[index] = { ...next[index], title: value }
                        return { ...prev, relationshipMilestones: next }
                      })
                    }
                  />
                </div>
                <div className="mt-4">
                  <TextareaField
                    label="Description"
                    value={milestone.description}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.relationshipMilestones]
                        next[index] = { ...next[index], description: value }
                        return { ...prev, relationshipMilestones: next }
                      })
                    }
                  />
                </div>
              </div>
            ))}

            {content.journeyImages.map((image, index) => (
              <div key={`journey-image-${index}`} className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/46">Journey image {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Image path"
                    value={image.src || ''}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.journeyImages]
                        next[index] = { ...next[index], src: value }
                        return { ...prev, journeyImages: next }
                      })
                    }
                  />
                  <Field
                    label="Alt text"
                    value={image.alt}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.journeyImages]
                        next[index] = { ...next[index], alt: value }
                        return { ...prev, journeyImages: next }
                      })
                    }
                  />
                </div>
                <div className="mt-4">
                  <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/74 sm:w-auto sm:justify-start sm:py-2">
                    {uploadingKey === `journey-${index}` ? 'Uploading...' : 'Upload journey image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return
                        void (async () => {
                          const path = await uploadFile(`journey-${index}`, file)
                          setContent((prev) => {
                            const next = [...prev.journeyImages]
                            next[index] = { ...next[index], src: path }
                            return { ...prev, journeyImages: next }
                          })
                        })()
                        event.currentTarget.value = ''
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard
            title="Why she stays on your mind"
            advice="These slides work best with strong close-ups. Recommended ratio: portrait 4:5. Keep eyes, smile, and facial details centered because each image becomes a full-screen scroll story."
          >
            {content.loveReasons.map((reason, index) => (
              <div key={`reason-${index}`} className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/46">Reason {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Title"
                    value={reason.title}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.loveReasons]
                        next[index] = { ...next[index], title: value }
                        return { ...prev, loveReasons: next }
                      })
                    }
                  />
                  <Field
                    label="Subtitle"
                    value={reason.subtitle}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.loveReasons]
                        next[index] = { ...next[index], subtitle: value }
                        return { ...prev, loveReasons: next }
                      })
                    }
                  />
                </div>
                <div className="mt-4">
                  <TextareaField
                    label="Description"
                    value={reason.description}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.loveReasons]
                        next[index] = { ...next[index], description: value }
                        return { ...prev, loveReasons: next }
                      })
                    }
                  />
                </div>
                <div className="mt-4">
                  <MediaField
                    label="Reason image"
                    asset={reason.image}
                    onChange={(asset) =>
                      setContent((prev) => {
                        const next = [...prev.loveReasons]
                        next[index] = { ...next[index], image: asset }
                        return { ...prev, loveReasons: next }
                      })
                    }
                    onUpload={async (file) => {
                      const path = await uploadFile(`love-reason-${index}`, file)
                      setContent((prev) => {
                        const next = [...prev.loveReasons]
                        next[index] = { ...next[index], image: { ...next[index].image, src: path } }
                        return { ...prev, loveReasons: next }
                      })
                    }}
                    uploading={uploadingKey === `love-reason-${index}`}
                    accept="image/*"
                  />
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard
            title="Special wishes game"
            advice="Videos work best in 9:16 or 16:9. Keep each clip under a reasonable file size for smoother playback. Audio-only files can be mp3. One clue and one answer set per wish."
          >
            <Field
              label="Eyebrow"
              value={content.specialWishesSectionContent.eyebrow}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  specialWishesSectionContent: { ...prev.specialWishesSectionContent, eyebrow: value },
                }))
              }
            />
            <TextareaField
              label="Title"
              rows={3}
              value={content.specialWishesSectionContent.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  specialWishesSectionContent: { ...prev.specialWishesSectionContent, title: value },
                }))
              }
            />

            {content.specialWishEntries.map((entry, index) => (
              <div key={entry.id} className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/46">Wish {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Prompt"
                    value={entry.prompt}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.specialWishEntries]
                        next[index] = { ...next[index], prompt: value }
                        return { ...prev, specialWishEntries: next }
                      })
                    }
                  />
                  <Field
                    label="Accepted answers"
                    value={entry.answers.join(', ')}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.specialWishEntries]
                        next[index] = {
                          ...next[index],
                          answers: value
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean),
                        }
                        return { ...prev, specialWishEntries: next }
                      })
                    }
                  />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_12rem]">
                  <TextareaField
                    label="Clue"
                    rows={3}
                    value={entry.clue}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.specialWishEntries]
                        next[index] = { ...next[index], clue: value }
                        return { ...prev, specialWishEntries: next }
                      })
                    }
                  />
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-[#ffc7d5]">Media type</span>
                    <select
                      value={entry.mediaType}
                      onChange={(event) =>
                        setContent((prev) => {
                          const next = [...prev.specialWishEntries]
                          next[index] = {
                            ...next[index],
                            mediaType: event.target.value as 'video' | 'audio',
                          }
                          return { ...prev, specialWishEntries: next }
                        })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#12070c]/80 px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                    </select>
                  </label>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Media path"
                    value={entry.mediaSrc}
                    onChange={(value) =>
                      setContent((prev) => {
                        const next = [...prev.specialWishEntries]
                        next[index] = { ...next[index], mediaSrc: value }
                        return { ...prev, specialWishEntries: next }
                      })
                    }
                  />
                  <div className="flex items-end">
                    <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/74 sm:w-auto sm:justify-start sm:py-2">
                      {uploadingKey === `wish-${index}` ? 'Uploading...' : 'Upload media'}
                      <input
                        type="file"
                        accept={entry.mediaType === 'audio' ? 'audio/*' : 'video/*'}
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (!file) return
                          void (async () => {
                            const path = await uploadFile(`wish-${index}`, file)
                            setContent((prev) => {
                              const next = [...prev.specialWishEntries]
                              next[index] = { ...next[index], mediaSrc: path }
                              return { ...prev, specialWishEntries: next }
                            })
                          })()
                          event.currentTarget.value = ''
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard
            title="Ending copy"
            advice="This part is text-heavy, so keep it warm and simple. Short lines read best. You can rewrite the soft closing and the final tags here."
          >
            {content.closingLines.map((line, index) => (
              <Field
                key={`closing-${index}`}
                label={`Closing line ${index + 1}`}
                value={line}
                onChange={(value) =>
                  setContent((prev) => {
                    const next = [...prev.closingLines]
                    next[index] = value
                    return { ...prev, closingLines: next }
                  })
                }
              />
            ))}

            <Field
              label="Letter eyebrow"
              value={content.letterSectionContent.eyebrow}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  letterSectionContent: { ...prev.letterSectionContent, eyebrow: value },
                }))
              }
            />
            <TextareaField
              label="Letter title"
              rows={3}
              value={content.letterSectionContent.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  letterSectionContent: { ...prev.letterSectionContent, title: value },
                }))
              }
            />
            <Field
              label="Personalization title"
              value={content.letterSectionContent.personalizationTitle}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  letterSectionContent: { ...prev.letterSectionContent, personalizationTitle: value },
                }))
              }
            />
            <TextareaField
              label="Personalization body"
              value={content.letterSectionContent.personalizationBody}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  letterSectionContent: { ...prev.letterSectionContent, personalizationBody: value },
                }))
              }
            />
            <Field
              label="Final eyebrow"
              value={content.finalSectionContent.eyebrow}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  finalSectionContent: { ...prev.finalSectionContent, eyebrow: value },
                }))
              }
            />
            <TextareaField
              label="Final title"
              rows={3}
              value={content.finalSectionContent.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  finalSectionContent: { ...prev.finalSectionContent, title: value },
                }))
              }
            />
            {content.finalSectionContent.tags.map((tag, index) => (
              <Field
                key={`tag-${index}`}
                label={`Final tag ${index + 1}`}
                value={tag}
                onChange={(value) =>
                  setContent((prev) => {
                    const next = [...prev.finalSectionContent.tags]
                    next[index] = value
                    return {
                      ...prev,
                      finalSectionContent: { ...prev.finalSectionContent, tags: next },
                    }
                  })
                }
              />
            ))}
          </SectionCard>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[rgba(10,4,7,0.94)] px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl gap-3">
          <button
            type="button"
            onClick={() => {
              setContent(cloneContent(defaultSiteContent))
              setMessage('Reset to defaults locally. Save if you want to keep it.')
            }}
            className="flex-1 rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/72"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={saveContent}
            disabled={saving}
            className="flex-1 rounded-full bg-[#f5d8d7] px-4 py-3 text-sm font-medium text-[#2f1118] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link
            href="/"
            className="flex-1 rounded-full border border-white/12 bg-white/6 px-4 py-3 text-center text-sm text-white/72"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  )
}
