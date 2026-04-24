'use client'

import { useEffect, useRef, useState } from 'react'

const LINES = [
  'Today is your day —',
  'the day the world got a little brighter,',
  'a little warmer,',
  'and a whole lot more beautiful.',
  '',
  'You are the kind of person who makes',
  'everything feel like home.',
  '',
  'You deserve all the love in the world. ❤️',
]

export default function BirthdayMessage() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(160deg, #0d0005 0%, #200010 50%, #0a0003 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(232,163,163,0.6), transparent)',
        pointerEvents: 'none',
      }} />

      <div ref={ref} style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', maxWidth: '700px' }}>
        {/* Decorative sparkle */}
        <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', animation: 'spin 6s linear infinite' }}>✨</div>

        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          color: 'white',
          marginBottom: '2.5rem',
          textShadow: '0 0 40px rgba(255,182,193,0.5)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}>
          Happy Birthday! 🎂
        </h2>

        {/* Quote open */}
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '6rem', lineHeight: 0.7,
          color: 'rgba(128,0,32,0.5)',
          textAlign: 'left', marginBottom: '0.5rem',
          opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease 0.3s',
        }}>&ldquo;</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {LINES.map((line, i) => (
            line === '' ? <br key={i} /> : (
              <p key={i} style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(1rem, 2.2vw, 1.4rem)',
                color: i === LINES.length - 1
                  ? '#FFB6C1'
                  : 'rgba(255,245,235,0.88)',
                fontWeight: i === LINES.length - 1 ? 700 : 400,
                fontStyle: i > 4 && i < 8 ? 'italic' : 'normal',
                lineHeight: 1.7,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.9s ease ${0.4 + i * 0.15}s, transform 0.9s ease ${0.4 + i * 0.15}s`,
              }}>
                {line}
              </p>
            )
          ))}
        </div>

        {/* Quote close */}
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '6rem', lineHeight: 0.7,
          color: 'rgba(128,0,32,0.5)',
          textAlign: 'right', marginTop: '0.5rem',
          opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease 2s',
        }}>&rdquo;</div>
      </div>

      {/* Bottom glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(232,163,163,0.6), transparent)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
