'use client'

import { motion } from 'framer-motion'
import { useSiteContent } from '@/components/providers/SiteContentProvider'

export default function LetterSection() {
  const { closingLines, letterSectionContent } = useSiteContent()

  return (
    <section className="relative px-5 py-[4.5rem] sm:px-8 md:py-28">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6 md:rounded-[2.4rem] md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.26 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-white/60 backdrop-blur">
            {letterSectionContent.eyebrow}
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.35rem,9vw,3.3rem)] leading-tight text-[#fff4ef] sm:text-5xl">
            {letterSectionContent.title}
          </h2>

          <div className="mt-8 space-y-4">
            {closingLines.map((line, index) => (
              <p
                key={line}
                className="text-sm leading-7 text-white/74 sm:text-base sm:leading-8"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
