import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',     href: '#home',     section: 'home'     },
  { label: 'About',    href: '#about',    section: 'about'    },
  { label: 'Products', href: '#products', section: 'products' },
  { label: 'Services', href: '#services', section: 'services' },
  { label: 'Struktur', href: '#struktur', section: 'struktur' },
  { label: 'Partner',  href: '#partner',  section: 'partner'  },
  { label: 'Contact',  href: '#contact',  section: 'contact'  },
  { label: 'Investor', href: '/investor-relations', section: null },
]

const Logo = ({ scrolled }) => (
  <div className="flex items-center gap-3">
    <img
      src="/logo.png"
      alt="Logo PT BOBA"
      className="h-10 w-10 object-contain rounded-xl"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
        e.currentTarget.nextElementSibling.style.display = 'flex'
      }}
    />
    <div
      style={{ display: 'none' }}
      className={`h-10 w-10 rounded-lg border items-center justify-center shrink-0
                  ${scrolled ? 'bg-brand-green/10 border-brand-green/20' : 'bg-white/15 border-white/25'}`}
    >
      <span className={`text-[8px] font-bold ${scrolled ? 'text-brand-green' : 'text-white/50'}`}>LOGO</span>
    </div>
    <div className="flex flex-col leading-none">
      <span className={`font-display font-extrabold text-[15px] tracking-wider uppercase transition-colors duration-300
                        ${scrolled ? 'text-brand-green-deep' : 'text-white'}`}>
        PT BOBA
      </span>
      <span className="font-display font-semibold text-brand-green text-[11px] tracking-[0.12em] uppercase mt-0.5">
        Bikin Orang Bahagia
      </span>
    </div>
  </div>
)

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [active,    setActive]    = useState('Home')
  const location = useLocation()
  const navigate = useNavigate()
  const isInvestor = location.pathname === '/investor-relations'

  /* ── scroll: transparent → solid ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── body lock when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* ── scroll-spy via scroll event (reliable, handles click + manual scroll) ── */
  useEffect(() => {
    if (isInvestor) { setActive('Investor'); return }

    const spySections = NAV_LINKS.filter(l => l.section)
    const OFFSET = 80 // navbar height

    const update = () => {
      let current = spySections[0].section
      for (const link of spySections) {
        const el = document.getElementById(link.section)
        if (!el) continue
        if (el.getBoundingClientRect().top <= OFFSET) {
          current = link.section
        }
      }
      const found = spySections.find(l => l.section === current)
      setActive(found ? found.label : 'Home')
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // set initial state on mount
    return () => window.removeEventListener('scroll', update)
  }, [isInvestor, location.pathname])

  /* ── handle nav link click ── */
  const handleNavClick = (link) => {
    setMenuOpen(false)

    // Route link (investor page)
    if (!link.section) return // let <Link> handle it

    if (isInvestor) {
      // On investor page → go to home then scroll to section
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(link.section)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 80)
    } else {
      // Already on home → just scroll
      const el = document.getElementById(link.section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navBg = scrolled
    ? 'bg-white shadow-[0_2px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl'
    : 'bg-transparent'

  const linkCls = (label) => {
    const isActive = active === label
    return `relative px-3 py-2 text-[13px] font-semibold tracking-wide
            transition-colors duration-200 block group
            ${scrolled
              ? isActive ? 'text-brand-green' : 'text-brand-gray-dark hover:text-brand-green'
              : isActive ? 'text-white'        : 'text-white/75 hover:text-white'
            }`
  }

  const underlineCls = (label) =>
    `absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-brand-green
     transition-transform duration-200 origin-left
     ${active === label ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`

  const investorCls = (label) =>
    `ml-3 px-4 py-2 text-[11.5px] font-bold tracking-widest uppercase
     rounded-full transition-all duration-300 shadow-sm
     ${active === label
       ? 'bg-brand-green-deep text-white shadow-[0_4px_16px_rgba(27,168,130,0.5)]'
       : scrolled
         ? 'bg-brand-green text-white hover:bg-brand-green-deep hover:shadow-[0_4px_16px_rgba(27,168,130,0.4)]'
         : 'bg-brand-green text-white hover:bg-brand-green-deep hover:shadow-[0_4px_20px_rgba(27,168,130,0.5)]'
     }`

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-40 transition-all duration-400 ${navBg}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10
                        flex items-center h-[68px]">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo scrolled={scrolled} />
          </Link>

          {/* Desktop nav — right aligned */}
          <ul className="hidden xl:flex items-center justify-end flex-1 gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                {link.section === null ? (
                  /* Investor — prominent pill button */
                  <Link to={link.href} className={investorCls(link.label)}>
                    {link.label}
                  </Link>
                ) : (
                  /* Section links */
                  <button
                    onClick={() => handleNavClick(link)}
                    className={linkCls(link.label)}
                  >
                    {link.label}
                    <span className={underlineCls(link.label)} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <div className="xl:hidden flex items-center ml-auto">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 transition-colors ${scrolled ? 'text-brand-gray-dark' : 'text-white/80 hover:text-white'}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {scrolled && <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gray-100" />}
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`xl:hidden fixed inset-0 z-30 transition-all duration-300
                       ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
             onClick={() => setMenuOpen(false)} />

        <div className={`absolute top-0 right-0 h-full w-[280px] bg-white
                         shadow-2xl transition-transform duration-300 flex flex-col
                         ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 mt-[68px]">
            <Logo scrolled={true} />
            <button onClick={() => setMenuOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700">
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {NAV_LINKS.map((link) =>
              link.section === null ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-6 py-3.5
                              text-[14px] font-semibold border-b border-gray-50
                              transition-all duration-200
                              ${active === link.label
                                ? 'text-brand-green bg-brand-green-pale'
                                : 'text-brand-green hover:bg-brand-green-pale'
                              }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] bg-brand-green text-white px-2 py-0.5 rounded font-bold tracking-wider">
                    IR
                  </span>
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`w-full text-left flex items-center px-6 py-3.5
                              text-[14px] font-semibold border-b border-gray-50
                              transition-all duration-200
                              ${active === link.label
                                ? 'text-brand-green bg-brand-green-pale'
                                : 'text-gray-600 hover:text-brand-green hover:bg-brand-green-pale'
                              }`}
                >
                  {link.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}