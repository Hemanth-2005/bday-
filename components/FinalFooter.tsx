'use client'

import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const STARS = Array.from({ length: 60 }, (_, i) => ({
  top: `${(i * 7 + 3) % 100}%`,
  left: `${(i * 11 + 5) % 100}%`,
  size: `${1 + (i % 3)}px`,
  delay: `${(i * 0.3) % 4}s`,
  duration: `${2 + (i % 3)}s`,
}))

const HEARTS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 9 + 2) % 100}%`,
  delay: `${(i * 0.6) % 5}s`,
  duration: `${4 + (i % 4)}s`,
  size: `${16 + (i % 4) * 8}px`,
}))

export default function FinalFooter() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const fired = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        if (!fired.current) {
          fired.current = true
          // Confetti burst
          const end = Date.now() + 4000
          const colors = ['#FFB6C1', '#FFC0CB', '#E8A3A3', '#800020', '#ffffff', '#ffd700']
          const frame = () => {
            confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors })
            confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors })
            if (Date.now() < end) requestAnimationFrame(frame)
          }
          frame()
        }
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a0008 0%, #000000 70%)', overflow: 'hidden' }}
    >
      {/* Starfield */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', top: s.top, left: s.left,
          width: s.size, height: s.size,
          borderRadius: '50%', background: 'white',
          opacity: 0,
          animation: `starTwinkle ${s.duration} ${s.delay} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Floating hearts */}
      {HEARTS.map((h, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: h.left, bottom: '-20px',
          fontSize: h.size,
          opacity: 0,
          animation: `heartRise ${h.duration} ${h.delay} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 1,
        }}>❤️</div>
      ))}

      {/* Center ambient glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(128,0,32,0.3) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
        animation: 'glowPulse 4s ease-in-out infinite',
      }} />

      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 1.4s ease, transform 1.4s ease',
      }}>
        {/* Animated heart */}
        <div style={{ animation: 'heartBeat 1.2s ease-in-out infinite', fontSize: '4rem', filter: 'drop-shadow(0 0 30px rgba(255,100,100,0.8))' }}>
          ❤️
        </div>

        {/* Main text — shimmer */}
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800,
          background: 'linear-gradient(90deg, #FFB6C1, #ffffff, #FFB6C1, #ffd0d8, #ffffff)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmerText 3s linear infinite',
          letterSpacing: '0.04em',
          textShadow: 'none',
        }}>
          Forever yours ❤️
        </h2>

        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          color: 'rgba(255,218,185,0.7)',
          fontStyle: 'italic',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.4s ease 0.6s',
        }}>
          All my love... only for you.
        </p>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ width: '60px', height: '1px', background: 'rgba(232,163,163,0.4)' }} />
          <span style={{ color: 'rgba(255,182,193,0.6)', fontSize: '1.2rem' }}>✨</span>
          <div style={{ width: '60px', height: '1px', background: 'rgba(232,163,163,0.4)' }} />
        </div>

        <p style={{
          fontFamily: '"Poppins", sans-serif', fontSize: '0.8rem',
          color: 'rgba(255,182,193,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase',
          opacity: visible ? 1 : 0, transition: 'opacity 1.4s ease 1s',
        }}>
          Made with love • Happy Birthday Saniya 🎂
        </p>
      </div>

      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50%       { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes heartRise {
          0%   { transform: translateY(0) scale(0.5); opacity: 0; }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 1; transform: translate(-50%,-50%) scale(1.15); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          30%       { transform: scale(1.2); }
          60%       { transform: scale(1.05); }
        }
        @keyframes shimmerText {
          0%   { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  )
}
