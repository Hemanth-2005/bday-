'use client'

import { useEffect, useRef, useState } from 'react'

interface TimelineEvent {
  date: string
  title: string
  description: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

const EMOJIS = ['🌱', '💬', '😂', '📸', '💞']

export default function Timeline({ events }: TimelineProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [visible, setVisible] = useState<boolean[]>(Array(events.length).fill(false))

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(prev => { const n = [...prev]; n[i] = true; return n })
          }
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <section className="section" style={{ background: 'linear-gradient(150deg, #060002 0%, #160008 50%, #080003 100%)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(128,0,32,0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,182,193,0.5)', marginBottom: '0.5rem' }}>Our Story</p>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'white', textShadow: '0 0 40px rgba(255,182,193,0.3)' }}>
            Our Journey Together ✨
          </h2>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(232,163,163,0.4) 10%, rgba(232,163,163,0.4) 90%, transparent)', transform: 'translateX(-50%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {events.map((event, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <div
                  key={idx}
                  ref={el => { refs.current[idx] = el }}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center',
                    opacity: visible[idx] ? 1 : 0,
                    transform: visible[idx] ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.8s ease ${idx * 0.15}s, transform 0.8s ease ${idx * 0.15}s`,
                  }}
                >
                  {/* Left slot */}
                  <div style={{ gridColumn: 1 }}>
                    {isLeft && (
                      <div style={{ marginLeft: 'auto', maxWidth: '280px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,182,193,0.15)', borderRadius: '16px', padding: '1.25rem 1.5rem', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                        <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,182,193,0.6)', marginBottom: '0.4rem' }}>{event.date}</p>
                        <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.05rem', color: 'white', fontWeight: 600, marginBottom: '0.4rem' }}>{event.title}</h3>
                        <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.85rem', color: 'rgba(255,218,185,0.7)', fontStyle: 'italic', lineHeight: 1.5 }}>{event.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Center node */}
                  <div style={{ gridColumn: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #800020, #3a0010)', border: '2px solid rgba(232,163,163,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 0 20px rgba(128,0,32,0.5)' }}>
                      {EMOJIS[idx % EMOJIS.length]}
                    </div>
                  </div>

                  {/* Right slot */}
                  <div style={{ gridColumn: 3 }}>
                    {!isLeft && (
                      <div style={{ maxWidth: '280px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,182,193,0.15)', borderRadius: '16px', padding: '1.25rem 1.5rem', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                        <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,182,193,0.6)', marginBottom: '0.4rem' }}>{event.date}</p>
                        <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.05rem', color: 'white', fontWeight: 600, marginBottom: '0.4rem' }}>{event.title}</h3>
                        <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.85rem', color: 'rgba(255,218,185,0.7)', fontStyle: 'italic', lineHeight: 1.5 }}>{event.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(128,0,32,0.2)', border: '1px solid rgba(232,163,163,0.3)', borderRadius: '9999px', padding: '0.7rem 2rem', fontFamily: '"Playfair Display", serif', fontSize: '1rem', color: 'rgba(255,182,193,0.9)', fontStyle: 'italic' }}>
            ✨ And the story continues...
          </div>
        </div>
      </div>
    </section>
  )
}
