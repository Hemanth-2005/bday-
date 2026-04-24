'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'

import { useSiteContent } from '@/components/providers/SiteContentProvider'
import { useIsMobile } from '@/hooks/useViewportInfo'
import { getMediaUrl } from '@/lib/media'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function ReasonSlide({
  reason,
  isMobile,
  slideProgress,
}: {
  reason: {
    title: string
    subtitle: string
    description: string
    image: { src?: string; publicId?: string; alt: string }
  }
  isMobile: boolean
  slideProgress: number
}) {
  const imageScale = (isMobile ? 1.08 : 1.18) - slideProgress * (isMobile ? 0.08 : 0.18)
  const imageY = `${(isMobile ? 3 : 7) - slideProgress * (isMobile ? 4 : 11)}vh`
  const textY = `${(1 - slideProgress) * (isMobile ? 2.8 : 4.4)}vh`

  return (
    <motion.article
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
        <img
          src={getMediaUrl(reason.image)}
          alt={reason.image.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,_rgba(255,255,255,0.1),_transparent_24%),linear-gradient(180deg,_rgba(8,3,5,0.18)_0%,_rgba(8,3,5,0.36)_38%,_rgba(8,3,5,0.9)_100%)] lg:bg-[radial-gradient(circle_at_72%_42%,_rgba(255,255,255,0.1),_transparent_24%),linear-gradient(90deg,_rgba(8,3,5,0.88)_0%,_rgba(8,3,5,0.54)_34%,_rgba(8,3,5,0.2)_58%,_rgba(8,3,5,0.56)_100%)]" />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="absolute inset-0 z-20 flex w-full items-end px-5 pb-14 sm:px-8 sm:pb-16 lg:inset-y-0 lg:left-0 lg:items-center lg:px-16 lg:pb-0"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <div className="max-w-[19rem] sm:max-w-[24rem] lg:max-w-xl">
          <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#ffc6d3]">
            Why she stays on your mind
          </p>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.7rem,13vw,4.5rem)] leading-[0.95] text-[#fff5f0] sm:text-6xl lg:text-7xl">
            {reason.title}
          </h3>
          <p className="mt-3 max-w-sm text-[0.72rem] uppercase tracking-[0.22em] text-white/54 sm:mt-4 sm:text-[0.78rem]">
            {reason.subtitle}
          </p>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/74 sm:mt-6 sm:text-lg sm:leading-8">
            {reason.description}
          </p>
        </div>
      </motion.div>
    </motion.article>
  )
}

function ReasonDot({
  active,
}: {
  active: boolean
}) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.28, scale: active ? 1.35 : 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="h-2 w-2 rounded-full bg-[#ffd0da]"
    />
  )
}

export default function LoveReasonsSection() {
  const { loveReasons } = useSiteContent()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionProgress, setSectionProgress] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0])
  const totalReasons = Math.max(loveReasons.length, 1)
  const step = 1 / totalReasons

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setSectionProgress(latest)
  })

  const activeIndex = useMemo(
    () => clamp(Math.floor(sectionProgress * totalReasons), 0, totalReasons - 1),
    [sectionProgress, totalReasons]
  )
  const activeReason = loveReasons[activeIndex]
  const activeStepStart = activeIndex * step
  const slideProgress = clamp((sectionProgress - activeStepStart) / step, 0, 1)

  return (
    <section ref={sectionRef} className="relative h-[520svh] sm:h-[560svh] lg:h-[600vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ opacity: headerOpacity }}
          className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 pt-8 sm:px-10 lg:px-16"
        >
          <p className="text-[0.72rem] uppercase tracking-[0.34em] text-white/40">
            Scroll slowly
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeReason ? (
            <ReasonSlide
              key={`${activeReason.title}-${getMediaUrl(activeReason.image)}`}
              reason={activeReason}
              slideProgress={slideProgress}
              isMobile={isMobile}
            />
          ) : null}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-y-0 right-6 z-30 hidden items-center lg:flex">
          <div className="space-y-3">
            {loveReasons.map((reason, index) => (
              <ReasonDot
                key={reason.title}
                active={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
