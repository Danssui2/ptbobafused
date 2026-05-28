import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const SECTIONS = [
  { id: 'hero',     label: 'Hero / Slider',      icon: '🎬' },
  { id: 'about',    label: 'Tentang Kami',        icon: '🏢' },
  { id: 'brands',   label: 'Brand',               icon: '🏷️' },
  { id: 'products', label: 'Produk',              icon: '📦' },
  { id: 'services', label: 'Layanan',             icon: '♻️' },
  { id: 'struktur', label: 'Struktur',            icon: '👥' },
  { id: 'partners', label: 'Mitra',               icon: '🤝' },
  { id: 'contact',  label: 'Kontak',              icon: '📞' },
  { id: 'footer',   label: 'Footer',              icon: '📄' },
  { id: 'investor', label: 'Investor Relations',  icon: '💼' },
]

const navLinkStyle = ({ isActive }) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 12px', borderRadius: 9,
  textDecoration: 'none', fontSize: 14,
  fontWeight: isActive ? 700 : 400, marginBottom: 2,
  background: isActive ? '#e8f8f3' : 'transparent',
  color: isActive ? '#0f6e4a' : '#374151',
  transition: 'all 0.15s',
})

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loggingOut, setLoggingOut]   = useState(false)

  const handleLogout = () => {
    setLoggingOut(true)
    setTimeout(() => { logout(); navigate('/login') }, 300)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(x => !x)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '4px 8px', color: '#6b7280', borderRadius: 8 }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #1BA882, #0D5040)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>PT</div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: '#111', lineHeight: 1.2 }}>PT BOBA</p>
              <p style={{ margin: 0, fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel · {SECTIONS.length} Sections</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="http://localhost:5173" target="_blank" rel="noreferrer"
            style={{ padding: '7px 14px', borderRadius: 8, background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            🔗 Website
          </a>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1BA882', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            {(admin?.displayName || 'A').charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            style={{ padding: '7px 14px', borderRadius: 8, background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {loggingOut ? '...' : 'Keluar'}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: sidebarOpen ? 230 : 0, overflow: 'hidden', transition: 'width 0.25s ease', borderRight: '1px solid #e5e7eb', background: '#fff', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px', width: 230 }}>

            <NavLink to="/admin" end style={navLinkStyle}>
              <span style={{ fontSize: 16 }}>🏠</span> Dashboard
            </NavLink>

            <div style={{ margin: '14px 0 7px 10px', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Konten Website
            </div>

            {SECTIONS.map(s => (
              <NavLink key={s.id} to={`/admin/${s.id}`} style={navLinkStyle}
                onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = '#f9fafb' }}
                onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent' }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{s.icon}</span>
                <span style={{ flex: 1, lineHeight: 1.3 }}>{s.label}</span>
              </NavLink>
            ))}

            <div style={{ margin: '14px 0 7px 10px', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Akun
            </div>
            <NavLink to="/admin/settings" style={navLinkStyle}>
              <span style={{ fontSize: 15 }}>⚙️</span> Pengaturan
            </NavLink>
          </div>

          <div style={{ padding: '10px 14px', borderTop: '1px solid #f3f4f6', width: 230 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>PT BOBA CMS · v2.0.0</p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ maxWidth: 840, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
