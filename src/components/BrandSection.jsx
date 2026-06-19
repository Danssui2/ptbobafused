import { useContent } from '../hooks/useContent'
import { useLocalizedData } from '../hooks/useLang'
import { useEffect, useRef, useState } from 'react'
import { ShoppingBag, Recycle, ExternalLink } from 'lucide-react'

const ICON_MAP = { ShoppingBag, Recycle }

function useInView(threshold = 0.12) {
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

const LogoBox = ({ brand }) => (
  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
       style={{ backgroundColor: brand.logoBg }}>
    <span className="font-display font-extrabold text-[9px] text-center leading-tight px-1"
          style={{ color: brand.logoTextColor }}>
      {brand.logoText}
    </span>
  </div>
)

export default function BrandSection() {
  const [sectionRef, inView] = useInView(0.08)
  const { data: rawData } = useContent('brands')
  const data = useLocalizedData(rawData)
  const { header, brands, platformNote } = data ?? {}
  if (!header) return null

  return (
    <section id="brands" className="bg-[#edfaf6] py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* Header */}
        <div ref={sectionRef}
             className={`text-center mb-14 transition-all duration-700
                         ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
            {header.subtitle}{' '}
            <strong className="text-brand-green-deep font-bold">{header.subtitleBold}</strong>
            {header.subtitleEnd}
          </p>
        </div>

        {/* Brand cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {brands.map((brand, i) => {
            const CtaIcon = ICON_MAP[brand.cta.icon]
            return (
              <div key={brand.id}
                   className={`bg-white rounded-2xl border border-gray-100
                                shadow-[0_2px_20px_rgba(0,0,0,0.05)]
                                hover:shadow-[0_8px_40px_rgba(27,168,130,0.12)]
                                hover:-translate-y-1 transition-all duration-300
                                flex flex-col overflow-hidden
                                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                   style={{ transitionDelay: `${i * 120}ms`, transitionDuration: '600ms' }}>
                <div className="h-[3px] w-full" style={{ backgroundColor: brand.accent }} />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <LogoBox brand={brand} />
                    <div>
                      <h3 className="font-display font-extrabold text-brand-green-deep text-xl leading-none mb-1">
                        {brand.name}
                      </h3>
                      <span className="text-gray-400 text-sm font-medium">{brand.category}</span>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100 mb-5" />
                  <p className="text-gray-500 leading-relaxed text-sm flex-1 mb-7">{brand.desc}</p>
                  <a href={brand.cta.href} className="btn-brand group">
                    <CtaIcon size={15} className="transition-transform duration-300 group-hover:scale-110" />
                    {brand.cta.label}
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Platform note */}
        <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4
                         text-center transition-all duration-700 delay-500
                         ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center gap-2 bg-white border border-brand-green/20
                          rounded-full px-5 py-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="text-brand-green-deep text-sm font-semibold">
              {platformNote.text}{' '}
              <span className="text-brand-green font-bold">{platformNote.brand}</span>
            </span>
            <a href={platformNote.ctaHref}
               className="inline-flex items-center gap-1 text-brand-green ml-2 text-xs font-bold hover:underline">
              {platformNote.ctaLabel} <ExternalLink size={11} />
            </a>
          </div>
        </div>

      </div>
    </section>
  )
  ))
}
