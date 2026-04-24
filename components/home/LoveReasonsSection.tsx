'use client'

import { motion, MotionValue, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { useSiteContent } from '@/components/providers/SiteContentProvider'
import { useIsMobile } from '@/hooks/useViewportInfo'
import { getMediaUrl } from '@/lib/media'

function ReasonSlide({
  reason,
  index,
  total,
  progress,
  isMobile,
}: {
  reason: {
    title: string
    subtitle: string
    description: string
    image: { src?: string; publicId?: string; alt: string }
  }
  index: number
  total: number
  progress: MotionValue<number>
  isMobile: boolean
}) {
  const step = 1 / total
  const start = index * step
  const enter = index === 0 ? 0 : Math.max(start - step * 0.04, 0)
  const fadeIn = index === 0 ? Math.min(start + step * 0.08, 1) : Math.min(start + step * 0.16, 1)
  const hold = Math.min(start + step * 0.82, 1)
  const end = Math.min(start + step * 0.94, 1)
  const opacityStops = index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0]

  const opacity = useTransform(progress, [enter, fadeIn, hold, end], opacityStops)
  const imageScale = useTransform(progress, [enter, end], [isMobile ? 1.08 : 1.18, 1])
  const imageY = useTransform(progress, [enter, end], [isMobile ? '3vh' : '7vh', isMobile ? '-1vh' : '-4vh'])
  const textY = useTransform(progress, [enter, fadeIn, hold, end], [isMobile ? '5vh' : '8vh', '0vh', '0vh', isMobile ? '-4vh' : '-8vh'])
  const textOpacity = useTransform(progress, [enter, fadeIn, hold, end], opacityStops)

  return (
    <motion.article style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
        <img
          src={getMediaUrl(reason.image)}
          alt={reason.image.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,_rgba(255,255,255,0.1),_transparent_24%),linear-gradient(180deg,_rgba(8,3,5,0.18)_0%,_rgba(8,3,5,0.36)_38%,_rgba(8,3,5,0.9)_100%)] lg:bg-[radial-gradient(circle_at_72%_42%,_rgba(255,255,255,0.1),_transparent_24%),linear-gradient(90deg,_rgba(8,3,5,0.88)_0%,_rgba(8,3,5,0.54)_34%,_rgba(8,3,5,0.2)_58%,_rgba(8,3,5,0.56)_100%)]" />
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-0 z-20 flex w-full items-end px-5 pb-14 sm:px-8 sm:pb-16 lg:inset-y-0 lg:left-0 lg:items-center lg:px-16 lg:pb-0"
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
  index,
  total,
  progress,
}: {
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const step = 1 / total
  const start = index * step
  const middle = start + step * 0.5
  const end = start + step
  const opacity = useTransform(progress, [start, middle, end], [0.28, 1, 0.28])
  const scale = useTransform(progress, [start, middle, end], [1, 1.35, 1])

  return (
    <motion.div style={{ opacity, scale }} className="h-2 w-2 rounded-full bg-[#ffd0da]" />
  )
}

export default function LoveReasonsSection() {
  const { loveReasons } = useSiteContent()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0])

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

        {loveReasons.map((reason, index) => (
          <ReasonSlide
            key={`${reason.title}-${getMediaUrl(reason.image)}`}
            reason={reason}
            index={index}
            total={loveReasons.length}
            progress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}

        <div className="pointer-events-none absolute inset-y-0 right-6 z-30 hidden items-center lg:flex">
          <div className="space-y-3">
            {loveReasons.map((reason, index) => (
              <ReasonDot
                key={reason.title}
                index={index}
                total={loveReasons.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
