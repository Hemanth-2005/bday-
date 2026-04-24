'use client'

import { motion } from 'framer-motion'

import { useSiteContent } from '@/components/providers/SiteContentProvider'

export default function FinalSection() {
  const { finalSectionContent } = useSiteContent()

  return (
    <section className="relative px-5 pb-24 pt-4 sm:px-8 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="mx-auto max-w-4xl text-center"
      >
        <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#ffc5d4]">
          {finalSectionContent.eyebrow}
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.9rem,7vw,2.6rem)] leading-tight text-[#fff3ee]">
          {finalSectionContent.title}
        </h2>
        <p className="mt-5 text-xs uppercase tracking-[0.26em] text-white/42 sm:text-[0.78rem]">
          {finalSectionContent.tags[0]}
        </p>
      </motion.div>
    </section>
  )
}
