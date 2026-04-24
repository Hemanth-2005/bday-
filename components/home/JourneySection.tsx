'use client'

import { motion } from 'framer-motion'

import { useSiteContent } from '@/components/providers/SiteContentProvider'
import { useViewportWidth } from '@/hooks/useViewportInfo'
import SphereImageGrid from '@/components/ui/img-sphere'
import { getMediaUrl } from '@/lib/media'

export default function JourneySection() {
  const { journeyImages, journeySectionContent, relationshipMilestones } = useSiteContent()
  const viewportWidth = useViewportWidth()
  const sphereSize =
    viewportWidth < 640 ? Math.min(viewportWidth - 36, 340) : viewportWidth < 1024 ? Math.min(viewportWidth - 72, 560) : 760
  const sphereRadius = Math.round(sphereSize * (viewportWidth < 640 ? 0.33 : viewportWidth < 1024 ? 0.35 : 0.347))
  const baseImageScale = viewportWidth < 640 ? 0.16 : viewportWidth < 1024 ? 0.145 : 0.135

  const sphereImages = journeyImages.map((image, index) => ({
    id: `journey-${index}`,
    src: getMediaUrl(image),
    alt: image.alt,
    title: image.alt,
  }))

  return (
    <section id="journey" className="relative min-h-screen overflow-visible px-5 py-14 sm:px-8 sm:py-16">
      <div className="pointer-events-none absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,203,216,0.14),_transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[28%] h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(160,68,98,0.2),_transparent_68%)] blur-3xl" />

      <div className="grid min-h-[calc(100svh-6rem)] items-center gap-8 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative order-1 flex min-h-[20rem] items-center justify-center overflow-visible sm:min-h-[26rem] lg:min-h-[44rem]"
        >
          <SphereImageGrid
            images={sphereImages}
            containerSize={sphereSize}
            sphereRadius={sphereRadius}
            dragSensitivity={viewportWidth < 640 ? 0.62 : 0.72}
            momentumDecay={0.94}
            baseImageScale={baseImageScale}
            autoRotate
            autoRotateSpeed={0.18}
            enableModal={false}
            className="max-w-full overflow-visible"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="relative order-2 z-10 flex max-w-2xl flex-col justify-center"
        >
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#ffc6d3]">
            {journeySectionContent.eyebrow}
          </p>

          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.5rem,10.5vw,4rem)] leading-tight text-[#fff5f0] sm:text-5xl md:text-6xl">
            {journeySectionContent.title}
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-base sm:leading-8">
            {journeySectionContent.intro}
          </p>

          <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-7">
            {relationshipMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.label}
                initial={{
                  opacity: 0,
                  y: 32,
                  x: index % 2 === 0 ? 20 : -20,
                  scale: 0.96,
                  filter: 'blur(12px)',
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.85, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-w-xl pl-5 sm:pl-6"
              >
                <span className="absolute left-0 top-1 h-full w-px bg-gradient-to-b from-[#ffd7e0] via-white/25 to-transparent" />
                <span className="absolute left-[-0.29rem] top-2 h-2.5 w-2.5 rounded-full border border-white/50 bg-[#ffd9df] shadow-[0_0_18px_rgba(255,214,224,0.45)]" />
                <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[#ffb9cb]">
                  {milestone.label}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] leading-tight text-[#fff1ec] sm:text-[2rem]">
                  {milestone.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/66 sm:text-[0.98rem]">
                  {milestone.description}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 max-w-lg text-sm leading-7 text-white/52 sm:mt-10">
            {journeySectionContent.closing}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
