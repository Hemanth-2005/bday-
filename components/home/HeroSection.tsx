'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowDown } from 'lucide-react'

import { getMediaUrl } from '@/lib/media'
import { useSiteContent } from '@/components/providers/SiteContentProvider'
import PixelFormationImage from '@/components/ui/pixel-formation-image'
import { useIsMobile } from '@/hooks/useViewportInfo'

export default function HeroSection() {
  const { heroPixelSectionContent } = useSiteContent()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.25,
  })

  const noteX = useTransform(
    smoothProgress,
    isMobile ? [0, 0.32, 0.58, 1] : [0, 0.22, 0.55, 1],
    isMobile ? [0, 0, -42, -110] : [0, 0, -180, -360]
  )
  const noteY = useTransform(
    smoothProgress,
    isMobile ? [0, 0.58, 1] : [0, 1],
    isMobile ? [0, -6, -28] : [0, -22]
  )
  const noteScale = useTransform(
    smoothProgress,
    isMobile ? [0, 0.5, 1] : [0, 0.45, 1],
    isMobile ? [1, 0.98, 0.9] : [1, 0.98, 0.9]
  )
  const noteOpacity = useTransform(smoothProgress, [0, 0.85, 1], [1, 1, 0.78])

  const particleOpacity = useTransform(
    smoothProgress,
    isMobile ? [0, 0.34, 0.62, 1] : [0, 0.2, 0.46, 1],
    isMobile ? [0, 0.02, 0.8, 1] : [0, 0.12, 0.9, 1]
  )
  const particleScale = useTransform(
    smoothProgress,
    isMobile ? [0, 0.4, 1] : [0, 0.35, 1],
    isMobile ? [0.5, 0.78, 1] : [0.66, 0.88, 1]
  )
  const particleRotate = useTransform(smoothProgress, [0, 1], [isMobile ? 3 : 8, 0])
  const particleX = useTransform(
    smoothProgress,
    isMobile ? [0, 0.42, 1] : [0, 0.38, 1],
    isMobile ? [0, 0, 10] : [120, 60, 0]
  )
  const particleY = useTransform(
    smoothProgress,
    isMobile ? [0, 0.52, 1] : [0, 1],
    isMobile ? [56, 44, 20] : [0, 0]
  )
  const backdropOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.26, 0.48, 0.72])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={sectionRef} className="relative h-[220svh] sm:h-[230svh] lg:h-[240vh]" aria-label="Happy birthday opening">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ opacity: backdropOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_32%,rgba(245,182,200,0.18),transparent_28%),radial-gradient(circle_at_78%_48%,rgba(201,73,118,0.26),transparent_32%),radial-gradient(circle_at_68%_74%,rgba(255,215,220,0.12),transparent_24%)]"
        />

        <div className="relative mx-auto h-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <motion.div
            style={{ x: noteX, y: noteY, scale: noteScale, opacity: noteOpacity }}
            className="absolute inset-0 z-20 flex items-center justify-center px-5 text-center sm:px-8"
          >
            <div className="max-w-[19rem] sm:max-w-2xl lg:max-w-3xl">
              <p className="text-[0.68rem] uppercase tracking-[0.38em] text-[#f4c2d2]/78">
                {heroPixelSectionContent.eyebrow}
              </p>

              <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,13vw,4.6rem)] leading-[0.9] text-[#fff6f2] sm:text-[clamp(3.5rem,9vw,5.8rem)] lg:text-7xl">
                {heroPixelSectionContent.title}
              </h1>

              <p className="mx-auto mt-5 max-w-[18rem] text-sm leading-7 text-white/72 sm:mt-6 sm:max-w-2xl sm:text-lg sm:leading-8">
                {heroPixelSectionContent.body}
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('memories')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f6d8d7] px-6 py-3 text-sm font-medium text-[#2d0f17] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Begin the story
                  <ArrowDown className="h-4 w-4" />
                </button>

                <p className="text-[0.72rem] tracking-[0.18em] text-white/44 uppercase sm:text-sm">
                  {heroPixelSectionContent.hint}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{
              opacity: particleOpacity,
              scale: particleScale,
              rotate: particleRotate,
              x: particleX,
              y: particleY,
            }}
            className="absolute inset-x-0 bottom-0 flex w-full items-end justify-center px-4 pb-[10svh] sm:px-6 sm:pb-[8svh] lg:inset-y-0 lg:right-0 lg:justify-end lg:px-0 lg:pb-0"
          >
            <div className="relative h-[39svh] min-h-[16rem] w-full max-w-[19rem] sm:h-[46svh] sm:max-w-[24rem] lg:h-[78vh] lg:max-w-[48rem]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,221,228,0.12),transparent_42%)] blur-3xl" />
              <PixelFormationImage
                src={getMediaUrl(heroPixelSectionContent.image)}
                progress={smoothProgress}
                className="absolute inset-0"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
