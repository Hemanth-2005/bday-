'use client'

import { useEffect, useRef, useState } from 'react'

const memoriesImages = [
  { src: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Mountain landscape' },
  { src: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Ocean waves' },
  { src: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Forest path' },
  { src: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Desert dunes' },
  { src: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'City skyline' },
  { src: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Northern lights' },
  { src: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Waterfall' },
  { src: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Sunset beach' },
  { src: 'https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Mountain peaks' },
  { src: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Misty morning' },
]

export default function Memories() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const total = memoriesImages.length

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % total)
    }, 2200)
  }

  useEffect(() => {
    startAutoPlay()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const goTo = (idx: number) => {
    setActiveIndex(((idx % total) + total) % total)
    startAutoPlay()
  }

  // Positions: center is active, ±1 are side, ±2 are far-side, rest hidden
  const getStyle = (offset: number): React.CSSProperties => {
    const absOffset = Math.abs(offset)
    if (absOffset > 3) return { opacity: 0, pointerEvents: 'none', display: 'none' }

    const translateX = offset * 260
    const translateZ = -absOffset * 120
    const rotateY = offset * -22
    const scale = 1 - absOffset * 0.18
    const opacity = 1 - absOffset * 0.3
    const zIndex = 10 - absOffset * 2

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      position: 'absolute',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: offset === 0 ? 'default' : 'pointer',
      filter: absOffset > 0 ? `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.2})` : 'none',
    }
  }

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0005 0%, #1a000d 50%, #0a0005 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(128,0,32,0.25) 0%, transparent 65%)',
      }} />

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 20 }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          color: 'white',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}>
          <span style={{ fontStyle: 'italic', color: '#FFDAB9' }}>Our</span> Memories
        </h2>
        <p style={{ color: 'rgba(255,182,193,0.7)', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>
          Click to explore each moment ✨
        </p>
      </div>

      {/* 3D CSS Carousel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1000px',
          height: '420px',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
          {memoriesImages.map((img, i) => {
            const offset = ((i - activeIndex + total) % total + total) % total
            // Normalize to -total/2 ... total/2
            const normalizedOffset = offset > total / 2 ? offset - total : offset
            const style = getStyle(normalizedOffset)

            return (
              <div
                key={i}
                style={{
                  ...style,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-160px',
                  marginTop: '-120px',
                  width: '320px',
                  height: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: normalizedOffset === 0
                    ? '0 30px 80px rgba(128,0,32,0.6), 0 0 0 2px rgba(255,218,185,0.3)'
                    : '0 10px 30px rgba(0,0,0,0.5)',
                }}
                onClick={() => normalizedOffset !== 0 && goTo(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                {/* Shine overlay on active */}
                {normalizedOffset === 0 && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '2.5rem', position: 'relative', zIndex: 20 }}>
        {memoriesImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === activeIndex ? '#FFDAB9' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Caption */}
      <p style={{
        color: 'rgba(255,218,185,0.6)',
        fontFamily: 'Playfair Display, serif',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        marginTop: '1.5rem',
        position: 'relative',
        zIndex: 20,
        transition: 'opacity 0.3s',
      }}>
        {memoriesImages[activeIndex].alt}
      </p>

      {/* Arrow nav */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', position: 'relative', zIndex: 20 }}>
        <button
          onClick={() => goTo(activeIndex - 1)}
          style={{
            background: 'rgba(255,218,185,0.1)',
            border: '1px solid rgba(255,218,185,0.3)',
            color: '#FFDAB9',
            borderRadius: '50%',
            width: '44px', height: '44px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </button>
        <button
          onClick={() => goTo(activeIndex + 1)}
          style={{
            background: 'rgba(255,218,185,0.1)',
            border: '1px solid rgba(255,218,185,0.3)',
            color: '#FFDAB9',
            borderRadius: '50%',
            width: '44px', height: '44px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          →
        </button>
      </div>
    </section>
  )
}
