'use client'

import { useEffect, useRef, useState } from 'react'

const LINES = [
  { text: 'Thank you for making me believe in magic again.', delay: 0 },
  { text: 'For every late-night conversation that felt like home.', delay: 1 },
  { text: 'For every laugh that made my chest hurt.', delay: 2 },
  { text: 'For choosing me — every single day.', delay: 3 },
  { text: 'You are my favourite kind of chaos.', delay: 4 },
  { text: 'My calmest storm.', delay: 5 },
  { text: 'My most beautiful accident. ❤️', delay: 6 },
]

export default function ThankYouNote() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: 'linear-gradient(160deg, #0d0005 0%, #1e000c 50%, #090003 100%)', overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(128,0,32,0.2) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Rose petals */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 13 + 5) % 100}%`,
          top: '-20px',
          fontSize: `${14 + (i % 3) * 8}px`,
          opacity: 0.25,
          animation: `petalDrift ${7 + (i % 4)}s ${(i * 0.9)}s ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 1,
        }}>🌸</div>
      ))}

      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', maxWidth: '620px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      }}>
        {/* Opening quote */}
        <div style={{
          fontFamily: '"Playfair Display", serif', fontSize: '5rem', lineHeight: 0.8,
          color: 'rgba(128,0,32,0.5)', marginBottom: '1rem', alignSelf: 'flex-start',
          opacity: visible ? 1 : 0, transition: 'opacity 1s ease',
        }}>&ldquo;</div>

        {LINES.map((line, i) => (
          <p key={i} style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.05rem, 2.2vw, 1.45rem)',
            color: i === LINES.length - 1 ? '#FFB6C1' : 'rgba(255,245,235,0.85)',
            fontStyle: 'italic',
            lineHeight: 1.8,
            fontWeight: i === LINES.length - 1 ? 700 : 400,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 1s ease ${0.3 + line.delay * 0.25}s, transform 1s ease ${0.3 + line.delay * 0.25}s`,
          }}>
            {line.text}
          </p>
        ))}

        {/* Closing quote */}
        <div style={{
          fontFamily: '"Playfair Display", serif', fontSize: '5rem', lineHeight: 0.8,
          color: 'rgba(128,0,32,0.5)', marginTop: '0.5rem', alignSelf: 'flex-end',
          opacity: visible ? 1 : 0, transition: 'opacity 1s ease 2.5s',
        }}>&rdquo;</div>

        {/* Signature */}
        <div style={{
          marginTop: '2.5rem',
          opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease 3s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <div style={{ width: '60px', height: '1px', background: 'rgba(232,163,163,0.4)' }} />
          <p style={{
            fontFamily: '"Dancing Script", cursive, "Playfair Display", serif',
            fontSize: '1.8rem', color: 'rgba(255,182,193,0.8)',
            fontStyle: 'italic', letterSpacing: '0.05em',
          }}>
            — With all my love 💌
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        @keyframes petalDrift {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.3; }
          90%  { opacity: 0.15; }
          100% { transform: translateY(110vh) rotate(180deg) translateX(40px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
