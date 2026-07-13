import { useContent } from '../hooks/useContent'
import { useLocalizedData } from '../hooks/useLang'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Handshake, ChevronRight, CheckCircle2, Send } from 'lucide-react'

function useInView(threshold = 0.1) {
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

const PartnerLogo = ({ partner }) => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-extrabold text-[11px] shrink-0"
       style={{ backgroundColor: partner.color, color: partner.textColor }}>
    {partner.initials}
  </div>
)

export default function PartnerSection() {
  const { data: rawData } = useContent('partners')
  const data = useLocalizedData(rawData)
  const { header, categories = [], partners = [], benefits, partnerTypes, cta } = data ?? {}
  // activeCategory menyimpan KEY language-neutral (bukan label terjemahan)
  // Ini menghindari mismatch ketika bahasa berganti
  const [activeCategory, setActiveCategory] = useState('all')
  const [headerRef, headerInView] = useInView(0.1)
  const [gridRef,   gridInView]   = useInView(0.08)
  const [joinRef,   joinInView]   = useInView(0.08)

  if (!header) return null

  // Normalkan struktur kategori — bisa berupa:
  //   A) array string (format lama):  ["Semua", "Strategis", ...]
  //   B) array {key, label} (format baru): [{key:"all", label:"Semua"}, ...]
  const normCategories = categories.map(cat => {
    if (typeof cat === 'string') {
      // Format lama: buat key dari string (huruf kecil, tanpa spasi)
      const key = cat.toLowerCase() === 'semua' || cat.toLowerCase() === 'all' ? 'all'
        : cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return { key, label: cat }
    }
    // Format baru {key, label} — label sudah di-resolve oleh useLocalizedData
    return { key: cat.key ?? 'all', label: cat.label ?? cat.key ?? '' }
  })

  // Filter: 'all' = tampilkan semua
  // Untuk backward compat: partner bisa punya .catKey (baru) atau .cat (lama)
  const filtered = activeCategory === 'all'
    ? partners
    : partners.filter(p => {
        const key = p.catKey ?? (typeof p.cat === 'string'
          ? p.cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          : '')
        return key === activeCategory
      })

  return (
    <section id="partner" className="overflow-hidden">

      {/* 1. HEADER + GRID */}
      <div className="bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div ref={headerRef}
               className={`text-center mb-14 transition-all duration-700
                           ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
              <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{header.chip}</span>
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            </div>
            <h2 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl mb-4">
              {header.title}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {header.subtitle}
            </p>
          </div>

          {/* Category filter */}
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0 mb-10">
            <div className="flex items-center gap-2 w-max lg:w-auto lg:justify-center mx-auto">
              {normCategories.map(({ key, label }) => (
                <button key={key} onClick={() => setActiveCategory(key)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
                    activeCategory === key
                      ? 'bg-brand-green text-white border-brand-green shadow-[0_4px_20px_rgba(27,168,130,0.3)]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-brand-green hover:text-brand-green'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Partner grid */}
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((partner, i) => (
              <div key={partner.id}
                   className={`group bg-white border border-gray-100 rounded-2xl p-5
                                flex items-start gap-4
                                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                                hover:shadow-[0_8px_36px_rgba(27,168,130,0.12)]
                                hover:-translate-y-1 transition-all duration-300
                                ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                   style={{ transitionDelay: `${i * 60}ms`, transitionDuration: '500ms' }}>
                <PartnerLogo partner={partner} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-brand-green-deep text-[15px] leading-snug mb-1">
                    {partner.name}
                  </h4>
                  <span className="inline-block text-[10px] font-bold text-brand-green bg-brand-green-pale px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    {partner.cat}
                  </span>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{partner.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Menampilkan <span className="font-semibold text-brand-green">{filtered.length}</span> dari{' '}
            <span className="font-semibold text-brand-green-deep">{partners.length}</span> mitra terdaftar
          </p>
        </div>
      </div>

      {/* 2. KEUNTUNGAN BERMITRA */}
      <div className="bg-[#edfaf6] py-20 md:py-24 border-y border-brand-green/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-brand-green rounded-full" />
                <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{benefits.chip}</span>
              </div>
              <h3 className="font-display font-extrabold text-brand-green-deep text-2xl sm:text-3xl md:text-4xl mb-6 leading-tight">
                {benefits.title}
              </h3>
              <p className="text-gray-500 leading-relaxed mb-8">{benefits.desc}</p>
              <ul className="space-y-3.5">
                {benefits.items.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-brand-green mt-0.5 shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_16px_56px_rgba(27,168,130,0.15)]">
                <img src={benefits.image} alt={benefits.imageAlt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep/60 via-transparent to-transparent" />
              </div>
              {benefits.stats.map((s, i) => (
                <div key={s.label}
                     className={`absolute bg-white rounded-2xl shadow-[0_8px_32px_rgba(27,168,130,0.18)] px-5 py-4
                                 ${i === 0 ? '-bottom-5 -left-4' : '-top-4 -right-4'}`}>
                  <p className="font-display font-extrabold text-brand-green text-3xl leading-none">{s.value}</p>
                  <p className="text-gray-400 text-xs mt-1 font-medium uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. JENIS KEMITRAAN */}
      <div ref={joinRef} className="bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
              <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{partnerTypes.chip}</span>
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            </div>
            <h3 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-[42px]">
              {partnerTypes.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-6 mb-14">
            {partnerTypes.items.map((pt, i) => (
              <div key={pt.title}
                   className={`flex-1 min-w-[260px] border border-gray-100 rounded-2xl p-7
                                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                                hover:shadow-[0_8px_36px_rgba(27,168,130,0.12)]
                                hover:-translate-y-1 transition-all duration-300
                                flex flex-col
                                ${joinInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                   style={{ transitionDelay: `${i * 120}ms`, transitionDuration: '550ms' }}>
                <div className="text-4xl mb-5">{pt.icon}</div>
                <h4 className="font-display font-bold text-brand-green-deep text-lg mb-3">{pt.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-6">{pt.desc}</p>
                <a href="#contact" className="btn-brand group">
                  <Send size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  {pt.cta}
                </a>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="relative bg-brand-green rounded-3xl overflow-hidden px-8 sm:px-12 py-12 text-center">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-brand-green-light/15 pointer-events-none" />
            <div className="relative">
              <Handshake size={36} className="text-white/40 mx-auto mb-4" />
              <h4 className="font-display font-extrabold text-white text-2xl sm:text-3xl mb-3">{cta.title}</h4>
              <p className="text-white/65 max-w-lg mx-auto mb-7 leading-relaxed">{cta.desc}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {cta.buttons.map(btn => (
                  btn.variant === 'white'
                    ? <a key={btn.label} href={btn.href} className="inline-flex items-center gap-2 bg-white text-brand-green font-bold px-7 py-3.5 rounded-xl hover:bg-brand-green-pale transition-all duration-300 hover:shadow-lg">
                        {btn.label} <ArrowRight size={16} />
                      </a>
                    : <a key={btn.label} href={btn.href} className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-300">
                        {btn.label} <ChevronRight size={15} />
                      </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}