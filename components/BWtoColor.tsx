'use client'

import dynamic from 'next/dynamic'
import type { ImageData } from '@/components/ui/img-sphere'

const SphereImageGrid = dynamic(() => import('@/components/ui/img-sphere'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center"
      style={{ width: 560, height: 560, borderRadius: '50%', background: 'rgba(232,163,163,0.15)' }}
    >
      <p style={{ color: '#E8A3A3', fontFamily: 'Playfair Display, serif' }}>Loading...</p>
    </div>
  ),
})

const BASE_IMAGES: Omit<ImageData, 'id'>[] = [
  { src: 'https://images.unsplash.com/photo-1758178309498-036c3d7d73b3?w=400&q=80', alt: 'Memory 1', title: 'A Special Moment', description: 'Every moment with you is a gift.' },
  { src: 'https://images.unsplash.com/photo-1757647016230-d6b42abc6cc9?w=400&q=80', alt: 'Memory 2', title: 'Golden Hour', description: 'You make every hour golden.' },
  { src: 'https://images.unsplash.com/photo-1757906447358-f2b2cb23d5d8?w=400&q=80', alt: 'Memory 3', title: 'Beautiful Soul', description: 'Your beauty lights up every room.' },
  { src: 'https://images.unsplash.com/photo-1742201877377-03d18a323c18?w=400&q=80', alt: 'Memory 4', title: 'Pure Joy', description: 'Your smile is my favorite sight.' },
  { src: 'https://images.unsplash.com/photo-1757081791153-3f48cd8c67ac?w=400&q=80', alt: 'Memory 5', title: 'Unforgettable', description: 'A memory I will treasure forever.' },
  { src: 'https://images.unsplash.com/photo-1757626961383-be254afee9a0?w=400&q=80', alt: 'Memory 6', title: 'Always You', description: 'My heart always finds you.' },
  { src: 'https://images.unsplash.com/photo-1756748371390-099e4e6683ae?w=400&q=80', alt: 'Memory 7', title: 'Captured Forever', description: 'This moment, saved in time.' },
  { src: 'https://images.unsplash.com/photo-1755884405235-5c0213aa3374?w=400&q=80', alt: 'Memory 8', title: 'Our Story', description: 'Chapter after chapter with you.' },
  { src: 'https://images.unsplash.com/photo-1757495404191-e94ed7e70046?w=400&q=80', alt: 'Memory 9', title: 'Simply Perfect', description: 'No words needed.' },
  { src: 'https://images.unsplash.com/photo-1756197256528-f9e6fcb82b04?w=400&q=80', alt: 'Memory 10', title: 'With You', description: 'Everywhere feels like home.' },
  { src: 'https://images.unsplash.com/photo-1534083220759-4c3c00112ea0?w=400&q=80', alt: 'Memory 11', title: 'Magic Moments', description: 'Magic happens when you are near.' },
  { src: 'https://images.unsplash.com/photo-1755278338891-e8d8481ff087?w=400&q=80', alt: 'Memory 12', title: 'My Everything', description: 'You are everything and more.' },
]

const SPHERE_IMAGES: ImageData[] = []
for (let i = 0; i < 60; i++) {
  const base = BASE_IMAGES[i % BASE_IMAGES.length]
  SPHERE_IMAGES.push({ id: `sphere-${i}`, ...base, alt: `${base.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})` })
}

export default function BWtoColor() {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #800020 0%, #3a0010 50%, #1a0008 100%)', minHeight: '100vh' }}
    >
      {/* Decorative glow rings */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(232,163,163,0.15) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div className="container-custom relative z-10 flex flex-col items-center gap-10">
        {/* Heading */}
        <div className="text-center animate-on-scroll">
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'white',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            A Universe of Moments
          </h2>
          <p style={{ color: 'rgba(255,182,193,0.8)', fontFamily: 'Poppins, sans-serif', fontSize: '1rem' }}>
            Drag to spin • Click a photo to open it ✨
          </p>
        </div>

        {/* Sphere */}
        <SphereImageGrid
          images={SPHERE_IMAGES}
          containerSize={560}
          sphereRadius={210}
          dragSensitivity={0.8}
          momentumDecay={0.96}
          maxRotationSpeed={6}
          baseImageScale={0.15}
          hoverScale={1.3}
          perspective={1000}
          autoRotate={true}
          autoRotateSpeed={0.2}
        />
      </div>
    </section>
  )
}
