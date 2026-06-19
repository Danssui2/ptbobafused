import { useContent } from '../hooks/useContent'
import { useLocalizedData } from '../hooks/useLang'
import { useEffect, useRef, useState } from 'react'
import {
  Building2, ShoppingBag, Store,
  TrendingUp, BarChart2, ExternalLink, User,
  Leaf, Award, Zap, Users, ShieldCheck, Earth, Globe
} from 'lucide-react'

/* ── Icon map: only icons confirmed available in this project ── */
const ICON_MAP = { Building2, ShoppingBag, Store, Leaf, Award, Zap, Users, ShieldCheck }

/* ── Intersection observer hook ── */
function useInView(threshold = 0.08) {
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

/* ── Founder photo with fallback ── */
function FounderAvatar({ photo, name }) {
  const [err, setErr] = useState(false)
  if (!photo || err) {
    return (
      <div className="w-28 h-28 rounded-full bg-brand-green-pale flex items-center justify-center mb-5 border-2 border-brand-green/10">
        <User size={40} className="text-brand-green-mid" />
      </div>
    )
  }
  return (
    <div className="w-28 h-28 rounded-full mb-5 overflow-hidden border-2 border-brand-green/20 shadow-md ring-4 ring-brand-green-pale">
      <img
        src={photo}
        alt={name}
        onError={() => setErr(true)}
        className="w-full h-full object-cover object-top"
      />
    </div>
  )
}

/* ── Reusable section header ── */
function SectionHeader({ chip, title, subtitle, inView }) {
  return (
    <div className={`text-center mb-10 transition-all duration-700
                     ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="w-8 h-[2px] bg-brand-green rounded-full" />
        <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{chip}</span>
        <span className="w-8 h-[2px] bg-brand-green rounded-full" />
      </div>
      <h2 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

export default function StrukturSection() {
  const [founderRef, founderInView] = useInView()
  const [subRef,     subInView]     = useInView()
  const [ecoRef,     ecoInView]     = useInView()
  const [investRef,  investInView]  = useInView()

  const { data: rawData } = useContent('struktur')
  const data = useLocalizedData(rawData)
  const { founders, ecosystem, investment } = data ?? {}
  const subholdings = ecosystem?.subholdings ?? []
  const investCard  = investment?.card ?? {}

  if (!founders) return null

  return (
    <section id="struktur" className="overflow-hidden">

      {/* 1. PENDIRI */}
      <div className="bg-[#edfaf6] py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div ref={founderRef}>
            <SectionHeader
              chip={founders.chip}
              title={founders.title}
              subtitle={founders.subtitle}
              inView={founderInView}
            />
          </div>
          <div className="flex flex-wrap gap-5 lg:gap-6">
            {founders.members.map((f, i) => (
              <div key={f.name}
                   className={`flex-1 min-w-[260px] bg-white rounded-2xl border border-gray-100 p-7
                                flex flex-col items-center
                                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                                hover:shadow-[0_12px_40px_rgba(27,168,130,0.18)]
                                hover:-translate-y-1 text-center transition-all duration-300
                                ${founderInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                   style={{ transitionDelay: `${i * 120}ms`, transitionDuration: '600ms' }}>
                <FounderAvatar photo={f.photo} name={f.name} />
                <h3 className="font-display font-bold text-brand-green-deep text-lg mb-1">{f.name}</h3>
                <span className="text-brand-green text-xs font-semibold tracking-wide uppercase mb-4 bg-brand-green-pale px-3 py-1 rounded-full">
                  {f.role}
                </span>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SUBHOLDING */}
      <div className="bg-[#f8fffe] py-12 md:py-16 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div ref={subRef}>
            <SectionHeader
              chip={ecosystem.subholdingsChip}
              title={ecosystem.subholdingsTitle}
              subtitle={ecosystem.subholdingsSubtitle}
              inView={subInView}
            />
          </div>
          <div className="flex flex-wrap gap-5 lg:gap-6">
            {subholdings.map((sub, i) => {
              const Icon = ICON_MAP[sub.icon]
              return (
                <div key={sub.id}
                     className={`flex-1 min-w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden
                                  flex flex-col
                                  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]
                                  hover:-translate-y-1 transition-all duration-300
                                  ${subInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                     style={{ transitionDelay: `${i * 120}ms`, transitionDuration: '600ms' }}>
                  {/* Top accent strip */}
                  <div className="h-1.5 w-full"
                       style={{ background: `linear-gradient(to right, ${sub.accentFrom}, ${sub.accentTo})` }} />
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                           style={{ background: `linear-gradient(135deg, ${sub.accentFrom}, ${sub.accentTo})` }}>
                        {Icon ? <Icon size={20} className="text-white" /> : null}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 block">
                          {sub.label}
                        </span>
                        <h3 className="font-display font-extrabold text-brand-green-deep text-lg leading-tight">
                          {sub.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 border-l-2 pl-3"
                       style={{ borderColor: sub.accentFrom }}>
                      {sub.focus}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                      Contoh Produk / Program
                    </p>
                    <div className="space-y-1.5">
                      {sub.products.map((p, j) => (
                        <div key={j} className="flex items-start gap-2.5">
                          <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: sub.accentFrom }} />
                          <span className="text-gray-600 text-sm leading-relaxed">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. EKOSISTEM */}
      <div className="bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div ref={ecoRef}>
            <SectionHeader
              chip={ecosystem.chip}
              title={ecosystem.title}
              inView={ecoInView}
            />
          </div>
          <div className="flex flex-wrap gap-4 lg:gap-5">
            {ecosystem.items.map((item, i) => {
              const Icon = ICON_MAP[item.icon]
              return (
                <div key={item.name}
                     className={`flex-1 min-w-[180px] border border-gray-100 rounded-2xl p-6 text-center bg-white
                                  flex flex-col items-center
                                  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                                  hover:shadow-[0_12px_40px_rgba(27,168,130,0.16)]
                                  hover:-translate-y-1 transition-all duration-300
                                  ${ecoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                     style={{ transitionDelay: `${i * 100}ms`, transitionDuration: '550ms' }}>
                  <div className="w-11 h-11 rounded-xl bg-brand-green-pale flex items-center justify-center mx-auto mb-4">
                    {Icon ? <Icon size={20} className="text-brand-green" /> : null}
                  </div>
                  <h4 className="font-display font-bold text-brand-green-deep text-base mb-1">{item.name}</h4>
                  <p className="text-brand-green font-semibold text-xs mb-1">{item.sub}</p>
                  {item.desc && <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4. INVESTASI */}
      <div ref={investRef} className="bg-brand-green-deep py-12 md:py-16 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-green/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-green-light/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className={`transition-all duration-700 ${investInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block bg-yellow-400 text-yellow-900 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase mb-5">
                {investment.badge}
              </span>
              <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-[44px] leading-tight mb-4">
                {investment.title}
              </h2>
              <p className="text-white/65 leading-relaxed mb-7 max-w-lg">{investment.desc}</p>
              <ul className="space-y-3">
                {investment.points.map((point, i) => (
                  <li key={i}
                      className={`flex items-start gap-3 transition-all duration-500 ${investInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${200 + i * 100}ms` }}>
                    <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                    <span className="text-white/80 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`transition-all duration-700 delay-300 ${investInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white/8 border border-white/15 rounded-2xl p-7 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <BarChart2 size={20} className="text-brand-green-light" />
                  </div>
                  <h3 className="font-display font-bold text-white text-xl">{investCard.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-7">{investCard.desc}</p>
                <div className="grid grid-cols-3 gap-4 mb-7 pb-7 border-b border-white/10">
                  {(investCard.stats ?? []).map(s => (
                    <div key={s.l} className="text-center">
                      <p className="font-display font-extrabold text-white text-2xl">{s.v}</p>
                      <p className="text-white/40 text-[10px] mt-1 uppercase tracking-wider">{s.l}</p>
                    </div>
                  ))}
                </div>
                <a href={investCard.ctaHref}
                   className="flex items-center justify-center gap-2 w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-brand-green-dark transition-all duration-300 hover:shadow-[0_4px_24px_rgba(27,168,130,0.4)]">
                  <TrendingUp size={16} /> {investCard.ctaLabel}
                </a>
                <a href={investCard.secondaryHref}
                   className="flex items-center justify-center gap-2 mt-3 w-full text-white/60 hover:text-white font-semibold text-sm transition-colors py-2">
                  <ExternalLink size={13} /> {investCard.secondaryLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}