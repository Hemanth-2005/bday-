'use client'

import { useState, useEffect, useRef } from 'react'

const TRAITS = [
  {
    emoji: '👁️',
    title: 'The way you look at me...',
    text: 'Those eyes say everything without a single word.',
    gradient: 'linear-gradient(135deg, #1a0030, #4a0060)',
    glow: 'rgba(180,0,255,0.3)',
    accent: '#d4a0ff',
  },
  {
    emoji: '😊',
    title: 'The way you smile...',
    text: 'It fixes absolutely everything in my world.',
    gradient: 'linear-gradient(135deg, #1a0a00, #502000)',
    glow: 'rgba(255,140,0,0.3)',
    accent: '#ffb86c',
  },
  {
    emoji: '😤',
    title: 'Even when you\'re angry...',
    text: 'You\'re still the most adorable person I\'ve ever seen.',
    gradient: 'linear-gradient(135deg, #1a0005, #500010)',
    glow: 'rgba(255,0,80,0.3)',
    accent: '#ff7090',
  },
  {
    emoji: '🤪',
    title: 'Your weird side...',
    text: 'Honestly? This is my absolute favorite version of you.',
    gradient: 'linear-gradient(135deg, #001a10, #005030)',
    glow: 'rgba(0,200,100,0.3)',
    accent: '#80ffb0',
  },
  {
    emoji: '🌟',
    title: 'Everything about you...',
    text: 'Feels like home. Every single time.',
    gradient: 'linear-gradient(135deg, #0a0a1a, #1a1a50)',
    glow: 'rgba(100,150,255,0.3)',
    accent: '#a0c0ff',
  },
]

export default function WhyLoveYou() {
  const [active, setActive] = useState(0)
  const [typingIndex, setTypingIndex] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const trait = TRAITS[active]
  const displayText = trait.text.slice(0, typingIndex)
  const typing = typingIndex < trait.text.length

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingIndex(prev => {
        if (prev >= trait.text.length) return prev
        return prev + 1
      })
    }, 28)

    return () => clearInterval(interval)
  }, [trait.text.length])

  return (
    <section
      ref={ref}
      className="section"
      style={{
        background: trait.gradient,
        transition: 'background 0.8s ease',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic glow orb */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '500px', height: '500px', borderRadius: '50%',
        background: `radial-gradient(circle, ${trait.glow} 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        transition: 'background 0.8s ease',
      }} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '860px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}>
        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,182,193,0.5)', marginBottom: '0.5rem' }}>Reasons</p>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'white', textShadow: `0 0 40px ${trait.glow}`, transition: 'text-shadow 0.8s ease' }}>
            Why I Love You 💕
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: '2rem', width: '100%', alignItems: 'center' }}>
          {/* Trait buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {TRAITS.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setActive(i)
                  setTypingIndex(0)
                }}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  border: `1px solid ${i === active ? trait.accent : 'rgba(255,255,255,0.08)'}`,
                  background: i === active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  transform: i === active ? 'translateX(6px)' : 'translateX(0)',
                  boxShadow: i === active ? `0 0 20px ${trait.glow}` : 'none',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{t.emoji}</span>
                <span style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '0.95rem',
                  color: i === active ? 'white' : 'rgba(255,255,255,0.55)',
                  fontWeight: i === active ? 600 : 400,
                  transition: 'color 0.3s ease',
                }}>
                  {t.title}
                </span>
              </button>
            ))}
          </div>

          {/* Display card */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${trait.accent}40`,
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`,
            transition: 'border-color 0.8s ease',
            minHeight: '200px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '3.5rem',
              animation: 'emojiPop 0.4s ease',
              filter: `drop-shadow(0 0 20px ${trait.glow})`,
            }}>
              {trait.emoji}
            </div>
            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: 'white',
              lineHeight: 1.7,
              fontStyle: 'italic',
              minHeight: '80px',
            }}>
              &ldquo;{displayText}{typing ? <span style={{ animation: 'blink 0.7s step-end infinite', borderRight: `2px solid ${trait.accent}` }}>&nbsp;</span> : ''}&rdquo;
            </p>
            <div style={{ width: '40px', height: '2px', borderRadius: '9999px', background: trait.accent, opacity: 0.6 }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes emojiPop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
