import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { Card, CardTitle, Badge, Spinner, Btn } from '../components/UI'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  { id: 'hero',     label: 'Hero / Slider',      icon: '🎬', desc: 'Video slider & floating stats' },
  { id: 'about',    label: 'Tentang Kami',        icon: '🏢', desc: 'Profil, visi misi, pilar, timeline' },
  { id: 'brands',   label: 'Brand',               icon: '🏷️', desc: 'Brand & platform PT BOBA' },
  { id: 'products', label: 'Produk',              icon: '📦', desc: 'Portfolio produk, WA/email global' },
  { id: 'services', label: 'Layanan',             icon: '♻️', desc: 'Grup layanan IP Ventures & Foundation' },
  { id: 'struktur', label: 'Struktur',            icon: '👥', desc: 'Pendiri, subholding, investasi' },
  { id: 'partners', label: 'Mitra',               icon: '🤝', desc: 'Partner & cara kemitraan' },
  { id: 'contact',  label: 'Kontak',              icon: '📞', desc: 'Info kontak, peta, FAQ' },
  { id: 'footer',   label: 'Footer',              icon: '📄', desc: 'Brand info, navigasi, sosmed' },
  { id: 'investor', label: 'Investor Relations',  icon: '💼', desc: 'Hero, metrics, roadmap, dokumen' },
]

function StatCard({ label, value, sub, color = '#1BA882' }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px', borderTop: `4px solid ${color}` }}>
      <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</p>
      <p style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, color: '#111', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { admin } = useAuth()
  const navigate  = useNavigate()
  const [meta, setMeta]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getContentMeta()
      .then(res => setMeta(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getMeta   = (section) => meta.find(m => m.section === section)
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  const inDB      = meta.filter(m => m.inDB !== false).length
  const notInDB   = SECTIONS.length - inDB
  const sorted    = [...meta].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  const lastUpdate = sorted[0]

  return (
    <div>
      {/* ── Welcome banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5040 0%, #1BA882 100%)', borderRadius: 16, padding: '28px 32px', marginBottom: 28, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Selamat datang kembali 👋</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>{admin?.displayName}</h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            Role: <strong style={{ color: '#fff' }}>{admin?.role === 'superadmin' ? 'Super Admin' : 'Editor'}</strong>
            {lastUpdate?.updatedAt && <> · Terakhir update: <strong style={{ color: '#fff' }}>{formatDate(lastUpdate.updatedAt)}</strong></>}
          </p>
        </div>
        <a href="http://localhost:5173" target="_blank" rel="noreferrer"
          style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}>
          🔗 Lihat Website
        </a>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Section"      value={SECTIONS.length}  sub="Semua halaman website"        color="#1BA882" />
        <StatCard label="Di Database"        value={inDB}             sub="Bisa diedit via panel ini"    color="#059669" />
        <StatCard label="Belum Di-seed"      value={notInDB}          sub="Pakai npm run seed"           color="#f59e0b" />
        <StatCard label="Role Anda"          value={admin?.role === 'superadmin' ? 'Super' : 'Editor'}
                                             sub={admin?.role === 'superadmin' ? 'Akses penuh' : 'Edit konten'}
                                             color="#8b5cf6" />
      </div>

      {/* ── Sections grid ── */}
      <Card>
        <CardTitle sub="Klik section untuk mulai mengedit konten website">
          Semua Section — {SECTIONS.length} halaman
        </CardTitle>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={32} /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {SECTIONS.map(sec => {
              const m = getMeta(sec.id)
              const inDatabase = m && m.inDB !== false

              return (
                <div key={sec.id} onClick={() => navigate(`/admin/${sec.id}`)}
                  style={{ border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: 14 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1BA882'; e.currentTarget.style.boxShadow = '0 4px 20px #1BA88215' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: inDatabase ? '#e8f8f3' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {sec.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{sec.label}</span>
                      {inDatabase
                        ? <Badge color="#059669">✓ DB</Badge>
                        : <Badge color="#9ca3af">Fallback</Badge>
                      }
                    </div>
                    <p style={{ margin: '0 0 5px', fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{sec.desc}</p>
                    {inDatabase && m?.updatedAt && (
                      <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
                        {formatDate(m.updatedAt)}{m.updatedByName && ` · ${m.updatedByName}`}
                      </p>
                    )}
                  </div>
                  <span style={{ color: '#d1d5db', fontSize: 18, flexShrink: 0, alignSelf: 'center' }}>›</span>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* ── Quick actions ── */}
      {notInDB > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', marginTop: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
            <strong>⚠️ {notInDB} section</strong> belum ada di database (tampil dengan data fallback).
            Jalankan <code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>npm run seed</code> di folder backend untuk mengisi datanya.
          </p>
        </div>
      )}
    </div>
  )
}
