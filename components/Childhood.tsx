'use client'

import { useState, useEffect, useRef } from 'react'

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    caption: 'From this little star...',
    year: 'Once upon a time',
  },
  {
    src: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=800&q=80',
    caption: 'Growing up beautifully...',
    year: 'Day by day',
  },
  {
    src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',
    caption: 'Every smile, a new memory...',
    year: 'Moment by moment',
  },
  {
    src: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80',
    caption: 'Into someone extraordinary...',
    year: 'Year by year',
  },
  {
    src: 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=800&q=80',
    caption: 'The person I treasure most ❤️',
    year: 'Today & always',
  },
]

const ROTATIONS = ['-2deg', '1.5deg', '-1deg', '2.5deg', '-1.5deg']

export default function Childhood() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [dir, setDir] = useState<'left' | 'right'>('right')
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const goTo = (next: number, direction: 'left' | 'right') => {
    if (animating) return
    setDir(direction)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(next)
      setAnimating(false)
    }, 420)
  }

  const prev = () => goTo((current - 1 + PHOTOS.length) % PHOTOS.length, 'left')
  const next = () => goTo((current + 1) % PHOTOS.length, 'right')

  return (
    <section
      ref={ref}
      className="section"
      style={{
        background: 'linear-gradient(170deg, #0a0003 0%, #180008 40%, #0f0005 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(128,0,32,0.2) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem',
        width: '100%', maxWidth: '600px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}>
        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,182,193,0.5)', marginBottom: '0.5rem' }}>
            Chapter One
          </p>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'white', textShadow: '0 0 40px rgba(255,182,193,0.3)' }}>
            Your Journey 🌸
          </h2>
        </div>

        {/* Polaroid card */}
        <div style={{
          position: 'relative',
          width: 'min(420px, 90vw)',
        }}>
          {/* Stack shadows */}
          <div style={{
            position: 'absolute', inset: 0,
            background: '#1a0008', borderRadius: '4px',
            transform: `rotate(${ROTATIONS[(current + 2) % ROTATIONS.length]}) translate(6px, 6px)`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: '#220010', borderRadius: '4px',
            transform: `rotate(${ROTATIONS[(current + 1) % ROTATIONS.length]}) translate(3px, 3px)`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }} />

          {/* Main card */}
          <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '14px 14px 50px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
            transform: `rotate(${ROTATIONS[current % ROTATIONS.length]})`,
            transition: 'transform 0.4s ease',
            position: 'relative', zIndex: 2,
          }}>
            {/* Photo */}
            <div style={{
              width: '100%', aspectRatio: '4/3', overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Ken Burns */}
              <img
                src={PHOTOS[current].src}
                alt={PHOTOS[current].caption}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  animation: 'kenBurns 8s ease-in-out infinite',
                  opacity: animating ? 0 : 1,
                  transform: animating ? (dir === 'right' ? 'translateX(-20px)' : 'translateX(20px)') : 'translateX(0)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
              />
              {/* Film grain overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                opacity: 0.06, pointerEvents: 'none', mixBlendMode: 'overlay',
              }} />
            </div>
            {/* Caption below photo */}
            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '0.95rem', textAlign: 'center', color: '#800020',
              marginTop: '12px', fontStyle: 'italic',
              opacity: animating ? 0 : 1, transition: 'opacity 0.3s ease',
            }}>
              {PHOTOS[current].caption}
            </p>
            <p style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: '0.7rem', textAlign: 'center', color: 'rgba(128,0,32,0.5)',
              marginTop: '4px', letterSpacing: '0.1em',
            }}>
              {PHOTOS[current].year}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={prev}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,182,193,0.2)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,182,193,0.8)', fontSize: '1.2rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,0,32,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            ‹
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                style={{
                  width: i === current ? '28px' : '8px',
                  height: '8px', borderRadius: '9999px',
                  background: i === current ? '#E8A3A3' : 'rgba(255,182,193,0.3)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,182,193,0.2)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,182,193,0.8)', fontSize: '1.2rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,0,32,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            ›
          </button>
        </div>
      </div>

      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1) translate(0, 0); }
          50%  { transform: scale(1.06) translate(-1%, 1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
      `}</style>
    </section>
  )
}
