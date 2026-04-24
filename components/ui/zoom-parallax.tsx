'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

interface ImageItem {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  images: ImageItem[]
}

const IMAGE_POSITIONS = [
  'h-[46vh] w-[72vw] max-w-[28rem] sm:w-[58vw] md:h-[54vh] md:w-[34vw]',
  'top-[10%] left-[7%] h-[20vh] w-[34vw] sm:w-[28vw] md:top-[12%] md:left-[10%] md:h-[28vh] md:w-[22vw]',
  'top-[18%] right-[4%] h-[24vh] w-[26vw] sm:w-[24vw] md:top-[14%] md:right-[11%] md:h-[38vh] md:w-[18vw]',
  'bottom-[16%] left-[8%] h-[18vh] w-[30vw] sm:w-[26vw] md:bottom-[16%] md:left-[18%] md:h-[22vh] md:w-[20vw]',
  'bottom-[22%] right-[9%] h-[20vh] w-[24vw] sm:w-[20vw] md:bottom-[18%] md:right-[15%] md:h-[26vh] md:w-[16vw]',
  'bottom-[8%] left-[50%] h-[16vh] w-[36vw] max-w-[16rem] -translate-x-1/2 md:bottom-[10%] md:h-[20vh] md:w-[22vw]',
  'top-[40%] right-[16%] h-[14vh] w-[18vw] sm:w-[16vw] md:top-[42%] md:right-[27%] md:h-[16vh] md:w-[12vw]',
]

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  return (
    <div ref={containerRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden rounded-[2rem] border border-white/10 bg-[#12060c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,205,214,0.18),_transparent_42%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_48%,_rgba(255,255,255,0.04))]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,_rgba(10,3,6,0.95),_transparent)]" />

        {images.slice(0, 7).map(({ src, alt }, index) => {
          const scale = scales[index % scales.length]

          return (
            <motion.div
              key={`${src}-${index}`}
              style={{ scale }}
              className="absolute inset-0 flex items-center justify-center px-4 will-change-transform"
            >
              <div
                className={cn(
                  'absolute overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#1a0b12] shadow-[0_30px_80px_rgba(0,0,0,0.35)]',
                  IMAGE_POSITIONS[index % IMAGE_POSITIONS.length]
                )}
              >
                <img
                  src={src}
                  alt={alt || `Journey image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.1),_transparent_28%,_rgba(0,0,0,0.3))]" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
