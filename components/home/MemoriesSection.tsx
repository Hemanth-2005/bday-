'use client'

import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useSiteContent } from '@/components/providers/SiteContentProvider'
import InfiniteGallery from '@/components/ui/3d-gallery-photography'
import { useIsMobile } from '@/hooks/useViewportInfo'
import { getMediaUrl } from '@/lib/media'

function MemoryLine({
  line,
  index,
  total,
  progress,
  startProgress,
  endProgress,
}: {
  line: string
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  startProgress: number
  endProgress: number
}) {
  const step = (endProgress - startProgress) / Math.max(total, 1)
  const start = startProgress + index * step
  const fadeIn = start + step * 0.16
  const hold = start + step * 0.48
  const end = start + step * 0.74

  const opacity = useTransform(progress, [start, fadeIn, hold, end], [0, 1, 1, 0])
  const y = useTransform(progress, [start, fadeIn, hold, end], ['2.3rem', '0rem', '0rem', '-2.3rem'])
  const blur = useTransform(progress, [start, fadeIn, hold, end], ['8px', '0px', '0px', '10px'])

  return (
    <motion.p
      style={{ opacity, y, filter: blur }}
      className="absolute inset-0 mx-auto flex items-center justify-center px-3 text-center text-sm leading-7 text-white/74 sm:px-4 sm:text-base sm:leading-8"
    >
      {line}
    </motion.p>
  )
}

export default function MemoriesSection() {
  const { memoryGalleryImages, memoriesSectionContent } = useSiteContent()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [galleryImages, setGalleryImages] = useState<Array<{ src: string; alt: string }>>([])
  const rawGalleryImages = useMemo(
    () =>
      memoryGalleryImages.map((image) => ({
        src: getMediaUrl(image),
        alt: image.alt,
      })),
    [memoryGalleryImages]
  )
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const titleOpacity = useTransform(scrollYProgress, [0, 0.14, 0.72, 0.95], [0, 1, 1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], [isMobile ? '10vh' : '16vh', isMobile ? '-8vh' : '-14vh'])
  const titleScale = useTransform(scrollYProgress, [0, 0.3, 1], [isMobile ? 0.88 : 0.8, 1, isMobile ? 1.05 : 1.18])
  const veilOpacity = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [0.95, 0.45, 0.5, 0.95])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.5, 0.22])
  const lineProgressStart = 0.14
  const lineProgressEnd = isMobile ? 0.68 : 0.64

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest)
  })

  useEffect(() => {
    let cancelled = false

    const validateImages = async () => {
      const loaded = await Promise.all(
        rawGalleryImages.map(
          (image) =>
            new Promise<{ src: string; alt: string } | null>((resolve) => {
              const element = new Image()
              element.onload = () => resolve(image)
              element.onerror = () => resolve(null)
              element.src = image.src
            })
        )
      )

      if (!cancelled) {
        const validImages = loaded.filter((image): image is { src: string; alt: string } => Boolean(image))
        setGalleryImages(validImages)
      }
    }

    void validateImages()

    return () => {
      cancelled = true
    }
  }, [rawGalleryImages])

  return (
    <section
      ref={sectionRef}
      id="memories"
      className="relative h-[250svh] overflow-clip sm:h-[280svh] lg:h-[320vh]"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_rgba(255,197,212,0.18),_transparent_38%)]"
        />

        <motion.div
          style={{ opacity: veilOpacity }}
          className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,_rgba(9,3,6,0.96),_rgba(9,3,6,0.16)_26%,_rgba(9,3,6,0.18)_74%,_rgba(9,3,6,0.94))]"
        />

        <div className="absolute inset-0 z-0">
          <InfiniteGallery
            images={galleryImages}
            speed={1.2}
            zSpacing={3}
            visibleCount={isMobile ? 8 : 10}
            falloff={{ near: 0.8, far: 14 }}
            scrollProgress={progress}
            scrollCycles={isMobile ? 1.75 : 1.55}
            interactive={false}
            className="h-full w-full bg-[#10050a]"
          />
        </div>

        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            scale: titleScale,
          }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 text-center"
        >
          <div className="flex max-w-4xl flex-col items-center justify-center">
            <p className="font-[family-name:var(--font-display)] text-[clamp(3rem,14vw,4.75rem)] tracking-[0.05em] text-[#fff7f2] sm:text-6xl md:text-7xl lg:text-8xl">
              Our Memories
            </p>

            <div className="relative mt-5 h-24 w-full max-w-[18rem] sm:mt-7 sm:h-20 sm:max-w-2xl">
              {memoriesSectionContent.lines.map((line, index) => (
                <MemoryLine
                  key={line}
                  line={line}
                  index={index}
                  total={memoriesSectionContent.lines.length}
                  progress={scrollYProgress}
                  startProgress={lineProgressStart}
                  endProgress={lineProgressEnd}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
