'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

import FinalSection from '@/components/home/FinalSection'
import ColorRevealSection from '@/components/home/ColorRevealSection'
import HeroSection from '@/components/home/HeroSection'
import JourneySection from '@/components/home/JourneySection'
import LetterSection from '@/components/home/LetterSection'
import LoveReasonsSection from '@/components/home/LoveReasonsSection'
import MemoriesSection from '@/components/home/MemoriesSection'
import SpecialWishesSection from '@/components/home/SpecialWishesSection'
import { SiteContentProvider } from '@/components/providers/SiteContentProvider'

export default function BirthdayExperience() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.2,
  })

  return (
    <SiteContentProvider>
      <main className="relative overflow-x-clip">
        <motion.div
          style={{ scaleX: progress }}
          className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-[linear-gradient(90deg,_#f7ddd9,_#ffb6c7,_#f7ddd9)]"
        />

        <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_top,_rgba(171,70,103,0.18),_transparent_34%),linear-gradient(180deg,_#090306_0%,_#12070d_40%,_#0b0408_100%)]" />
        <div className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.08] [background-image:radial-gradient(circle_at_center,_rgba(255,255,255,0.9)_0.7px,_transparent_0.7px)] [background-size:22px_22px]" />

        <HeroSection />
        <MemoriesSection />
        <ColorRevealSection />
        <JourneySection />
        <LoveReasonsSection />
        <SpecialWishesSection />
        <LetterSection />
        <FinalSection />
      </main>
    </SiteContentProvider>
  )
}
