import { useContent } from '../hooks/useContent'
import { useLocalizedData } from '../hooks/useLang'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ShieldCheck, Leaf, Zap, Users, TrendingUp, Award, Globe, ChevronRight } from 'lucide-react'

const ICON_MAP = { TrendingUp, Users, Globe, Award, Zap, Leaf, ShieldCheck }

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Counter({ to, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  const [ref, inView] = useInView(0.3)
  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const ease = 1 - Math.pow(1 - Math.min((ts - start) / duration, 1), 3)
      setVal(Math.floor(ease * to))
      if (ease < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, to, duration])
  return <span ref={ref}>{val.toLocaleString('id-ID')}{suffix}</span>
}

export default function AboutSection() {
  const { data: rawData } = useContent('about')
  const data = useLocalizedData(rawData)
  const [activeYear, setActiveYear] = useState(null)
  useEffect(() => { if (data?.timeline?.defaultYear) setActiveYear(data.timeline.defaultYear) }, [data])

  const { hero, stats, visiMisi, pillars, timeline, cta } = data ?? {}
  const [heroRef, heroInView]       = useInView(0.1)
  const [pillarsRef, pillarsInView] = useInView(0.1)
  const [timelineRef, tlInView]     = useInView(0.1)

  if (!hero) return null

  return (
    <section id="about" className="bg-white overflow-hidden">

      {/* 1. HERO INTRO */}
      <div ref={heroRef} className="relative bg-brand-green-deep overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-green/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-brand-green-light/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className={`transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="section-chip" style={{ color: '#2DD4B0' }}>&nbsp;{hero.chip}</span>
            </div>
            <h2 className={`font-display font-extrabold text-white leading-[1.1] text-[28px] sm:text-4xl md:text-5xl lg:text-[52px] mb-6 break-words transition-all duration-700 delay-100 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {hero.title}{' '}<span className="text-brand-green-light">{hero.titleHighlight}</span>
            </h2>
            <p className={`text-white/65 leading-relaxed text-lg mb-8 max-w-lg transition-all duration-700 delay-200 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {hero.description}
            </p>
            <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {hero.cta.map(btn => (
                btn.variant === 'primary'
                  ? <a key={btn.label} href={btn.href} className="btn-primary">{btn.label} <ArrowRight size={16} /></a>
                  : <a key={btn.label} href={btn.href} className="btn-outline">{btn.label}</a>
              ))}
            </div>
          </div>

          <div className={`relative h-[320px] sm:h-[380px] lg:h-[480px] w-full transition-all duration-700 delay-200 ${heroInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="absolute top-8 right-0 w-[85%] h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl rotate-3">
              <div className="w-full h-full bg-brand-green/30 flex items-center justify-center">
                <div className="text-white/20 font-display font-extrabold text-[100px]">PT</div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-[88%] h-[90%] rounded-2xl overflow-hidden border border-white/15 shadow-[0_32px_80px_rgba(0,0,0,0.5)] -rotate-1">
              <img src={hero.image} alt={hero.imageAlt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-display font-bold text-xl">{hero.imageLabel}</p>
                <p className="text-white/60 text-sm mt-1">{hero.imageSub}</p>
              </div>
            </div>
            <div className="absolute -bottom-4 right-8 bg-white rounded-2xl shadow-[0_16px_48px_rgba(27,168,130,0.25)] px-5 py-4 flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-brand-green-pale flex items-center justify-center shrink-0">
                <Award size={20} className="text-brand-green" />
              </div>
              <div>
                <p className="font-display font-extrabold text-brand-green-deep text-lg leading-none">{hero.badge.value}</p>
                <p className="text-brand-gray-mid text-[12px] mt-0.5 font-medium">{hero.badge.sub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS BAR */}
      <div className="bg-brand-green">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/15">
            {stats.map(s => {
              const Icon = ICON_MAP[s.icon]
              return (
                <div key={s.label} className="flex flex-col items-center text-center py-10 px-4 gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-1">
                    {Icon ? <Icon size={20} className="text-white" /> : null}
                  </div>
                  <p className="font-display font-extrabold text-white text-4xl sm:text-[44px] leading-none">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <div>
                    <p className="text-white font-bold text-[13px] sm:text-sm tracking-wide">{s.label}</p>
                    <p className="text-white/50 text-[11px] mt-0.5">{s.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. VISI MISI */}
      <div className="bg-brand-gray py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex text-center justify-center mb-4 items-center gap-3">
            <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">
              {visiMisi.chip}
            </span>
            <span className="w-8 h-[2px] bg-brand-green rounded-full" />
          </div>
          <div className="text-center mb-16">
            <h3 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl">{visiMisi.title}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-brand-green-pale hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center">
                  <Globe size={22} className="text-white" />
                </div>
                <span className="font-display font-extrabold text-brand-green text-xl">VISI</span>
              </div>
              <p className="font-display font-bold text-brand-green-deep text-2xl leading-snug mb-4">{visiMisi.visi.title}</p>
              <p className="text-brand-gray-mid leading-relaxed">{visiMisi.visi.desc}</p>
            </div>
            <div className="bg-brand-green rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-[0_8px_40px_rgba(27,168,130,0.35)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Zap size={22} className="text-white" />
                </div>
                <span className="font-display font-extrabold text-white text-xl">MISI</span>
              </div>
              <ul className="space-y-4">
                {visiMisi.misi.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80 leading-relaxed text-sm">
                    <span className="mt-1.5 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 text-white text-[10px] font-bold">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PILLARS */}
      <div ref={pillarsRef} className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="section-chip">{pillars.chip}</span>
              <h3 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl max-w-md">{pillars.title}</h3>
            </div>
            <a href={pillars.ctaHref} className="inline-flex items-center gap-2 text-brand-green font-bold text-sm hover:text-brand-green-dark transition-colors group shrink-0">
              {pillars.ctaLabel} <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.items.map((p, i) => {
              const Icon = ICON_MAP[p.icon]
              return (
                <div key={p.title}
                  className={`group relative bg-white rounded-2xl p-7 border border-gray-100 hover:border-transparent shadow-[0_16px_56px_rgba(27,168,130,0.15)] hover:shadow-[0_32px_80px_rgba(27,168,130,0.30)] transition-all duration-300 cursor-default ${pillarsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 100}ms`, transitionDuration: '600ms' }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-brand-green to-brand-green-mid flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {Icon ? <Icon size={22} className="text-white" /> : null}
                  </div>
                  <h4 className="font-display font-bold text-brand-green-deep text-lg mb-3">{p.title}</h4>
                  <p className="text-brand-gray-mid text-sm leading-relaxed">{p.desc}</p>
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl bg-gradient-to-r from-brand-green to-brand-green-mid scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 5. TIMELINE */}
      <div ref={timelineRef} className="bg-brand-green-deep py-24 md:py-32 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.02]" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex text-center justify-center mb-4 items-center gap-3">
            <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            <span style={{ color: '#2DD4B0' }} className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">
              {timeline.chip}
            </span>
            <span className="w-8 h-[2px] bg-brand-green rounded-full" />
          </div>
          <div className="text-center mb-16">
            <h3 className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-5xl">{timeline.title}</h3>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0 mb-14">
            <div className="flex items-center gap-2 w-max mx-auto lg:flex-wrap lg:justify-center lg:w-auto">
              {timeline.milestones.map(m => (
                <button key={m.year} onClick={() => setActiveYear(m.year)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeYear === m.year ? 'bg-brand-green text-white shadow-[0_0_20px_rgba(27,168,130,0.6)]' : 'bg-white/8 text-white/50 hover:bg-white/15 hover:text-white'}`}>
                  {m.year}
                </button>
              ))}
            </div>
          </div>

          {timeline.milestones.filter(m => m.year === activeYear).map(m => (
            <div key={m.year} className={`max-w-2xl mx-auto text-center transition-all duration-500 ${tlInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-green/30 border border-brand-green-light/30 mb-6">
                <span className="font-display font-extrabold text-brand-green-light text-xl">{m.year}</span>
              </div>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed">{m.event}</p>
            </div>
          ))}

          <div className="relative mt-16 overflow-x-auto scrollbar-hide -mx-6 px-6 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0 pb-4">
            <div className="flex items-center w-max mx-auto lg:w-auto pt-6 lg:justify-center">
              {timeline.milestones.map((m, i) => (
                <div key={m.year} className="flex items-center">
                  <button onClick={() => setActiveYear(m.year)} className="flex flex-col items-center gap-2 group transition-all duration-300 focus:outline-none">
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${activeYear === m.year ? 'bg-brand-green-light border-brand-green-light scale-150 shadow-[0_0_14px_rgba(34,169,138,0.7)]' : 'bg-transparent border-white/25 group-hover:border-brand-green-light'}`} />
                    <span className={`text-[11px] font-bold transition-colors whitespace-nowrap ${activeYear === m.year ? 'text-brand-green-light' : 'text-white/30 group-hover:text-white/60'}`}>{m.year}</span>
                  </button>
                  {i < timeline.milestones.length - 1 && <div className="w-10 sm:w-16 lg:w-20 h-[1px] bg-white/15 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. CTA STRIP */}
      <div className="bg-brand-green-pale py-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="font-display font-extrabold text-brand-green-deep text-2xl sm:text-3xl mb-2">{cta.title}</h4>
            <p className="text-brand-gray-mid leading-relaxed max-w-xl">{cta.desc}</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            {cta.buttons.map(btn => (
              btn.variant === 'primary'
                ? <a key={btn.label} href={btn.href} className="btn-primary" style={{ borderRadius: '0.75rem' }}>{btn.label} <ArrowRight size={16} /></a>
                : <a key={btn.label} href={btn.href} className="inline-flex items-center gap-2 bg-white text-brand-green font-bold px-6 py-3 rounded-xl border border-brand-green/20 hover:border-brand-green hover:shadow-md transition-all duration-300">{btn.label}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
