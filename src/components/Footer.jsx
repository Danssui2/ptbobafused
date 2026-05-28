import { useContent } from '../hooks/useContent'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Twitter, Youtube, Linkedin, ArrowUp } from 'lucide-react'

const ICON_MAP = { Mail, Phone, MapPin, Instagram, Twitter, Youtube, Linkedin }

const Logo = () => (
  <div className="flex items-center gap-3">
    <img src="/logo.png" alt="PT BOBA" className="h-10 w-10 object-contain"
         onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='flex' }} />
    <div style={{ display:'none' }}
         className="h-10 w-10 rounded-lg bg-white/15 border border-white/20 items-center justify-center shrink-0">
      <span className="text-white/50 text-[8px] font-bold">LOGO</span>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display font-extrabold text-white text-[15px] tracking-wider uppercase">PT BOBA</span>
      <span className="font-display font-semibold text-brand-green-light text-[11px] tracking-[0.12em] uppercase mt-0.5">
        Bikin Orang Bahagia
      </span>
    </div>
  </div>
)

export default function Footer() {
  const { data } = useContent('footer')
  const { brand, socials = [], navGroups = [], newsletter = {}, bottomLinks = [], copyright } = data ?? {}
  const { pathname } = useLocation()
  const isInvestor = pathname.startsWith('/investor')
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const year = new Date().getFullYear()

  const [subEmail, setSubEmail]   = useState('')
  const [subDone,  setSubDone]    = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!subEmail) return
    const subject = encodeURIComponent('Langganan Newsletter – PT BOBA')
    const body    = encodeURIComponent(`Halo tim PT BOBA,\n\nSaya ingin berlangganan newsletter dan informasi terbaru dari PT BOBA.\n\nEmail: ${subEmail}\n\nTerima kasih.`)
    window.location.href = `mailto:hello@ptboba.id?subject=${subject}&body=${body}`
    setSubDone(true)
  }

  return (
    <footer className="bg-brand-green-deep text-white">

      {/* top brand strip removed */}

      {/* Main body */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-10 xl:gap-8">

          {/* Brand col */}
          <div className="xl:col-span-2">
            <Logo />
            <p className="mt-5 text-white/55 text-sm leading-relaxed max-w-xs">{brand.tagline}</p>
            <div className="mt-6 space-y-2.5">
              {[
                { icon: 'MapPin', text: brand.address },
                { icon: 'Phone',  text: brand.phone   },
                { icon: 'Mail',   text: brand.email   },
              ].map(c => {
                const Icon = ICON_MAP[c.icon]
                return (
                  <div key={c.text} className="flex items-start gap-2.5">
                    {Icon ? <Icon size={13} className="text-brand-green-light mt-0.5 shrink-0" /> : null}
                    <span className="text-white/50 text-xs leading-relaxed">{c.text}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-2.5 mt-7">
              {socials.map(s => {
                const Icon = ICON_MAP[s.icon]
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                     className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-300">
                    {Icon ? <Icon size={15} /> : null}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Nav cols */}
          {navGroups.map(group => (
            <div key={group.title} className="xl:col-span-1">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-5">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map(link => {
                    const isHash = link.href.startsWith('#')
                    const to = isHash && isInvestor ? `/${link.href}` : link.href
                    const inner = (
                      <span className="flex items-center gap-2 text-white/50 text-sm hover:text-brand-green-light transition-colors duration-200 group">
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                        {link.badge && (
                          <span className="text-[9px] font-bold bg-brand-green/30 text-brand-green-light px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            {link.badge}
                          </span>
                        )}
                      </span>
                    )
                    return (
                      <li key={link.label}>
                        {link.href.startsWith('/') && !isHash
                          ? <Link to={link.href}>{inner}</Link>
                          : isHash && isInvestor
                            ? <Link to={to}>{inner}</Link>
                            : <a href={link.href}>{inner}</a>
                        }
                      </li>
                    )
                  })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">{newsletter.title}</p>
            <p className="text-white/50 text-sm">{newsletter.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {subDone ? (
              <p className="text-brand-green-light text-sm font-semibold">
                ✓ App email Anda akan terbuka — kirim untuk berlangganan!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  value={subEmail}
                  onChange={e => setSubEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  className="flex-1 sm:w-64 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-green-light focus:bg-white/15 transition-all duration-200"
                />
                <button type="submit"
                  className="px-5 py-3 bg-brand-green text-white font-bold text-sm rounded-xl hover:bg-brand-green-dark whitespace-nowrap transition-all duration-300 hover:shadow-[0_4px_20px_rgba(27,168,130,0.4)]">
                  {newsletter.ctaLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs text-center sm:text-left">
            © {year} {copyright}
          </p>
          <div className="flex items-center gap-5">
            {bottomLinks.map(l => (
              <a key={l} href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">{l}</a>
            ))}
          </div>
          <button onClick={scrollToTop} aria-label="Kembali ke atas"
            className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-300 hover:scale-110">
            <ArrowUp size={15} />
          </button>
        </div>
      </div>

    </footer>
  )
}