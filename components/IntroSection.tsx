'use client'

import { useEffect, useState, useRef } from 'react'

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 17 + 7) % 100}%`,
  delay: `${(i * 0.7) % 6}s`,
  duration: `${6 + (i * 1.3) % 6}s`,
  size: `${10 + (i * 4) % 18}px`,
  opacity: 0.3 + (i % 4) * 0.15,
}))

const LINES = [
  { text: 'Hey Saniya...', delay: 0 },
  { text: 'I made something just for you.', delay: 1800 },
  { text: 'Scroll slowly — each section is a piece of my heart. ❤️', delay: 3800 },
]

export default function IntroSection() {
  const [visible, setVisible] = useState<boolean[]>([])
  const [showArrow, setShowArrow] = useState(false)

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, line.delay)
    })
    setTimeout(() => setShowArrow(true), 6000)
  }, [])

  return (
    <section
      className="section"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, #1a000a 0%, #000000 70%)',
        overflow: 'hidden',
      }}
    >
      {/* Floating rose petals */}
      {PETALS.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-30px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `petalFall ${p.duration} ${p.delay} ease-in infinite`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          🌹
        </div>
      ))}

      {/* Center glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 55%, rgba(128,0,32,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', gap: '2rem', padding: '2rem',
      }}>
        {LINES.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.4rem, 4vw, 2.8rem)',
              color: i === 2 ? '#FFB6C1' : 'rgba(255,255,255,0.92)',
              textShadow: '0 0 40px rgba(232,163,163,0.6), 0 2px 8px rgba(0,0,0,0.8)',
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 1.2s ease, transform 1.2s ease',
              letterSpacing: '0.02em',
              maxWidth: '700px',
              lineHeight: 1.5,
              fontWeight: i === 2 ? 400 : 600,
            }}
          >
            {line.text}
          </p>
        ))}

        {/* Animated scroll arrow */}
        <div style={{
          marginTop: '2.5rem',
          opacity: showArrow ? 1 : 0,
          transition: 'opacity 1.5s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <p style={{ color: 'rgba(255,182,193,0.5)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Poppins", sans-serif' }}>Scroll to begin</p>
          <div style={{ animation: 'bounceArrow 1.6s ease-in-out infinite' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,182,193,0.6)" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-30px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
      `}</style>
    </section>
  )
}
