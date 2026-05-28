import { useContent } from '../hooks/useContent'
import { useEffect, useRef, useState } from 'react'
import {
  TrendingUp, Building2, Leaf, Users, BarChart3, Globe2,
  FileText, Download, Send, CheckCircle2, ChevronDown,
  Mail, Phone, ArrowRight, ShieldCheck, Zap, Target,
} from 'lucide-react'

const ICON_MAP = { TrendingUp, Building2, Leaf, Users, BarChart3, Globe2, FileText, ShieldCheck, Zap, Target, Mail, Phone, Download }

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

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView || !target) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

/* ── Animated metric card ── */
function MetricCard({ item, inView, delay }) {
  const Icon = ICON_MAP[item.icon]
  const count = useCounter(item.value, inView)
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 text-center
                     hover:bg-white/10 hover:border-white/20 transition-all duration-300
                     ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
         style={{ transitionDelay: `${delay}ms`, transitionDuration: '600ms' }}>
      <div className="w-11 h-11 rounded-xl bg-brand-green/30 border border-brand-green/30 flex items-center justify-center mx-auto mb-4">
        {Icon ? <Icon size={20} className="text-brand-green-light" /> : null}
      </div>
      <p className="font-display font-extrabold text-white text-3xl sm:text-4xl leading-none mb-1">
        {item.value ? `${count}${item.suffix}` : '🌏'}
      </p>
      <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
      <p className="text-white/40 text-xs">{item.sub}</p>
    </div>
  )
}

export default function InvestorPage() {
  const { data } = useContent('investor')
  const { hero, whyBoba, metrics, roadmap, documents, form: formData } = data ?? {}

  /* ── Scroll ke atas saat halaman pertama kali dibuka ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const [heroRef,    heroInView]    = useInView(0.1)
  const [whyRef,     whyInView]     = useInView(0.1)
  const [metricsRef, metricsInView] = useInView(0.1)
  const [roadRef,    roadInView]    = useInView(0.1)
  const [docsRef,    docsInView]    = useInView(0.1)
  const [formRef,    formInView]    = useInView(0.1)

  const [form, setForm] = useState({ name:'', company:'', email:'', phone:'', range:'', interest:'', message:'' })
  const [submitted, setSubmitted]   = useState(false)
  const [openIndex, setOpenIndex]   = useState(null)

  if (!hero) return null

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    const subject = encodeURIComponent(
      `[Investor Inquiry] ${form.interest || 'Umum'} – ${form.company || form.name}`
    )
    const body = encodeURIComponent(
      `Nama            : ${form.name}\n` +
      `Perusahaan      : ${form.company || '-'}\n` +
      `Email           : ${form.email}\n` +
      `Telepon         : ${form.phone || '-'}\n` +
      `Kisaran Investasi: ${form.range || '-'}\n` +
      `Bidang Minat    : ${form.interest || '-'}\n` +
      `\nPesan:\n${form.message}`
    )
    window.location.href = `mailto:investor@ptboba.co.id?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-brand-green-deep font-sans">

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero.image} alt="Investor Relations PT BOBA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-deep/95 via-brand-green-deep/80 to-brand-green-deep/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage:`linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)`, backgroundSize:'48px 48px' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-32 w-full">
          <div className="max-w-3xl">
            <div className={`transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block bg-brand-green/30 border border-brand-green/40 text-brand-green-light text-[11px] font-bold px-4 py-1.5 rounded-full tracking-[0.2em] uppercase mb-6">
                {hero.badge}
              </span>
            </div>
            <h1 className={`font-display font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 transition-all duration-700 delay-100 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {hero.title}<br />
              <span className="text-brand-green-light">{hero.titleHighlight}</span>
            </h1>
            <p className={`text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl transition-all duration-700 delay-200 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {hero.desc}
            </p>
            <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a href={hero.ctaPrimary.href} className="btn-primary">{hero.ctaPrimary.label} <ArrowRight size={16} /></a>
              <a href={hero.ctaSecondary.href} className="btn-outline">{hero.ctaSecondary.label}</a>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-400 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {hero.floatingStats.map((s, i) => {
              const Icon = ICON_MAP[s.icon]
              return (
                <div key={s.label} className="glass rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-lg bg-brand-green/30 flex items-center justify-center mb-3">
                    {Icon ? <Icon size={16} className="text-brand-green-light" /> : null}
                  </div>
                  <p className="font-display font-extrabold text-white text-xl leading-none mb-1">{s.value}</p>
                  <p className="text-white/70 text-xs font-semibold">{s.label}</p>
                  <p className="text-white/35 text-[10px] mt-0.5">{s.sub}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. WHY BOBA
      ══════════════════════════════════════════ */}
      <section ref={whyRef} className="bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className={`text-center mb-14 transition-all duration-700 ${whyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="section-chip justify-center">{whyBoba.chip}</span>
            <h2 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl mb-4 mt-1">
              {whyBoba.title}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {whyBoba.subtitle}{' '}
              <strong className="text-brand-green font-bold">({whyBoba.subtitleHighlight})</strong>.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyBoba.items.map((item, i) => {
              const Icon = ICON_MAP[item.icon]
              return (
                <div key={item.title}
                     className={`bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-[0_8px_40px_rgba(27,168,130,0.12)] hover:-translate-y-1 transition-all duration-300 ${whyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                     style={{ transitionDelay: `${i * 100}ms`, transitionDuration: '600ms' }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-green-pale flex items-center justify-center mb-5">
                    {Icon ? <Icon size={22} className="text-brand-green" /> : null}
                  </div>
                  <h4 className="font-display font-bold text-brand-green-deep text-lg mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. KEY METRICS
      ══════════════════════════════════════════ */}
      <section ref={metricsRef} className="bg-brand-green-deep py-20 md:py-28 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-green/15 blur-3xl pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className={`text-center mb-14 transition-all duration-700 ${metricsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
              <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{metrics.chip}</span>
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            </div>
            <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-5xl">{metrics.title}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {metrics.items.map((item, i) => (
              <MetricCard key={item.label} item={item} inView={metricsInView} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. ROADMAP
      ══════════════════════════════════════════ */}
      <section ref={roadRef} id="investor-roadmap" className="bg-[#edfaf6] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className={`text-center mb-14 transition-all duration-700 ${roadInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
              <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{roadmap.chip}</span>
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            </div>
            <h2 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl">{roadmap.title}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[2px] bg-brand-green/20 -translate-x-px hidden sm:block" />
            <div className="space-y-6">
              {roadmap.items.map((item, i) => (
                <div key={i}
                     className={`relative flex flex-col sm:flex-row gap-4 sm:gap-8 items-start
                                 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}
                                 transition-all duration-700 ${roadInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                     style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className={`hidden sm:flex flex-col items-center w-1/2 ${i % 2 === 0 ? 'items-end pr-8' : 'items-start pl-8'}`}>
                    <div className={`bg-white rounded-2xl border p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(27,168,130,0.12)] transition-all duration-300 w-full max-w-sm
                                     ${item.active ? 'border-brand-green' : item.upcoming ? 'border-dashed border-gray-300' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.upcoming ? 'bg-yellow-100 text-yellow-700' : item.active ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {item.upcoming ? 'Upcoming' : item.active ? 'In Progress' : 'Completed'}
                        </span>
                        <span className="text-brand-green font-bold text-sm">{item.year}{item.month ? ` · ${item.month}` : ''}</span>
                      </div>
                      <h4 className="font-display font-bold text-brand-green-deep text-base mb-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-brand-green bg-white z-10 top-6" />

                  {/* Mobile */}
                  <div className="sm:hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
                    <span className="text-brand-green font-bold text-xs">{item.year}{item.month ? ` · ${item.month}` : ''}</span>
                    <h4 className="font-display font-bold text-brand-green-deep text-base mt-1 mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. DOCUMENTS
      ══════════════════════════════════════════ */}
      <section ref={docsRef} className="bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className={`text-center mb-14 transition-all duration-700 ${docsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
              <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{documents.chip}</span>
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            </div>
            <h2 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl md:text-5xl">{documents.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {documents.items.map((doc, i) => {
              const Icon = ICON_MAP[doc.icon]
              return (
                <div key={doc.title}
                     className={`border border-gray-100 rounded-2xl p-7 hover:shadow-[0_8px_40px_rgba(27,168,130,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col ${docsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                     style={{ transitionDelay: `${i * 120}ms`, transitionDuration: '600ms' }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-green-pale flex items-center justify-center">
                      {Icon ? <Icon size={22} className="text-brand-green" /> : null}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${doc.tagColor}`}>{doc.tag}</span>
                  </div>
                  <h4 className="font-display font-bold text-brand-green-deep text-lg mb-2">{doc.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-6">{doc.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-400 text-xs">{doc.status}</span>
                    <button className="flex items-center gap-1.5 text-brand-green font-bold text-sm hover:text-brand-green-dark transition-colors">
                      <Download size={14} /> Unduh
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. CONTACT FORM
      ══════════════════════════════════════════ */}
      <section ref={formRef} id="investor-form" className="bg-brand-green-deep py-20 md:py-28 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-green/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-brand-green-light/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* Left — info */}
            <div className={`transition-all duration-700 ${formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-brand-green rounded-full" />
                <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{formData.chip}</span>
              </div>
              <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-[42px] leading-tight mb-5">
                {formData.title}
              </h2>
              <p className="text-white/65 leading-relaxed mb-10 max-w-md">{formData.subtitle}</p>

              <div className="space-y-4 mb-10">
                {formData.contacts.map(c => {
                  const Icon = ICON_MAP[c.icon]
                  return (
                    <a key={c.label} href={c.href}
                       className="flex items-center gap-4 bg-white/8 border border-white/10 rounded-2xl p-5 hover:bg-white/12 hover:border-brand-green/40 transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/30 flex items-center justify-center shrink-0 group-hover:bg-brand-green transition-colors duration-300">
                        {Icon ? <Icon size={18} className="text-brand-green-light group-hover:text-white" /> : null}
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-0.5">{c.label}</p>
                        <p className="text-white font-bold text-sm">{c.value}</p>
                      </div>
                    </a>
                  )
                })}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm leading-relaxed">{formData.commitment}</p>
              </div>
            </div>

            {/* Right — form */}
            <div className={`transition-all duration-700 delay-200 ${formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 bg-white/8 border border-white/15 rounded-2xl p-12 text-center">
                  <CheckCircle2 size={56} className="text-brand-green-light" />
                  <h4 className="font-display font-bold text-white text-2xl">{formData.successTitle}</h4>
                  <p className="text-white/60 text-sm max-w-xs leading-relaxed">{formData.successDesc}</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name:'',company:'',email:'',phone:'',range:'',interest:'',message:'' }) }}
                          className="mt-2 text-brand-green-light font-semibold text-sm hover:text-white transition-colors">
                    Kirim inquiry lain →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white/8 border border-white/15 rounded-2xl p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { name:'name',    label:'Nama Lengkap', placeholder:'Nama Anda', required:true },
                      { name:'company', label:'Perusahaan',   placeholder:'Nama perusahaan', required:false },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-white/70 text-sm font-semibold mb-1.5">
                          {f.label}{f.required && <span className="text-brand-green-light ml-1">*</span>}
                        </label>
                        <input type="text" name={f.name} value={form[f.name]} onChange={handleChange}
                          placeholder={f.placeholder} required={f.required}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-green-light focus:bg-white/15 transition-all duration-200" />
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { name:'email', label:'Email', placeholder:'email@perusahaan.com', type:'email', required:true },
                      { name:'phone', label:'No. Telepon', placeholder:'+62 8xx xxxx xxxx', type:'tel', required:false },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-white/70 text-sm font-semibold mb-1.5">
                          {f.label}{f.required && <span className="text-brand-green-light ml-1">*</span>}
                        </label>
                        <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                          placeholder={f.placeholder} required={f.required}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-green-light focus:bg-white/15 transition-all duration-200" />
                      </div>
                    ))}
                  </div>

                  {[
                    { name:'range',    label:'Kisaran Investasi', options: formData.rangeOptions,    placeholder:'Pilih kisaran...' },
                    { name:'interest', label:'Bidang Minat',      options: formData.interestOptions, placeholder:'Pilih bidang...' },
                  ].map(sel => (
                    <div key={sel.name}>
                      <label className="block text-white/70 text-sm font-semibold mb-1.5">{sel.label}</label>
                      <div className="relative">
                        <select name={sel.name} value={form[sel.name]} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm appearance-none focus:outline-none focus:border-brand-green-light focus:bg-white/15 transition-all duration-200">
                          <option value="">{sel.placeholder}</option>
                          {sel.options.map(o => <option key={o} value={o} className="text-gray-800">{o}</option>)}
                        </select>
                        <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-white/70 text-sm font-semibold mb-1.5">
                      Pesan / Pertanyaan <span className="text-brand-green-light">*</span>
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                      placeholder="Ceritakan tentang rencana investasi atau pertanyaan Anda..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:border-brand-green-light focus:bg-white/15 transition-all duration-200" />
                  </div>

                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-green-dark transition-all duration-300 hover:shadow-[0_4px_24px_rgba(27,168,130,0.40)] active:scale-[0.98]">
                    <Send size={16} /> Kirim Inquiry
                  </button>
                  <p className="text-white/30 text-xs text-center">{formData.privacyNote}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}