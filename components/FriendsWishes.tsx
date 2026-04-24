'use client'

import { useRef, useState, useEffect } from 'react'

interface FriendsWishesProps {
  videoSrc: string
}

const WISH_CARDS = [
  { name: 'From a friend who loves you 💜', msg: 'You make every room brighter just by walking in. Happy Birthday!' },
  { name: 'From someone who misses you 💛', msg: 'Distance means nothing when someone means everything. Wishing you the happiest day!' },
  { name: 'From your forever fan 💖', msg: 'You deserve all the cake, all the love, and all the good things today and always.' },
]

export default function FriendsWishes({ videoSrc }: FriendsWishesProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setActiveCard(p => (p + 1) % WISH_CARDS.length), 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: 'linear-gradient(150deg, #08000f 0%, #160020 50%, #06000a 100%)', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(80,0,128,0.2) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Floating hearts */}
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 11 + 4) % 100}%`,
          fontSize: `${12 + (i % 3) * 8}px`,
          opacity: 0.15,
          animation: `heartFloat ${5 + (i % 4)}s ${(i * 0.8)}s ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 1,
        }}>❤️</div>
      ))}

      <div style={{
        position: 'relative', zIndex: 2, width: '100%', maxWidth: '700px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,150,255,0.5)', marginBottom: '0.5rem' }}>Everyone loves you</p>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'white', textShadow: '0 0 40px rgba(180,100,255,0.3)' }}>
            You&apos;re not the only one who loves you 💜
          </h2>
        </div>

        {/* Video if available, else wish cards */}
        {hasVideo ? (
          <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(80,0,128,0.3)' }}>
            <video ref={videoRef} src={videoSrc} className="w-full" controls onError={() => setHasVideo(false)} />
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            {/* Rotating wish cards */}
            <div style={{ position: 'relative', minHeight: '200px' }}>
              {WISH_CARDS.map((card, i) => (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(200,150,255,0.2)',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                  textAlign: 'center',
                  opacity: i === activeCard ? 1 : 0,
                  transform: i === activeCard ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}>
                  <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,245,235,0.9)', lineHeight: 1.8, fontStyle: 'italic' }}>
                    &ldquo;{card.msg}&rdquo;
                  </p>
                  <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.8rem', color: 'rgba(200,150,255,0.7)', letterSpacing: '0.1em' }}>
                    {card.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14rem' }}>
              {WISH_CARDS.map((_, i) => (
                <div key={i} style={{
                  width: i === activeCard ? '24px' : '8px',
                  height: '8px', borderRadius: '9999px',
                  background: i === activeCard ? 'rgba(200,150,255,0.8)' : 'rgba(200,150,255,0.25)',
                  transition: 'all 0.4s ease',
                }} />
              ))}
            </div>

            <p style={{ textAlign: 'center', fontFamily: '"Playfair Display", serif', color: 'rgba(255,218,185,0.5)', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '1.5rem' }}>
              Drop a video at /public/videos/friends-wishes.mp4 to show it here 🎬
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes heartFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </section>
  )
}
