'use client'

import { useEffect, useState } from 'react'

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 13 + 3) % 100}%`,
  delay: `${(i * 0.45) % 5}s`,
  duration: `${4 + (i * 0.7) % 5}s`,
  size: `${3 + (i % 4) * 2}px`,
}))

const ORBS = [
  { top: '15%', left: '10%', size: '380px', color: 'rgba(128,0,32,0.18)', blur: '80px', delay: '0s' },
  { top: '55%', left: '75%', size: '300px', color: 'rgba(232,163,163,0.12)', blur: '70px', delay: '1.5s' },
  { top: '70%', left: '20%', size: '260px', color: 'rgba(255,182,193,0.1)', blur: '60px', delay: '3s' },
]

export default function LandingVideo() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  return (
    <section className="section" style={{ background: '#080004', overflow: 'hidden' }}>
      {/* Animated orbs */}
      {ORBS.map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', top: orb.top, left: orb.left,
          width: orb.size, height: orb.size,
          background: orb.color, borderRadius: '50%',
          filter: `blur(${orb.blur})`,
          animation: `orbPulse 8s ${orb.delay} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Sparkle particles */}
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, bottom: '-10px',
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: 'rgba(255,182,193,0.7)',
          boxShadow: '0 0 6px rgba(255,182,193,0.9)',
          animation: `sparkleRise ${p.duration} ${p.delay} ease-in infinite`,
          pointerEvents: 'none', zIndex: 1,
        }} />
      ))}

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
        padding: '2rem',
        opacity: mounted ? 1 : 0, transition: 'opacity 1.4s ease',
      }}>
        {/* Pulsing heart */}
        <div style={{ animation: 'heartPulse 1.4s ease-in-out infinite', position: 'relative' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: 'radial-gradient(circle, #800020 0%, #3a0010 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(128,0,32,0.6), 0 0 80px rgba(128,0,32,0.3)',
          }}>
            <span style={{ fontSize: '2.5rem' }}>💖</span>
          </div>
        </div>

        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800,
          color: 'white',
          letterSpacing: mounted ? '0.06em' : '0.25em',
          transition: 'letter-spacing 2s ease',
          textShadow: '0 0 60px rgba(232,163,163,0.4), 0 4px 20px rgba(0,0,0,0.8)',
          lineHeight: 1.1,
        }}>
          Happy Birthday
          <br />
          <span style={{ color: '#FFB6C1', fontSize: '0.9em' }}>Saniya 🎂</span>
        </h1>

        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          color: 'rgba(255,218,185,0.8)',
          fontStyle: 'italic', letterSpacing: '0.04em',
          maxWidth: '520px', lineHeight: 1.7,
        }}>
          &ldquo;I found a love for me...&rdquo;
          <br />
          <span style={{ fontSize: '0.85em', color: 'rgba(255,182,193,0.6)' }}>— Every song reminds me of you</span>
        </p>

        {/* Scroll CTA */}
        <div style={{
          marginTop: '1rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <p style={{ color: 'rgba(255,182,193,0.4)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: '"Poppins", sans-serif' }}>
            Scroll to explore
          </p>
          <div style={{ animation: 'bounceArrow 1.8s ease-in-out infinite' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,182,193,0.5)" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.25); opacity: 1; }
        }
        @keyframes sparkleRise {
          0%   { transform: translateY(0) scale(0); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
      `}</style>
    </section>
  )
}
