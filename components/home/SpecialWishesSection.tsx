'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useSiteContent } from '@/components/providers/SiteContentProvider'

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export default function SpecialWishesSection() {
  const { specialWishEntries, specialWishesSectionContent } = useSiteContent()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [guess, setGuess] = useState('')
  const [status, setStatus] = useState<'question' | 'wrong' | 'playing' | 'missing' | 'done'>('question')
  const [lockSeconds, setLockSeconds] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentEntry = specialWishEntries[currentIndex]
  const progressLabel = useMemo(
    () => `${Math.min(currentIndex + 1, specialWishEntries.length)} / ${specialWishEntries.length}`,
    [currentIndex, specialWishEntries.length]
  )

  useEffect(() => {
    if (lockSeconds <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setLockSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setStatus('question')
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [lockSeconds])

  useEffect(() => {
    if (status !== 'playing') {
      return
    }

    if (currentEntry?.mediaType === 'audio') {
      const audio = audioRef.current
      if (!audio) {
        return
      }

      audio.currentTime = 0
      audio.play().catch(() => {
        setStatus('missing')
      })
      return
    }

    const video = videoRef.current
    if (!video) {
      return
    }

    video.currentTime = 0
    video.play().catch(() => {
      setStatus('missing')
    })
  }, [status, currentIndex, currentEntry])

  const advanceToNext = () => {
    if (currentIndex >= specialWishEntries.length - 1) {
      setStatus('done')
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setGuess('')
    setStatus('question')
    setLockSeconds(0)
  }

  const handleSubmit = () => {
    if (!currentEntry || lockSeconds > 0) {
      return
    }

    const normalizedGuess = normalizeAnswer(guess)
    const isCorrect = currentEntry.answers.some(
      (answer) => normalizeAnswer(answer) === normalizedGuess
    )

    if (isCorrect) {
      setStatus('playing')
      return
    }

    setGuess('')
    setStatus('wrong')
    setLockSeconds(6)
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-5 py-16 sm:px-8 sm:py-20">
      <div className="pointer-events-none absolute left-[8%] top-[16%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,210,220,0.15),_transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] bottom-[14%] h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(127,50,84,0.18),_transparent_70%)] blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#ffc6d3]">
            {specialWishesSectionContent.eyebrow}
          </p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.45rem,10vw,4rem)] leading-tight text-[#fff5f0] sm:text-5xl md:text-6xl">
            {specialWishesSectionContent.title}
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentEntry?.id ?? 'done'}-${status}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="relative z-10"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.3em] text-white/42">
                {status === 'done' ? 'Completed' : `Wish ${progressLabel}`}
              </p>

              {status === 'done' ? (
                <>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.2rem,9vw,3.4rem)] leading-tight text-[#fff1ec]">
                    {specialWishesSectionContent.completedTitle}
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
                    {specialWishesSectionContent.completedBody}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.2rem,9vw,3.4rem)] leading-tight text-[#fff1ec]">
                    {currentEntry?.prompt}
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
                    {currentEntry?.clue}
                  </p>

                  {status === 'question' || status === 'wrong' ? (
                    <div className="mt-8 max-w-md">
                      <label className="mb-3 block text-[0.72rem] uppercase tracking-[0.28em] text-white/45">
                        Enter the name
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          value={guess}
                          onChange={(event) => setGuess(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleSubmit()
                            }
                          }}
                          disabled={lockSeconds > 0}
                          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-white outline-none placeholder:text-white/28"
                          placeholder="Type the name here"
                        />
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!guess.trim() || lockSeconds > 0}
                          className="w-full rounded-full bg-[#f3d7d6] px-5 py-3 text-sm font-medium text-[#2e1118] transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                        >
                          Unlock
                        </button>
                      </div>

                      {status === 'wrong' ? (
                        <p className="mt-4 text-sm leading-7 text-[#ffcad5]">
                          Not this one. Wait {lockSeconds} seconds and try again.
                        </p>
                      ) : (
                        <p className="mt-4 text-sm leading-7 text-white/46">
                          Get it right and the video opens instantly.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {status === 'playing' ? (
                    <p className="mt-8 text-sm uppercase tracking-[0.26em] text-[#ffc6d3]">
                      Correct. Playing the wish now.
                    </p>
                  ) : null}

                  {status === 'missing' ? (
                    <div className="mt-8 max-w-md">
                      <p className="text-sm leading-7 text-white/56">
                        Video file missing for this entry. Add the clip at:
                      </p>
                      <p className="mt-3 rounded-full bg-white/6 px-4 py-2 text-xs tracking-[0.18em] text-[#ffc6d3]">
                        {currentEntry?.mediaSrc}
                      </p>
                      <button
                        type="button"
                        onClick={advanceToNext}
                        className="mt-5 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/74"
                      >
                        Continue
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.08, ease: 'easeOut' }}
            className="relative min-h-[18rem] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.03))] sm:min-h-[24rem]"
          >
            {status === 'done' ? (
              <div className="flex h-full min-h-[20rem] items-center justify-center px-6 text-center sm:min-h-[28rem] sm:px-8">
                <p className="font-[family-name:var(--font-display)] text-[clamp(2rem,8vw,3rem)] text-[#fff0ea]">
                  All seven wishes unlocked.
                </p>
              </div>
            ) : status === 'playing' ? (
              currentEntry?.mediaType === 'audio' ? (
                <div className="relative flex h-full min-h-[20rem] items-center justify-center px-6 sm:min-h-[28rem] sm:px-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,209,220,0.18),_transparent_34%),linear-gradient(180deg,_rgba(14,6,10,0.46),_rgba(14,6,10,0.82))]" />
                  <div className="relative w-full max-w-xl text-center">
                    <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#ffc6d3]">
                      Audio wish
                    </p>
                    <p className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,8vw,3rem)] leading-tight text-[#fff1ec]">
                      One voice, no camera, still full of love.
                    </p>
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      Listen to the message, then move to the next surprise.
                    </p>
                    <audio
                      key={currentEntry?.id}
                      ref={audioRef}
                      src={currentEntry?.mediaSrc}
                      className="mt-8 w-full"
                      controls
                      onEnded={advanceToNext}
                      onError={() => setStatus('missing')}
                    />
                    <button
                      type="button"
                      onClick={advanceToNext}
                      className="mt-6 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/74"
                    >
                      Next wish
                    </button>
                  </div>
                </div>
              ) : (
                <video
                  key={currentEntry?.id}
                  ref={videoRef}
                  src={currentEntry?.mediaSrc}
                  className="h-full min-h-[18rem] w-full object-cover sm:min-h-[28rem]"
                  controls
                  playsInline
                  onEnded={advanceToNext}
                  onError={() => setStatus('missing')}
                />
              )
            ) : (
              <div className="relative flex h-full min-h-[18rem] items-center justify-center px-6 sm:min-h-[28rem] sm:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,201,214,0.12),_transparent_36%),linear-gradient(180deg,_rgba(9,3,6,0.26),_rgba(9,3,6,0.6))]" />
                <div className="relative text-center">
                  <p className="text-[0.72rem] uppercase tracking-[0.34em] text-white/40">
                    Locked wish
                  </p>
                  <p className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,8vw,3rem)] leading-tight text-[#fff1ec]">
                    Guess first, then the voice appears.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
