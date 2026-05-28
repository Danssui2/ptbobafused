import { useContent } from '../hooks/useContent'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'


export default function HeroSection() {
  const { data } = useContent('hero')
  const SLIDES            = data?.slides           ?? []
  const AUTOPLAY_DURATION = data?.autoplayDuration ?? 7000
  const FLOATING_STATS    = data?.floatingStats    ?? []
  const [current, setCurrent]         = useState(0)
  const [playing, setPlaying]         = useState(true)
  const [muted, setMuted]             = useState(true)
  const [progress, setProgress]       = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [textVisible, setTextVisible] = useState(true)

  const videoRefs = useRef([])
  const progRef   = useRef(null)
  const startRef  = useRef(null)

  const getVideo = (idx) => videoRefs.current[idx]

  const goTo = useCallback((idx) => {
    if (transitioning) return
    setTransitioning(true)
    setTextVisible(false)
    getVideo(current)?.pause()
    setTimeout(() => {
      setCurrent(idx)
      setProgress(0)
      startRef.current = performance.now()
      setTransitioning(false)
      setTimeout(() => {
        setTextVisible(true)
        if (playing) getVideo(idx)?.play().catch(() => {})
      }, 80)
    }, 350)
  }, [current, playing, transitioning])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo])

  useEffect(() => {
    if (!playing) { cancelAnimationFrame(progRef.current); return }
    startRef.current = performance.now() - (progress / 100) * AUTOPLAY_DURATION
    const tick = (now) => {
      const pct = Math.min(((now - startRef.current) / AUTOPLAY_DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) next()
      else progRef.current = requestAnimationFrame(tick)
    }
    progRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(progRef.current)
  }, [playing, current]) // eslint-disable-line

  useEffect(() => {
    const vid = getVideo(current)
    if (!vid) return
    vid.muted = muted
    if (playing) vid.play().catch(() => {})
    else vid.pause()
  }, [current, playing, muted])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === ' ') { e.preventDefault(); setPlaying(p => !p) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const slide = SLIDES[current]

  return (
    <section id="home" className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden bg-brand-green-deep">
      {SLIDES.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <video ref={el => videoRefs.current[i] = el} src={s.src} poster={s.poster}
            muted={muted} loop playsInline preload={i === 0 ? 'auto' : 'none'}
            className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 z-20 hero-gradient" />
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-brand-green-deep/55 via-transparent to-brand-green-deep/20" />
      <div className="absolute bottom-0 inset-x-0 z-20 h-52 bg-gradient-to-t from-brand-green-deep via-brand-green-deep/25 to-transparent" />

      <div className="absolute inset-0 z-30 flex items-center">
        <div className="max-w-[1400px] mx-auto w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-24 md:pt-36">
          <div className={`inline-flex items-center gap-2 mb-5 transition-all duration-500 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
            <span className="w-6 h-[2px] bg-brand-green-light rounded-full" />
            <span className="text-brand-green-light text-[11px] font-bold tracking-[0.22em] uppercase">{slide.tag}</span>
          </div>
          <h1 className={`font-display font-extrabold text-white leading-[1.08] text-shadow-lg mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[78px] max-w-[680px] transition-all duration-500 delay-100 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {slide.title}
          </h1>
          <p className={`text-white/70 font-medium leading-relaxed mb-10 text-base sm:text-lg md:text-xl max-w-[500px] transition-all duration-500 delay-200 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {slide.subtitle}
          </p>
          <div className={`flex flex-wrap gap-3 transition-all duration-500 delay-300 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <a href={slide.cta.href} className="btn-primary group">
              {slide.cta.primary}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href={slide.cta.href2} className="btn-outline">{slide.cta.secondary}</a>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-30 flex items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20 gap-4">
        <div className="flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)} className="group flex flex-col items-center gap-1.5 focus:outline-none" aria-label={`Slide ${i + 1}`}>
              <div className={`h-[3px] rounded-full overflow-hidden transition-all duration-300 bg-white/25 ${i === current ? 'w-16' : 'w-4 hover:w-6'}`}>
                {i === current && <div className="h-full bg-brand-green-light rounded-full transition-none" style={{ width: `${progress}%` }} />}
              </div>
              <span className={`text-[10px] font-bold transition-all ${i === current ? 'text-white' : 'text-white/25 group-hover:text-white/50'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {[
            { icon: muted ? <VolumeX size={15}/> : <Volume2 size={15}/>, action: () => setMuted(m => !m), label: 'Mute' },
            { icon: playing ? <Pause size={15}/> : <Play size={15}/>,    action: () => setPlaying(p => !p), label: 'Play' },
          ].map((btn) => (
            <button key={btn.label} onClick={btn.action} aria-label={btn.label}
              className="p-2.5 rounded-full border border-white/20 text-white/65 hover:text-white hover:border-white/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-200">
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {[{ fn: prev, label: 'Previous', pos: 'left-5 lg:left-8',   icon: <ChevronLeft  size={22}/> },
        { fn: next, label: 'Next',     pos: 'right-5 lg:right-8', icon: <ChevronRight size={22}/> },
      ].map((btn) => (
        <button key={btn.label} onClick={btn.fn} aria-label={btn.label}
          className={`hidden md:flex absolute ${btn.pos} top-1/2 -translate-y-1/2 z-30 items-center justify-center w-11 h-11 border border-white/20 rounded-full text-white/55 hover:text-white hover:border-white/60 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95`}>
          {btn.icon}
        </button>
      ))}

      <span className="hidden md:block absolute top-36 right-16 z-30 font-display font-extrabold text-white/8 text-[80px] leading-none select-none tabular-nums">
        {String(current + 1).padStart(2, '0')}
      </span>

      <div className="hidden lg:flex absolute bottom-24 right-6 sm:right-10 lg:right-16 z-30 flex-col gap-3">
        {FLOATING_STATS.map((stat, i) => (
          <div key={stat.label}
            className={`glass rounded-xl px-5 py-3 text-right transition-all duration-500 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
            style={{ transitionDelay: `${300 + i * 80}ms` }}>
            <p className="font-display font-extrabold text-white text-[22px] leading-none mb-0.5">{stat.value}</p>
            <p className="text-white/45 text-[10px] uppercase tracking-widest font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="md:hidden absolute bottom-20 inset-x-0 z-30 flex justify-center">
        <span className="flex items-center gap-2 text-white/35 text-[11px] font-medium">
          <ChevronLeft size={11}/> Geser untuk navigasi <ChevronRight size={11}/>
        </span>
      </div>
    </section>
  )
}
