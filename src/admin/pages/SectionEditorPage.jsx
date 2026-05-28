import { useParams, useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { Card, Btn, Alert, Spinner, Badge } from '../components/UI'
import HeroEditor     from './editors/HeroEditor'
import AboutEditor    from './editors/AboutEditor'
import BrandsEditor   from './editors/BrandsEditor'
import ProductsEditor from './editors/ProductsEditor'
import ServicesEditor from './editors/ServicesEditor'
import StrukturEditor from './editors/StrukturEditor'
import PartnersEditor from './editors/PartnersEditor'
import ContactEditor  from './editors/ContactEditor'
import FooterEditor   from './editors/FooterEditor'
import InvestorEditor from './editors/InvestorEditor'

const EDITORS = {
  hero:     HeroEditor,
  about:    AboutEditor,
  brands:   BrandsEditor,
  products: ProductsEditor,
  services: ServicesEditor,
  struktur: StrukturEditor,
  partners: PartnersEditor,
  contact:  ContactEditor,
  footer:   FooterEditor,
  investor: InvestorEditor,
}

const SECTION_META = {
  hero:     { label: 'Hero / Slider',     icon: '🎬', desc: 'Video slider & floating stats' },
  about:    { label: 'Tentang Kami',      icon: '🏢', desc: 'Profil, visi misi, pilar, timeline' },
  brands:   { label: 'Brand',             icon: '🏷️', desc: 'Brand & platform PT BOBA' },
  products: { label: 'Produk',            icon: '📦', desc: 'Portfolio produk, WA/email global' },
  services: { label: 'Layanan',           icon: '♻️', desc: 'Grup layanan IP Ventures & Foundation' },
  struktur: { label: 'Struktur',          icon: '👥', desc: 'Pendiri, subholding, investasi' },
  partners: { label: 'Mitra',             icon: '🤝', desc: 'Partner & cara kemitraan' },
  contact:  { label: 'Kontak',            icon: '📞', desc: 'Info kontak, peta, FAQ' },
  footer:   { label: 'Footer',            icon: '📄', desc: 'Brand info, navigasi, sosmed' },
  investor: { label: 'Investor Relations',icon: '💼', desc: 'Hero, why BOBA, metrics, roadmap, docs' },
}

export default function SectionEditorPage() {
  const { section } = useParams()
  const navigate = useNavigate()
  const { data, loading, saving, error, dirty, lastSaved, update, save, refetch } = useContent(section)

  const meta   = SECTION_META[section]
  const Editor = EDITORS[section]

  const handleSave = async () => {
    try { await save() } catch {}
  }

  if (!Editor) return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '32px 24px', textAlign: 'center' }}>
      <p style={{ color: '#dc2626', marginBottom: 16 }}>Section &ldquo;{section}&rdquo; tidak ditemukan.</p>
      <Btn onClick={() => navigate('/admin')}>← Kembali ke Dashboard</Btn>
    </div>
  )

  return (
    <div>
      {/* ── Header bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Btn onClick={() => navigate('/admin')} variant="outline" size="sm">← Dashboard</Btn>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{meta?.icon}</span>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111' }}>{meta?.label}</h1>
              {dirty       && <Badge color="#f59e0b">⚡ Ada perubahan</Badge>}
              {!dirty && lastSaved && <Badge color="#059669">✓ Tersimpan</Badge>}
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9ca3af' }}>{meta?.desc}</p>
            {lastSaved && <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Tersimpan: {lastSaved.toLocaleTimeString('id-ID')}</p>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={refetch} variant="outline" size="sm" disabled={loading || saving}>↺ Reset</Btn>
          <Btn onClick={handleSave} variant="primary" size="sm" disabled={!dirty || saving}>
            {saving ? <><Spinner size={14} color="#fff" /> Menyimpan...</> : '💾 Simpan ke Database'}
          </Btn>
        </div>
      </div>

      {/* ── Alerts ── */}
      {error && <Alert type="error">{error}</Alert>}
      {!error && dirty && (
        <Alert type="warning">Ada perubahan yang belum disimpan. Klik <strong>Simpan ke Database</strong>.</Alert>
      )}

      {/* ── Editor ── */}
      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Spinner size={36} />
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Memuat data dari database...</p>
        </div>
      ) : data ? (
        <Editor data={data} onChange={update} />
      ) : (
        <Alert type="error">
          Gagal memuat data. <button onClick={refetch} style={{ color: '#1BA882', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Coba lagi</button>
        </Alert>
      )}

      {/* ── Sticky save bar ── */}
      {dirty && !loading && (
        <div style={{ position: 'sticky', bottom: 24, display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 10, background: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb' }}>
            <Btn onClick={refetch} variant="outline">Buang Perubahan</Btn>
            <Btn onClick={handleSave} variant="primary" disabled={saving}>
              {saving ? <><Spinner size={14} color="#fff" /> Menyimpan...</> : '💾 Simpan ke Database'}
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}
