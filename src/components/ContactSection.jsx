import { useContent } from '../hooks/useContent'
import { useEffect, useRef, useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown, MessageSquare } from 'lucide-react'

const ICON_MAP = { Mail, Phone, MapPin }

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

export default function ContactSection() {
  const { data } = useContent('contact')
  const { header, contactInfo = [], form: formData = {}, map = {}, quickContact = [], whatsapp = {}, faq } = data ?? {}
  const [headerRef, headerInView] = useInView(0.1)
  const [formRef,   formInView]   = useInView(0.08)
  const [faqRef,    faqInView]    = useInView(0.08)
  const [form, setForm]     = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq]     = useState(null)

  if (!header) return null

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[PT BOBA] ${form.subject}`)
    const body = encodeURIComponent(
      `Nama        : ${form.name}\n` +
      `Email       : ${form.email}\n` +
      `Telepon     : ${form.phone || '-'}\n` +
      `Subjek      : ${form.subject}\n` +
      `\nPesan:\n${form.message}`
    )
    window.location.href = `mailto:hello@ptboba.id?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <section id="contact" className="overflow-hidden">

      {/* 1. HEADER + INFO CARDS */}
      <div ref={headerRef} className="bg-[#edfaf6] py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className={`text-center mb-10 transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

          <div className={`grid sm:grid-cols-3 gap-5 transition-all duration-700 delay-200 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {contactInfo.map((c, i) => {
              const Icon = ICON_MAP[c.icon]
              return (
                <div key={c.label}
                     className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(27,168,130,0.10)] hover:-translate-y-1 transition-all duration-300"
                     style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-brand-green-pale flex items-center justify-center mb-4">
                    {Icon ? <Icon size={18} className="text-brand-green" /> : null}
                  </div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1">{c.label}</p>
                  <p className="font-semibold text-brand-green-deep text-sm leading-snug mb-1">{c.value}</p>
                  <p className="text-gray-400 text-xs">{c.sub}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. FORM + MAP */}
      <div ref={formRef} className="bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Form */}
            <div className={`transition-all duration-700 ${formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={20} className="text-brand-green" />
                <h3 className="font-display font-bold text-brand-green-deep text-2xl">{formData.title}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-8">{formData.subtitle}</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 bg-brand-green-pale rounded-2xl p-12 text-center border border-brand-green/20">
                  <CheckCircle2 size={48} className="text-brand-green" />
                  <h4 className="font-display font-bold text-brand-green-deep text-xl">{formData.successTitle}</h4>
                  <p className="text-gray-500 text-sm max-w-xs">{formData.successDesc}</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }) }}
                          className="mt-2 text-brand-green font-semibold text-sm hover:text-brand-green-dark transition-colors">
                    {formData.successReset}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { name:'name',  label:'Nama Lengkap', type:'text',  placeholder:'Masukkan nama Anda', required:true },
                      { name:'email', label:'Email',        type:'email', placeholder:'nama@email.com',    required:true },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-sm font-semibold text-brand-green-deep mb-1.5">
                          {f.label} {f.required && <span className="text-brand-green">*</span>}
                        </label>
                        <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                          placeholder={f.placeholder} required={f.required}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-brand-green-deep placeholder-gray-300 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 transition-all duration-200" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-green-deep mb-1.5">Nomor Telepon</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+62 8xx xxxx xxxx"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-brand-green-deep placeholder-gray-300 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-green-deep mb-1.5">
                      Subjek <span className="text-brand-green">*</span>
                    </label>
                    <div className="relative">
                      <select name="subject" value={form.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-brand-green-deep appearance-none bg-white focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 transition-all duration-200">
                        <option value="" disabled>Pilih subjek pesan...</option>
                        {formData.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-green-deep mb-1.5">
                      Pesan <span className="text-brand-green">*</span>
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="Tuliskan pesan, pertanyaan, atau proposal Anda..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-brand-green-deep placeholder-gray-300 resize-none focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 transition-all duration-200" />
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-green-dark transition-all duration-300 hover:shadow-[0_4px_24px_rgba(27,168,130,0.40)] active:scale-[0.98]">
                    <Send size={16} /> Kirim Pesan
                  </button>
                  <p className="text-gray-400 text-xs text-center">{formData.privacyNote}</p>
                </form>
              )}
            </div>

            {/* Map + quick contact */}
            <div className={`transition-all duration-700 delay-200 ${formInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="rounded-2xl overflow-hidden h-72 mb-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <iframe title={map.title} src={map.embedUrl} width="100%" height="100%"
                  style={{ border:0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {quickContact.map(c => {
                  const Icon = ICON_MAP[c.icon]
                  return (
                    <a key={c.label} href={c.href}
                       className="bg-brand-green-pale rounded-2xl p-5 border border-brand-green/15 hover:border-brand-green hover:shadow-[0_4px_20px_rgba(27,168,130,0.15)] transition-all duration-300 group block">
                      <div className="w-9 h-9 rounded-lg bg-brand-green flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        {Icon ? <Icon size={16} className="text-white" /> : null}
                      </div>
                      <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">{c.label}</p>
                      <p className="font-bold text-brand-green-deep text-sm">{c.value}</p>
                    </a>
                  )
                })}
              </div>
              <a href={`https://wa.me/${whatsapp.number}`} target="_blank" rel="noopener noreferrer"
                 className="mt-4 flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#1ebe5c] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(37,211,102,0.35)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {whatsapp.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FAQ */}
      <div ref={faqRef} className="bg-[#edfaf6] py-20 md:py-24 border-t border-brand-green/10">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10">
          <div className={`text-center mb-12 transition-all duration-700 ${faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
              <span className="text-brand-green text-[11px] font-bold tracking-[0.22em] uppercase">{faq.chip}</span>
              <span className="w-8 h-[2px] bg-brand-green rounded-full" />
            </div>
            <h3 className="font-display font-extrabold text-brand-green-deep text-3xl sm:text-4xl">{faq.title}</h3>
          </div>
          <div className={`space-y-3 transition-all duration-700 delay-200 ${faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {faq.items.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-brand-green-pale/50 transition-colors duration-200">
                  <span className="font-semibold text-brand-green-deep text-sm sm:text-base leading-snug">{item.q}</span>
                  <ChevronDown size={18} className={`text-brand-green shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}