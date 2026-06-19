import { useContent } from '../hooks/useContent'
import { useLocalizedData } from '../hooks/useLang'
import { useEffect, useRef, useState } from 'react'
import { Award, ShoppingBag, ShieldCheck, TrendingUp, Users, Zap, Leaf, Globe, Send, ChevronRight } from 'lucide-react'

const ICON_MAP = { Award, ShoppingBag, ShieldCheck, TrendingUp, Users, Zap, Leaf, Globe }

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

function ServiceCard({ svc, inView, delay, accentColor }) {
  const Icon = ICON_MAP[svc.icon]
  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-3
                   shadow-[0_4px_20px_rgba(0,0,0,0.07)]
                   hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)]
                   hover:-translate-y-1 transition-all duration-300
                   ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: '550ms' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: `${accentColor}18` }}>
        {Icon ? <Icon size={19} style={{ color: accentColor }} /> : null}
      </div>

      <div>
        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2"
              style={{ background: `${accentColor}15`, color: accentColor }}>
          {svc.tag}
        </span>
        <h3 className="font-display font-bold text-brand-green-deep text-[16px] leading-snug">
          {svc.title}
        </h3>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed flex-1">{svc.desc}</p>

      <div className="flex items-baseline gap-1.5 pt-1 border-t border-gray-50">
        <span className="font-display font-extrabold text-lg" style={{ color: accentColor }}>
          {svc.price}
        </span>
        <span className="text-gray-400 text-xs">{svc.unit}</span>
      </div>

      <a href={svc.ctaHref}
         className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                    text-white text-sm font-bold transition-all duration-200
                    hover:opacity-90 hover:shadow-md"
         style={{ background: accentColor }}>
        <Send size={13} />
        {svc.cta}
      </a>
    </div>
  )
}

export default function ServiceSection() {
  const [headerRef, headerInView] = useInView(0.1)
  // Pre-declare 8 group refs (hooks must not be called conditionally or in loops)
  const ref0 = useInView(0.06); const ref1 = useInView(0.06); const ref2 = useInView(0.06)
  const ref3 = useInView(0.06); const ref4 = useInView(0.06); const ref5 = useInView(0.06)
  const ref6 = useInView(0.06); const ref7 = useInView(0.06)

  const { data: rawData } = useContent('services')
  const data = useLocalizedData(rawData)
  const { header, groups = [], footer: footerData = {} } = data ?? {}
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5, ref6, ref7]

  return (
    <section id="services" className="bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* Header */}
        <div ref={headerRef}
             className={`text-center mb-10 transition-all duration-700
                         ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">
              {header.chip}
            </span>
            <span className="w-8 h-[2px] bg-brand-green rounded-full" />
          </div>
          <h2 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl mb-4">
            {header.title}
          </h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto text-base sm:text-lg">
            {header.subtitle}
          </p>
        </div>

        {/* Service groups */}
        <div className="space-y-12">
          {groups.map((group, gi) => {
            const [groupRef, groupInView] = refs[gi]
            return (
              <div key={group.id}>
                {/* Group label */}
                <div ref={groupRef}
                     className={`flex items-center gap-3 mb-6 transition-all duration-500
                                 ${groupInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="w-1 h-7 rounded-full" style={{ background: group.accentColor }} />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: group.accentColor }}>
                      {group.chip}
                    </span>
                    <p className="font-display font-extrabold text-brand-green-deep text-lg leading-tight">
                      {group.label}
                    </p>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-wrap gap-4 lg:gap-5">
                  {group.services.map((svc, si) => (
                    <div key={svc.id} className="flex-1 min-w-[220px]">
                      <ServiceCard
                        svc={svc}
                        inView={groupInView}
                        delay={si * 90}
                        accentColor={group.accentColor}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className={`mt-10 text-center transition-all duration-700 delay-300
                         ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gray-400 text-sm mb-3">{footerData.note}</p>
          <a href={footerData.ctaHref}
             className="inline-flex items-center gap-2 text-brand-green font-bold text-sm hover:text-brand-green-dark transition-colors group">
            {footerData.ctaLabel}
            <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>
    </section>
  )
}