'use client'

import { motion } from 'framer-motion'

import { useSiteContent } from '@/components/providers/SiteContentProvider'
import { RevealWaveImage } from '@/components/ui/reveal-wave-image'
import { getMediaUrl } from '@/lib/media'

export default function ColorRevealSection() {
  const { colorRevealSectionContent } = useSiteContent()

  return (
    <section className="relative min-h-screen overflow-hidden px-5 py-16 sm:px-8 sm:py-18 lg:py-20">
      <div className="pointer-events-none absolute left-[6%] top-[16%] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(255,209,219,0.14),_transparent_66%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] top-[24%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(154,62,92,0.18),_transparent_70%)] blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-8 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 order-1 max-w-2xl"
        >
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#ffc6d3]">
            {colorRevealSectionContent.eyebrow}
          </p>

          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.55rem,11vw,4rem)] leading-tight text-[#fff5f0] sm:text-5xl md:text-6xl">
            {colorRevealSectionContent.title}
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
            {colorRevealSectionContent.body}
          </p>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
            {colorRevealSectionContent.bodyTwo}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative order-2 min-h-[19rem] overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] sm:min-h-[24rem] lg:min-h-[42rem] lg:rounded-none lg:border-0 lg:bg-transparent"
        >
          <div className="absolute inset-0">
            <RevealWaveImage
              src={getMediaUrl(colorRevealSectionContent.image)}
              waveSpeed={0.22}
              waveFrequency={0.7}
              waveAmplitude={0.5}
              revealRadius={0.42}
              revealSoftness={1}
              pixelSize={2}
              mouseRadius={0.38}
              className="h-full w-full"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(9,3,6,0.08),_transparent_18%,_transparent_82%,_rgba(9,3,6,0.2))] lg:bg-[linear-gradient(90deg,_rgba(9,3,6,0.04),_transparent_24%,_transparent_76%,_rgba(9,3,6,0.14))]" />
        </motion.div>
      </div>
    </section>
  )
}
