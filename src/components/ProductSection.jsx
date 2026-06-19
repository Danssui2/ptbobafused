import { useContent } from '../hooks/useContent'
import { useLocalizedData } from '../hooks/useLang'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ExternalLink, Star, X, Mail, MessageCircle } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────── */
/* Helpers                                                         */
/* ─────────────────────────────────────────────────────────────── */

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

const BrandLogo = ({ brand, size = 'md' }) => {
  const sizes = {
    sm: 'w-10 h-10 text-[11px]',
    md: 'w-14 h-14 text-[13px]',
    lg: 'w-16 h-16 text-[15px]',
  }
  return (
    <div className={`${sizes[size]} rounded-2xl flex items-center justify-center font-display font-extrabold text-white shrink-0`}
         style={{ backgroundColor: brand.color }}>
      {brand.initials}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── */
/* Product Modal                                                   */
/* ─────────────────────────────────────────────────────────────── */

function buildWaLink(brand, waNumber) {
  const msg =
    `Halo tim BOBA Group! 👋\n\n` +
    `Saya tertarik dengan produk *${brand.name}* — _${brand.tagline}_.\n\n` +
    `${brand.desc}\n\n` +
    `Boleh saya mendapatkan informasi lebih lanjut mengenai produk ini?\n\n` +
    `Terima kasih! 🙏`
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
}

function buildMailtoLink(brand, email) {
  const subject = `[Produk] ${brand.name} – Informasi Lebih Lanjut`
  const body =
    `Halo tim BOBA Group,\n\n` +
    `Saya tertarik dengan produk ${brand.name} (${brand.tagline}).\n\n` +
    `Deskripsi: ${brand.desc}\n\n` +
    `Mohon informasi lebih lanjut mengenai:\n` +
    `- Cara pembelian / distribusi\n` +
    `- Ketersediaan dan varian produk\n` +
    `- Harga dan penawaran khusus\n\n` +
    `Terima kasih.`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function ProductModal({ brand, waNumber, contactEmail, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(10,30,25,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg shadow-[0_32px_80px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{ animation: 'modalIn 0.2s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ background: brand.color }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10">
          <X size={15} className="text-gray-500" />
        </button>

        <div className="relative h-48 overflow-hidden">
          <img src={brand.img} alt={brand.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-end gap-3">
            <BrandLogo brand={brand} size="md" />
            <div>
              <span className="block text-white/70 text-[10px] font-bold uppercase tracking-widest mb-0.5">{brand.category}</span>
              <h3 className="font-display font-extrabold text-white text-xl leading-tight">{brand.name}</h3>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5 pb-6">
          <p className="text-brand-green text-sm font-semibold italic mb-3">{brand.tagline}</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">{brand.desc}</p>

          <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-gray-50">
            {brand.stats.map(s => (
              <div key={s.l} className="text-center">
                <p className="font-display font-extrabold text-brand-green-deep text-lg leading-none">{s.v}</p>
                <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-wider">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={buildWaLink(brand, waNumber)} target="_blank" rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: '#25D366' }}>
              <MessageCircle size={16} /> Tanya via WhatsApp
            </a>
            <a href={buildMailtoLink(brand, contactEmail)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all hover:text-white"
              style={{ borderColor: brand.color, color: brand.color }}
              onMouseEnter={e => { e.currentTarget.style.background = brand.color }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              <Mail size={16} /> Kirim Email
            </a>
          </div>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── */
/* Featured Showcase — matches original design                     */
/* ─────────────────────────────────────────────────────────────── */

function FeaturedShowcase({ brands, onOpenModal }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % brands.length), 4500)
    return () => clearInterval(t)
  }, [brands.length])

  const brand = brands[idx]

  return (
    <div className="bg-brand-green-deep py-12 md:py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* Dot nav */}
        <div className="flex items-center gap-2 mb-8">
          {brands.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === idx ? 'w-8 h-2.5 bg-brand-green' : 'w-2.5 h-2.5 bg-white/25 hover:bg-white/50'}`}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT — text */}
          <div key={brand.id} style={{ animation: 'fadeSlide .35s ease-out' }}>
            {/* Logo + category + featured badge */}
            <div className="flex items-center gap-4 mb-6">
              <BrandLogo brand={brand} size="lg" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-brand-green-light text-xs font-bold uppercase tracking-widest">
                    {brand.category}
                  </span>
                  {brand.featured && (
                    <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-bold">
                      <Star size={11} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
                <h3 className="font-display font-extrabold text-white text-3xl sm:text-4xl leading-tight">
                  {brand.name}
                </h3>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-brand-green-light font-semibold italic text-lg mb-4">
              "{brand.tagline}"
            </p>

            {/* Desc */}
            <p className="text-white/65 leading-relaxed mb-7 max-w-md">
              {brand.desc}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-8">
              {brand.stats.map(s => (
                <div key={s.l}>
                  <p className="font-display font-extrabold text-white text-2xl leading-none">{s.v}</p>
                  <p className="text-white/40 text-[10px] mt-1 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => onOpenModal(brand)}
                className="inline-flex items-center gap-2 bg-brand-green text-white font-bold px-6 py-3 rounded-xl
                           hover:bg-brand-green-dark transition-all duration-300 hover:shadow-[0_4px_20px_rgba(27,168,130,0.4)]">
                Jelajahi Brand <ArrowRight size={16} />
              </button>
              <a href={brand.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white font-semibold text-sm transition-colors">
                <ExternalLink size={14} /> Website Resmi
              </a>
            </div>
          </div>

          {/* RIGHT — image */}
          <div key={`img-${brand.id}`} className="relative" style={{ animation: 'fadeSlide .35s ease-out' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.35)] cursor-pointer group"
                 onClick={() => onOpenModal(brand)}>
              <img src={brand.img} alt={brand.name}
                className="w-full h-[340px] sm:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105" />

              {/* Brand name badge — top right */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-brand-green-deep font-bold text-sm px-4 py-1.5 rounded-full shadow-sm">
                {brand.name}
              </div>

              {/* Category pill — bottom left */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-brand-green-deep font-semibold text-xs px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-green" />
                {brand.category}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── */
/* Main Section                                                    */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductSection() {
  const { data: rawData } = useContent('products')
  const data = useLocalizedData(rawData)
  const { header, categories = [], brands = [], marqueeItems = [], cta, waNumber, contactEmail } = data ?? {}
  const FEATURED = brands.filter(b => b.featured || b.id <= 3)

  const [activeCategory, setActiveCategory] = useState(null)   // null = show all
  const [hoveredId,      setHoveredId]      = useState(null)
  const [selectedBrand,  setSelectedBrand]  = useState(null)
  const [headerRef, headerInView] = useInView(0.1)
  const [gridRef,   gridInView]   = useInView(0.08)

  // Filter by categoryKey (language-neutral) — null means "All"
  const filtered = activeCategory
    ? brands.filter(b => b.categoryKey === activeCategory)
    : brands

  return (
    <section id="products" className="bg-white overflow-hidden">

      {/* Header */}
      <div ref={headerRef}
           className={`max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-16
                        transition-all duration-700
                        ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="w-8 h-[2px] bg-brand-green rounded-full" />
          <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{header.chip}</span>
          <span className="w-8 h-[2px] bg-brand-green rounded-full" />
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
          <h2 className="font-display font-extrabold text-brand-green-deep text-4xl sm:text-5xl md:text-[56px] leading-none">
            {header.title} <span className="text-brand-green">{header.titleHighlight}</span>{' '}
            {header.titleEnd}
          </h2>
          <p className="text-brand-gray-mid text-base leading-relaxed max-w-sm lg:text-right">{header.desc}</p>
        </div>
      </div>

      {/* ── Featured Showcase ── */}
      <FeaturedShowcase brands={FEATURED} onOpenModal={setSelectedBrand} />

      {/* ── Filter + Grid ── */}
      <div className="bg-[#f8fffe] py-10 border-t border-brand-green/5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

          {/* Filter bar */}
          <div ref={gridRef} className="flex items-center gap-2 flex-wrap mb-7">
            {categories.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key === 'all' ? null : cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                            ${(cat.key === 'all' ? activeCategory === null : activeCategory === cat.key)
                              ? 'bg-brand-green text-white shadow-[0_4px_16px_rgba(27,168,130,0.3)]'
                              : 'bg-white text-brand-gray-mid border border-gray-200 hover:border-brand-green hover:text-brand-green'}`}>
                {cat.label}
              </button>
            ))}
            <span className="ml-2 text-brand-gray-mid text-xs font-medium hidden sm:inline">
              {filtered.length} brand ditemukan
            </span>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((brand, i) => (
              <div key={brand.id}
                   onClick={() => setSelectedBrand(brand)}
                   onMouseEnter={() => setHoveredId(brand.id)}
                   onMouseLeave={() => setHoveredId(null)}
                   className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer
                                hover:border-transparent
                                shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                                hover:shadow-[0_16px_48px_rgba(27,168,130,0.16)]
                                hover:-translate-y-1 transition-all duration-300
                                ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                   style={{ transitionDelay: `${i * 60}ms`, transitionDuration: '550ms' }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={brand.img} alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {brand.category}
                  </span>
                  <div className="absolute bottom-3 left-3">
                    <BrandLogo brand={brand} size="sm" />
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-display font-extrabold text-brand-green-deep text-lg mb-1">{brand.name}</h4>
                  <p className="text-brand-green text-xs font-semibold italic mb-3">{brand.tagline}</p>
                  <p className="text-brand-gray-mid text-sm leading-relaxed line-clamp-2 mb-4">{brand.desc}</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    {brand.stats.slice(0, 2).map(s => (
                      <div key={s.l}>
                        <p className="font-display font-extrabold text-brand-green-deep text-sm leading-none">{s.v}</p>
                        <p className="text-brand-gray-mid text-[10px] mt-0.5 uppercase tracking-wider">{s.l}</p>
                      </div>
                    ))}
                    <div className="ml-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                       ${hoveredId === brand.id ? 'bg-brand-green text-white' : 'bg-brand-green-pale text-brand-green'}`}>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100
                                transition-transform duration-300 origin-left"
                     style={{ background: brand.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="bg-brand-green-pale py-5 overflow-hidden border-y border-brand-green/10">
        <div className="flex items-center whitespace-nowrap animate-marquee">
          {marqueeItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40" />
              <span className="text-brand-green font-bold text-sm tracking-widest uppercase">{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="relative bg-brand-green rounded-3xl overflow-hidden px-8 sm:px-12 py-12 md:py-16
                          flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-16 right-40 w-48 h-48 rounded-full bg-brand-green-light/20 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)`, backgroundSize: '40px 40px' }} />
            <div className="relative text-center md:text-left">
              <p className="text-brand-green-light font-bold text-sm tracking-widest uppercase mb-3">{cta.eyebrow}</p>
              <h3 className="font-display font-extrabold text-white text-2xl sm:text-3xl md:text-4xl leading-tight">{cta.title}</h3>
              <p className="text-white/65 mt-3 max-w-md leading-relaxed">{cta.desc}</p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
              {cta.buttons.map(btn => (
                btn.variant === 'white'
                  ? <a key={btn.label} href={btn.href}
                       className="inline-flex items-center justify-center gap-2 bg-white text-brand-green font-bold px-7 py-3.5 rounded-xl hover:bg-brand-green-pale transition-all duration-300 hover:shadow-lg">
                      {btn.label} <ArrowRight size={16} />
                    </a>
                  : <a key={btn.label} href={btn.href}
                       className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-300">
                      {btn.label}
                    </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedBrand && (
        <ProductModal
          brand={selectedBrand}
          waNumber={waNumber}
          contactEmail={contactEmail}
          onClose={() => setSelectedBrand(null)}
        />
      )}
    </section>
  )
}