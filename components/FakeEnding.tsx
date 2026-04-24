'use client'

import { useEffect, useRef, useState } from 'react'

export default function FakeEnding() {
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        // Trigger sequence only when section enters view
        setTimeout(() => setStep(1), 400)
        setTimeout(() => setStep(2), 2200)
        setTimeout(() => setStep(3), 3800)
      } else {
        setStep(0)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: '#000000', overflow: 'hidden', position: 'relative' }}
    >
      {/* Curtain left */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
        background: 'linear-gradient(to right, #0a0000, #1a0008)',
        transform: step >= 2 ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 1.4s cubic-bezier(0.77,0,0.18,1)',
        zIndex: 3,
      }} />
      {/* Curtain right */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
        background: 'linear-gradient(to left, #0a0000, #1a0008)',
        transform: step >= 2 ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 1.4s cubic-bezier(0.77,0,0.18,1)',
        zIndex: 3,
      }} />

      {/* Cinematic bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: '#000', zIndex: 4 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: '#000', zIndex: 4 }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {/* "The End" */}
        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 800,
          color: 'white',
          letterSpacing: '0.1em',
          textShadow: '0 0 60px rgba(255,255,255,0.15)',
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9)',
          transition: 'opacity 1.2s ease, transform 1.2s ease',
        }}>
          The End.
        </p>

        {/* "...or is it?" */}
        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
          color: '#FFB6C1',
          fontStyle: 'italic',
          textShadow: '0 0 40px rgba(255,182,193,0.4)',
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}>
          ...or is it? 😏
        </p>

        {/* Arrow */}
        <div style={{
          opacity: step >= 3 ? 1 : 0,
          transition: 'opacity 1s ease 0.5s',
          animation: step >= 3 ? 'bounceArrow 1.6s ease-in-out infinite' : 'none',
          marginTop: '1rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <p style={{ color: 'rgba(255,182,193,0.4)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: '"Poppins", sans-serif' }}>
            One more thing...
          </p>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,182,193,0.5)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
      `}</style>
    </section>
  )
}
