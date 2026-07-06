/**
 * SectionEditors.jsx — PT BOBA Admin Panel
 * Semua editor section website, sinkron dengan struktur data terbaru.
 *
 * Sections:
 *   AboutEditor, BrandsEditor, ProductsEditor, ServicesEditor,
 *   StrukturEditor, PartnersEditor, ContactEditor, FooterEditor, InvestorEditor
 */
import { useState } from 'react'
import { Card, CardTitle, Field, Input, Textarea, LocalizedInput, LocalizedTextarea, Select, ItemCard, CollapsibleItemCard, Btn, Grid2, Divider, Badge, Alert } from '../../components/UI'
import { uploadToCloudinary, isCloudinaryConfigured } from '../../utils/cloudinary'
import { cld } from '../../utils/cloudinaryUrl'

const clone = v => JSON.parse(JSON.stringify(v))

// bt() — safely display a bilingual { id, en } field (or plain string) as text,
// used for ItemCard labels / previews where only a short display string is needed.
const bt = (v) => (v && typeof v === 'object' && !Array.isArray(v)) ? (v.id ?? v.en ?? '') : (v ?? '')

// ─── Shared helpers ───────────────────────────────────────────────────────────
const ColorField = ({ label, value, onChange }) => (
  <Field label={label}>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
        style={{ width: 40, height: 36, border: '1.5px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', padding: 2, flexShrink: 0 }} />
      <LocalizedInput value={value} onChange={onChange} placeholder="#000000" />
    </div>
  </Field>
)

const ImgPreview = ({ src }) =>
  src ? <img src={cld(src, 'q_auto,f_auto,c_scale,w_300')} alt="preview" onError={e => e.target.style.display = 'none'}
    style={{ height: 80, borderRadius: 8, objectFit: 'cover', marginBottom: 14, maxWidth: '100%', display: 'block' }} /> : null

// Input URL gambar + tombol "Upload Foto" yang langsung kirim file ke Cloudinary.
// Hasil upload otomatis mengisi field URL (tidak perlu copy-paste link manual lagi).
const ImageUploadField = ({ value, onChange, placeholder = 'https://... atau upload file', folder = 'ptboba' }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // reset agar file yang sama bisa dipilih ulang
    if (!file) return
    setError(''); setUploading(true); setProgress(0)
    try {
      const url = await uploadToCloudinary(file, { folder, onProgress: setProgress })
      onChange(url)
    } catch (err) {
      setError(err.message || 'Upload gagal.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Input value={value} onChange={onChange} placeholder={placeholder} disabled={uploading} />
        </div>
        <label style={{
          flexShrink: 0, padding: '9px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: uploading ? 'default' : 'pointer', whiteSpace: 'nowrap',
          background: uploading ? '#f3f4f6' : '#ecfdf5', color: uploading ? '#9ca3af' : '#0f766e',
          border: `1.5px solid ${uploading ? '#e5e7eb' : '#99f6e4'}`,
        }}>
          {uploading ? `Uploading ${progress}%` : '📤 Upload Foto'}
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>
      {error && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{error}</p>}
      {!isCloudinaryConfigured() && (
        <p style={{ fontSize: 11, color: '#d97706', marginTop: 6 }}>
          ⚠️ Cloudinary belum dikonfigurasi — isi VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET di file .env. Untuk sementara kamu masih bisa paste URL manual.
        </p>
      )}
      <ImgPreview src={value} />
    </div>
  )
}

// ─── ABOUT EDITOR ─────────────────────────────────────────────────────────────
export function AboutEditor({ data, onChange }) {
  const { hero = {}, stats = [], visiMisi = {}, pillars = {}, timeline = {}, cta = {} } = data ?? {}

  const updHero = (k, v) => onChange({ ...data, hero: { ...hero, [k]: v } })
  const updBadge = (k, v) => onChange({ ...data, hero: { ...hero, badge: { ...hero.badge, [k]: v } } })
  const updStat = (i, k, v) => { const n = clone(stats); n[i][k] = k === 'value' ? (parseInt(v)||0) : v; onChange({ ...data, stats: n }) }
  const updVisi = (k, v) => onChange({ ...data, visiMisi: { ...visiMisi, visi: { ...visiMisi.visi, [k]: v } } })
  const updMisi = (i, v) => { const n = clone(visiMisi.misi||[]); n[i] = v; onChange({ ...data, visiMisi: { ...visiMisi, misi: n } }) }
  const addMisi = () => onChange({ ...data, visiMisi: { ...visiMisi, misi: [...(visiMisi.misi||[]), { id: 'Misi baru', en: 'New mission' }] } })
  const removeMisi = i => onChange({ ...data, visiMisi: { ...visiMisi, misi: (visiMisi.misi||[]).filter((_,idx)=>idx!==i) } })
  const updPillar = (i, k, v) => { const n = clone(pillars.items||[]); n[i][k] = v; onChange({ ...data, pillars: { ...pillars, items: n } }) }
  const addPillar = () => onChange({ ...data, pillars: { ...pillars, items: [...(pillars.items||[]), { icon: 'Leaf', title: { id: 'Pilar Baru', en: 'New Pillar' }, desc: { id: 'Deskripsi.', en: 'Description.' }, color: '#1BA882' }] } })
  const removePillar = i => onChange({ ...data, pillars: { ...pillars, items: (pillars.items||[]).filter((_,idx)=>idx!==i) } })
  const updMilestone = (i, k, v) => { const n = clone(timeline.milestones||[]); n[i][k] = v; onChange({ ...data, timeline: { ...timeline, milestones: n } }) }
  const addMilestone = () => onChange({ ...data, timeline: { ...timeline, milestones: [...(timeline.milestones||[]), { year: String(new Date().getFullYear()), event: { id: 'Milestone baru', en: 'New milestone' } }] } })
  const removeMilestone = i => onChange({ ...data, timeline: { ...timeline, milestones: (timeline.milestones||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      {/* ── Hero ── */}
      <Card>
        <CardTitle sub="Bagian header section Tentang Kami">Hero / Header</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={hero.chip} onChange={v=>updHero('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={hero.title} onChange={v=>updHero('title',v)} /></Field>
          <Field label="Judul Highlight (hijau)"><LocalizedInput value={hero.titleHighlight} onChange={v=>updHero('titleHighlight',v)} /></Field>
          <Field label="Badge Nilai"><LocalizedInput value={hero.badge?.value} onChange={v=>updBadge('value',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><LocalizedTextarea value={hero.description} onChange={v=>updHero('description',v)} rows={4} /></Field>
        <Field label="URL Foto Tim" hint="URL gambar dari Pexels/Unsplash"><LocalizedInput value={hero.image} onChange={v=>updHero('image',v)} /></Field>
        <ImgPreview src={hero.image} />
        <Grid2>
          <Field label="Label Foto"><LocalizedInput value={hero.imageLabel} onChange={v=>updHero('imageLabel',v)} /></Field>
          <Field label="Sub Label Foto"><LocalizedInput value={hero.imageSub} onChange={v=>updHero('imageSub',v)} /></Field>
        </Grid2>
      </Card>

      {/* ── Stats ── */}
      <Card>
        <CardTitle sub="Angka statistik di bawah hero">Statistik Perusahaan</CardTitle>
        {stats.map((s,i) => (
          <ItemCard key={i} label={`Stat ${i+1} — ${bt(s.label)}`}>
            <Grid2>
              <Field label="Label"><LocalizedInput value={s.label} onChange={v=>updStat(i,'label',v)} /></Field>
              <Field label="Nilai (angka)"><LocalizedInput value={s.value} onChange={v=>updStat(i,'value',v)} type="number" /></Field>
              <Field label="Suffix" hint='Contoh: +, K, %'><LocalizedInput value={s.suffix} onChange={v=>updStat(i,'suffix',v)} /></Field>
              <Field label="Sub-label kecil"><LocalizedInput value={s.sub} onChange={v=>updStat(i,'sub',v)} /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      {/* ── Visi Misi ── */}
      <Card>
        <CardTitle>Visi Perusahaan</CardTitle>
        <Field label="Judul Visi"><LocalizedInput value={visiMisi.visi?.title} onChange={v=>updVisi('title',v)} /></Field>
        <Field label="Deskripsi Visi"><LocalizedTextarea value={visiMisi.visi?.desc} onChange={v=>updVisi('desc',v)} rows={3} /></Field>
      </Card>
      <Card>
        <CardTitle action={<Btn onClick={addMisi} variant="primary" size="sm">+ Tambah</Btn>}>Misi Perusahaan</CardTitle>
        {(visiMisi.misi||[]).map((m,i) => (
          <ItemCard key={i} label={`Misi ${i+1}`} onRemove={()=>removeMisi(i)}>
            <LocalizedTextarea value={m} onChange={v=>updMisi(i,v)} rows={2} />
          </ItemCard>
        ))}
      </Card>

      {/* ── Pillars (now has color field) ── */}
      <Card>
        <CardTitle action={<Btn onClick={addPillar} variant="primary" size="sm">+ Tambah</Btn>} sub="Pilar utama perusahaan (tiap item punya warna)">
          Empat Pilar
        </CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={pillars.chip} onChange={v=>onChange({...data,pillars:{...pillars,chip:v}})} /></Field>
          <Field label="Judul Section"><LocalizedInput value={pillars.title} onChange={v=>onChange({...data,pillars:{...pillars,title:v}})} /></Field>
          <Field label="Teks CTA"><LocalizedInput value={pillars.ctaLabel} onChange={v=>onChange({...data,pillars:{...pillars,ctaLabel:v}})} /></Field>
          <Field label="Link CTA"><LocalizedInput value={pillars.ctaHref} onChange={v=>onChange({...data,pillars:{...pillars,ctaHref:v}})} /></Field>
        </Grid2>
        {(pillars.items||[]).map((item,i) => (
          <ItemCard key={i} label={bt(item.title)} accent={item.color} onRemove={()=>removePillar(i)}>
            <Grid2>
              <Field label="Judul"><LocalizedInput value={item.title} onChange={v=>updPillar(i,'title',v)} /></Field>
              <Field label="Icon (lucide name)"><LocalizedInput value={item.icon} onChange={v=>updPillar(i,'icon',v)} placeholder="Leaf" /></Field>
            </Grid2>
            <ColorField label="Warna Aksen" value={item.color} onChange={v=>updPillar(i,'color',v)} />
            <Field label="Deskripsi"><LocalizedTextarea value={item.desc} onChange={v=>updPillar(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Timeline ── */}
      <Card>
        <CardTitle action={<Btn onClick={addMilestone} variant="primary" size="sm">+ Tambah</Btn>} sub="Sejarah & pencapaian perusahaan">
          Timeline / Milestones
        </CardTitle>
        {(timeline.milestones||[]).map((m,i) => (
          <ItemCard key={i} label={m.year} onRemove={()=>removeMilestone(i)}>
            <Grid2>
              <Field label="Tahun"><LocalizedInput value={m.year} onChange={v=>updMilestone(i,'year',v)} /></Field>
            </Grid2>
            <Field label="Keterangan"><LocalizedTextarea value={m.event} onChange={v=>updMilestone(i,'event',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── CTA ── */}
      <Card>
        <CardTitle>Bagian CTA Bawah</CardTitle>
        <Field label="Judul"><LocalizedInput value={cta.title} onChange={v=>onChange({...data,cta:{...cta,title:v}})} /></Field>
        <Field label="Deskripsi"><LocalizedTextarea value={cta.desc} onChange={v=>onChange({...data,cta:{...cta,desc:v}})} rows={2} /></Field>
      </Card>
    </div>
  )
}

// ─── BRANDS EDITOR ────────────────────────────────────────────────────────────
export function BrandsEditor({ data, onChange }) {
  const { header = {}, brands = [], platformNote = {} } = data ?? {}
  const updH = (k,v) => onChange({ ...data, header: { ...header, [k]: v } })
  const updB = (i,k,v) => { const n=clone(brands); n[i][k]=v; onChange({...data,brands:n}) }
  const updCta = (i,k,v) => { const n=clone(brands); n[i].cta={...n[i].cta,[k]:v}; onChange({...data,brands:n}) }
  const addBrand = () => onChange({ ...data, brands: [...brands, { id: Date.now(), name: { id: 'Brand Baru', en: 'New Brand' }, category: { id: 'Kategori', en: 'Category' }, desc: { id: '', en: '' }, logoText: 'BRAND', logoBg: '#f0f0f0', logoTextColor: '#333', accent: '#1BA882', cta: { label: { id: 'Lihat Produk', en: 'View Products' }, icon: 'ShoppingBag', href: '#products' } }] })
  const removeBrand = i => onChange({ ...data, brands: brands.filter((_,idx)=>idx!==i) })

  return (
    <div>
      <Card>
        <CardTitle sub="Teks header section brand">Header Section</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={header.title} onChange={v=>updH('title',v)} /></Field>
          <Field label="Subtitle (sebelum bold)"><LocalizedInput value={header.subtitle} onChange={v=>updH('subtitle',v)} /></Field>
          <Field label="Subtitle Bold"><LocalizedInput value={header.subtitleBold} onChange={v=>updH('subtitleBold',v)} /></Field>
        </Grid2>
        <Field label="Subtitle Akhir"><LocalizedInput value={header.subtitleEnd} onChange={v=>updH('subtitleEnd',v)} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addBrand} variant="primary" size="sm">+ Tambah Brand</Btn>} sub={`${brands.length} brand aktif`}>
          Daftar Brand
        </CardTitle>
        {brands.map((b,i) => (
          <ItemCard key={b.id||i} label={bt(b.name)} accent={b.accent} onRemove={()=>removeBrand(i)}>
            <Grid2>
              <Field label="Nama Brand"><LocalizedInput value={b.name} onChange={v=>updB(i,'name',v)} /></Field>
              <Field label="Kategori"><LocalizedInput value={b.category} onChange={v=>updB(i,'category',v)} /></Field>
              <Field label="Logo Text"><LocalizedInput value={b.logoText} onChange={v=>updB(i,'logoText',v)} /></Field>
            </Grid2>
            <Grid2>
              <ColorField label="Accent Color" value={b.accent} onChange={v=>updB(i,'accent',v)} />
              <ColorField label="Logo Background" value={b.logoBg} onChange={v=>updB(i,'logoBg',v)} />
            </Grid2>
            <Field label="Logo Text Color"><LocalizedInput value={b.logoTextColor} onChange={v=>updB(i,'logoTextColor',v)} /></Field>
            <Field label="Deskripsi"><LocalizedTextarea value={b.desc} onChange={v=>updB(i,'desc',v)} rows={3} /></Field>
            <Divider />
            <Grid2>
              <Field label="Teks Tombol CTA"><LocalizedInput value={b.cta?.label} onChange={v=>updCta(i,'label',v)} /></Field>
              <Field label="Link CTA"><LocalizedInput value={b.cta?.href} onChange={v=>updCta(i,'href',v)} /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle>Platform Note</CardTitle>
        <Grid2>
          <Field label="Teks"><LocalizedInput value={platformNote.text} onChange={v=>onChange({...data,platformNote:{...platformNote,text:v}})} /></Field>
          <Field label="Nama Brand"><LocalizedInput value={platformNote.brand} onChange={v=>onChange({...data,platformNote:{...platformNote,brand:v}})} /></Field>
          <Field label="Label CTA"><LocalizedInput value={platformNote.ctaLabel} onChange={v=>onChange({...data,platformNote:{...platformNote,ctaLabel:v}})} /></Field>
          <Field label="Link CTA"><LocalizedInput value={platformNote.ctaHref} onChange={v=>onChange({...data,platformNote:{...platformNote,ctaHref:v}})} /></Field>
        </Grid2>
      </Card>
    </div>
  )
}

// ─── PRODUCTS EDITOR ──────────────────────────────────────────────────────────
export function ProductsEditor({ data, onChange }) {
  const { header = {}, brands = [], categories = [], waNumber = '', contactEmail = '' } = data ?? {}
  const updH = (k,v) => onChange({ ...data, header: { ...header, [k]: v } })
  const updP = (i,k,v) => { const n=clone(brands); n[i][k]=v; onChange({...data,brands:n}) }

  // ── Kategori: tambah / hapus / edit ──
  // Entry "Semua/All" (key === 'all') dilindungi — key-nya tidak boleh diubah/dihapus
  // karena dipakai filter "tampilkan semua" di halaman publik.
  const slugify = (s) => (s||'').toLowerCase().trim()
    .replace(/&/g,'').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')
  const updCategory = (ci,field,v) => {
    const n = clone(categories)
    if (field === 'label.id') n[ci].label.id = v
    else if (field === 'label.en') n[ci].label.en = v
    else if (field === 'key') n[ci].key = slugify(v)
    onChange({ ...data, categories: n })
  }
  const addCategory = () => onChange({ ...data, categories: [...categories, { key: '', label: { id: 'Kategori Baru', en: 'New Category' } }] })
  const removeCategory = (ci) => onChange({ ...data, categories: categories.filter((_,idx)=>idx!==ci) })

  // ── Stats: tambah / hapus / edit ──
  const updStat = (pi,si,k,v) => { const n=clone(brands); n[pi].stats[si][k]=v; onChange({...data,brands:n}) }
  const addStat = (pi) => { const n=clone(brands); n[pi].stats=[...(n[pi].stats||[]), {v:'0+',l:{id:'Stat',en:'Stat'}}]; onChange({...data,brands:n}) }
  const removeStat = (pi,si) => { const n=clone(brands); n[pi].stats=(n[pi].stats||[]).filter((_,idx)=>idx!==si); onChange({...data,brands:n}) }

  // ── Foto: tambah / hapus / edit (mendukung lebih dari 1 foto per produk) ──
  const getImages = (p) => (p.images && p.images.length) ? p.images : (p.img ? [p.img] : [])
  const updImage = (pi,ii,v) => {
    const n = clone(brands)
    const imgs = getImages(n[pi]); imgs[ii] = v
    n[pi].images = imgs; n[pi].img = imgs[0] || ''
    onChange({ ...data, brands: n })
  }
  const addImage = (pi) => {
    const n = clone(brands)
    n[pi].images = [...getImages(n[pi]), '']
    onChange({ ...data, brands: n })
  }
  const removeImage = (pi,ii) => {
    const n = clone(brands)
    const imgs = getImages(n[pi]).filter((_,idx)=>idx!==ii)
    n[pi].images = imgs; n[pi].img = imgs[0] || ''
    onChange({ ...data, brands: n })
  }

  // ── Pilih kategori produk lewat dropdown — sinkron category (label) + categoryKey sekaligus ──
  const assignableCategories = categories.filter(c => c.key !== 'all')
  const setProductCategory = (pi, key) => {
    const n = clone(brands)
    const found = categories.find(c => c.key === key)
    n[pi].categoryKey = key
    if (found) n[pi].category = clone(found.label)
    onChange({ ...data, brands: n })
  }

  // ── Urutan: naik / turun (urutan ini menentukan urutan tampil di grid publik) ──
  const moveProduct = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= brands.length) return
    const n = clone(brands)
    ;[n[i], n[j]] = [n[j], n[i]]
    onChange({ ...data, brands: n })
  }

  const addProduct = () => onChange({ ...data, brands: [...brands, { id: Date.now(), name: { id: 'Produk Baru', en: 'New Product' }, category: assignableCategories[0]?.label ? clone(assignableCategories[0].label) : { id: 'Kategori', en: 'Category' }, categoryKey: assignableCategories[0]?.key || '', tagline: { id: '', en: '' }, desc: { id: '', en: '' }, featured: false, color: '#1BA882', initials: 'P', img: '', images: [''], website: '', stats: [{v:'0+',l:{ id: 'Stat', en: 'Stat' }}] }] })
  const removeProduct = i => onChange({ ...data, brands: brands.filter((_,idx)=>idx!==i) })

  return (
    <div>
      {/* ── Kontak Global ── */}
      <Card>
        <CardTitle sub="Nomor WA & email untuk tombol di setiap produk">Kontak Global Produk</CardTitle>
        <Grid2>
          <Field label="Nomor WhatsApp" hint="Format: 62812xxxxxx"><LocalizedInput value={waNumber} onChange={v=>onChange({...data,waNumber:v})} placeholder="628xxxxxxxxx" /></Field>
          <Field label="Email Kontak"><LocalizedInput value={contactEmail} onChange={v=>onChange({...data,contactEmail:v})} placeholder="hello@ptboba.id" /></Field>
        </Grid2>
      </Card>

      {/* ── Header ── */}
      <Card>
        <CardTitle>Header Section Produk</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul Awal"><LocalizedInput value={header.title} onChange={v=>updH('title',v)} /></Field>
          <Field label="Judul Highlight (hijau)"><LocalizedInput value={header.titleHighlight} onChange={v=>updH('titleHighlight',v)} /></Field>
          <Field label="Judul Akhir"><LocalizedInput value={header.titleEnd} onChange={v=>updH('titleEnd',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><LocalizedTextarea value={header.desc} onChange={v=>updH('desc',v)} rows={3} /></Field>
      </Card>

      {/* ── Kelola Kategori ── */}
      <Card>
        <CardTitle sticky action={<Btn onClick={addCategory} variant="primary" size="sm">+ Tambah Kategori</Btn>}
          sub="Kategori ini muncul sebagai filter di halaman produk & pilihan dropdown di tiap produk di bawah">
          Kelola Kategori
        </CardTitle>
        {categories.map((c,ci) => (
          <ItemCard key={ci} label={c.key === 'all' ? 'Filter "Semua" (terkunci)' : `Kategori ${ci}`} accent="#1BA882"
            onRemove={c.key === 'all' ? undefined : ()=>removeCategory(ci)}>
            <Grid2>
              <Field label="Nama (Indonesia)"><Input value={c.label?.id||''} onChange={v=>updCategory(ci,'label.id',v)} /></Field>
              <Field label="Nama (English)"><Input value={c.label?.en||''} onChange={v=>updCategory(ci,'label.en',v)} /></Field>
            </Grid2>
            {c.key === 'all' ? (
              <p style={{fontSize:12,color:'#9ca3af'}}>Slug: <code>all</code> — tidak bisa diubah, dipakai sistem untuk tombol "tampilkan semua".</p>
            ) : (
              <Field label="Slug" hint="huruf kecil tanpa spasi, contoh: coffee-spice — dipakai sistem untuk mencocokkan produk, tidak tampil ke pengunjung">
                <Input value={c.key} onChange={v=>updCategory(ci,'key',v)} placeholder="coffee-spice" style={{fontFamily:'monospace'}} />
              </Field>
            )}
          </ItemCard>
        ))}
      </Card>

      {/* ── Produk ── */}
      <Card>
        <CardTitle sticky action={<Btn onClick={addProduct} variant="primary" size="sm">+ Tambah Produk</Btn>} sub={`${brands.length} produk — urutan di sini = urutan tampil di website`}>
          Daftar Produk
        </CardTitle>
        {brands.map((p,i) => (
          <CollapsibleItemCard key={p.id||i}
            label={`${i+1}. ${bt(p.name)} — ${bt(p.category)}`}
            accent={p.color}
            onRemove={()=>removeProduct(i)}
            onMoveUp={()=>moveProduct(i,-1)} canMoveUp={i>0}
            onMoveDown={()=>moveProduct(i,1)} canMoveDown={i<brands.length-1}>
            <Grid2>
              <Field label="Nama"><LocalizedInput value={p.name} onChange={v=>updP(i,'name',v)} /></Field>
              <Field label="Kategori" hint="Atur daftar kategori di card 'Kelola Kategori' di atas">
                <Select value={p.categoryKey || ''} onChange={v=>setProductCategory(i,v)}>
                  <option value="" disabled>— Pilih kategori —</option>
                  {assignableCategories.map(c => (
                    <option key={c.key} value={c.key}>{bt(c.label)}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Tagline"><LocalizedInput value={p.tagline} onChange={v=>updP(i,'tagline',v)} /></Field>
              <Field label="Inisial (2-3 huruf)"><LocalizedInput value={p.initials} onChange={v=>updP(i,'initials',v)} /></Field>
            </Grid2>
            <Grid2>
              <ColorField label="Warna Accent" value={p.color} onChange={v=>updP(i,'color',v)} />
              <Field label="Featured">
                <Select value={p.featured?'true':'false'} onChange={v=>updP(i,'featured',v==='true')}>
                  <option value="false">Tidak</option>
                  <option value="true">Ya — Featured</option>
                </Select>
              </Field>
            </Grid2>
            <Field label="Deskripsi"><LocalizedTextarea value={p.desc} onChange={v=>updP(i,'desc',v)} rows={2} /></Field>
            <Field label="Website Produk" hint="URL website brand (opsional)"><LocalizedInput value={p.website||''} onChange={v=>updP(i,'website',v)} placeholder="https://tsoecha.co" /></Field>

            <Divider />

            {/* ── Foto (bisa lebih dari satu — jadi galeri saat card diklik) ── */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>
                Foto Produk {getImages(p).length > 1 && `(${getImages(p).length} foto — jadi galeri)`}
              </label>
              <Btn onClick={()=>addImage(i)} variant="outline" size="xs">+ Tambah Slot Foto</Btn>
            </div>
            {getImages(p).length === 0 && (
              <p style={{fontSize:12,color:'#9ca3af',marginBottom:10}}>Belum ada foto. Klik "+ Tambah Slot Foto", lalu upload atau paste URL.</p>
            )}
            {getImages(p).map((img, ii) => (
              <div key={ii} style={{display:'flex',gap:8,marginBottom:10,alignItems:'flex-start'}}>
                <Badge color="#9ca3af" style={{flexShrink:0,marginTop:9}}>{ii+1}</Badge>
                <div style={{flex:1}}>
                  <ImageUploadField value={img} onChange={v=>updImage(i,ii,v)} />
                </div>
                <Btn onClick={()=>removeImage(i,ii)} variant="danger" size="xs" style={{flexShrink:0,marginTop:2}}>×</Btn>
              </div>
            ))}

            <Divider />

            {/* ── Stats (bisa lebih dari 2 — yang tampil di card hanya 2 pertama) ── */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>Stats</label>
              <Btn onClick={()=>addStat(i)} variant="outline" size="xs">+ Tambah Stat</Btn>
            </div>
            {(p.stats||[]).map((st,si) => (
              <div key={si} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:8,marginBottom:6,alignItems:'start'}}>
                <LocalizedInput value={st.v} onChange={v=>updStat(i,si,'v',v)} placeholder="Nilai" />
                <LocalizedInput value={st.l} onChange={v=>updStat(i,si,'l',v)} placeholder="Label" />
                <Btn onClick={()=>removeStat(i,si)} variant="danger" size="xs">×</Btn>
              </div>
            ))}
          </CollapsibleItemCard>
        ))}
      </Card>
    </div>
  )
}

// ─── SERVICES EDITOR ──────────────────────────────────────────────────────────
const NEW_SVC = () => ({ id: Date.now(), icon: 'Leaf', title: { id: 'Layanan Baru', en: 'New Service' }, tag: { id: 'Tag', en: 'Tag' }, desc: { id: 'Deskripsi.', en: 'Description.' }, price: 'Rp 0', unit: { id: '/ bulan', en: '/ month' }, cta: { id: 'Pesan Layanan', en: 'Order Service' }, ctaHref: '#contact' })
const NEW_GROUP = () => ({ id: `grp_${Date.now()}`, chip: 'Subholding Baru', label: { id: 'Deskripsi grup', en: 'Group description' }, accentColor: '#1BA882', services: [NEW_SVC()] })

function ServiceItem({ svc, accent, onUpdate, onRemove }) {
  const u = (k,v) => onUpdate({ ...svc, [k]: v })
  return (
    <ItemCard label={bt(svc.tag)||'Layanan'} accent={accent} onRemove={onRemove}>
      <Grid2>
        <Field label="Judul"><LocalizedInput value={svc.title} onChange={v=>u('title',v)} /></Field>
        <Field label="Tag"><LocalizedInput value={svc.tag} onChange={v=>u('tag',v)} /></Field>
        <Field label="Harga"><LocalizedInput value={svc.price} onChange={v=>u('price',v)} placeholder="Rp 0" /></Field>
        <Field label="Satuan"><LocalizedInput value={svc.unit} onChange={v=>u('unit',v)} placeholder="/ bulan" /></Field>
        <Field label="Teks Tombol"><LocalizedInput value={svc.cta} onChange={v=>u('cta',v)} /></Field>
        <Field label="Link Tombol"><LocalizedInput value={svc.ctaHref} onChange={v=>u('ctaHref',v)} /></Field>
      </Grid2>
      <Field label="Deskripsi"><LocalizedTextarea value={svc.desc} onChange={v=>u('desc',v)} rows={2} /></Field>
    </ItemCard>
  )
}

export function ServicesEditor({ data, onChange }) {
  const { header = {}, footer: fd = {} } = data ?? {}
  const isGrouped = Array.isArray(data?.groups)
  const groups = data?.groups || []
  const services = data?.services || []

  const updH = (k,v) => onChange({ ...data, header: { ...header, [k]: v } })
  const updFoot = (k,v) => onChange({ ...data, footer: { ...fd, [k]: v } })

  // grouped
  const updGrp = (gi,k,v) => { const n=clone(groups); n[gi][k]=v; onChange({...data,groups:n}) }
  const updGrpSvc = (gi,si,upd) => { const n=clone(groups); n[gi].services[si]=upd; onChange({...data,groups:n}) }
  const addGrpSvc = gi => { const n=clone(groups); n[gi].services=[...(n[gi].services||[]),NEW_SVC()]; onChange({...data,groups:n}) }
  const rmGrpSvc = (gi,si) => { const n=clone(groups); n[gi].services=n[gi].services.filter((_,idx)=>idx!==si); onChange({...data,groups:n}) }
  const addGroup = () => onChange({ ...data, groups: [...groups, NEW_GROUP()] })
  const rmGroup = gi => onChange({ ...data, groups: groups.filter((_,idx)=>idx!==gi) })

  // flat
  const updSvc = (i,upd) => { const n=clone(services); n[i]=upd; onChange({...data,services:n}) }
  const addSvc = () => onChange({ ...data, services: [...services, NEW_SVC()] })
  const rmSvc = i => onChange({ ...data, services: services.filter((_,idx)=>idx!==i) })

  return (
    <div>
      <Card>
        <CardTitle sub="Teks header section layanan">Header Section</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={header.title} onChange={v=>updH('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><LocalizedTextarea value={header.subtitle} onChange={v=>updH('subtitle',v)} rows={2} /></Field>
      </Card>

      {isGrouped ? (
        <>
          {groups.map((grp,gi) => (
            <Card key={grp.id||gi}>
              <CardTitle
                sub={`${(grp.services||[]).length} layanan`}
                action={
                  <div style={{display:'flex',gap:8}}>
                    <Btn onClick={()=>addGrpSvc(gi)} variant="primary" size="xs">+ Layanan</Btn>
                    <Btn onClick={()=>rmGroup(gi)} variant="danger" size="xs">Hapus Grup</Btn>
                  </div>
                }
              >
                <span style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{width:10,height:10,borderRadius:'50%',background:grp.accentColor||'#888',display:'inline-block'}}/>
                  {grp.chip}
                </span>
              </CardTitle>
              <Grid2>
                <Field label="Chip (nama subholding)"><LocalizedInput value={grp.chip} onChange={v=>updGrp(gi,'chip',v)} /></Field>
                <Field label="Label (deskripsi singkat)"><LocalizedInput value={grp.label} onChange={v=>updGrp(gi,'label',v)} /></Field>
              </Grid2>
              <ColorField label="Warna Aksen" value={grp.accentColor} onChange={v=>updGrp(gi,'accentColor',v)} />
              <Divider />
              {(grp.services||[]).map((svc,si) => (
                <ServiceItem key={svc.id||si} svc={svc} accent={grp.accentColor}
                  onUpdate={upd=>updGrpSvc(gi,si,upd)} onRemove={()=>rmGrpSvc(gi,si)} />
              ))}
            </Card>
          ))}
          <Btn onClick={addGroup} variant="ghost" style={{width:'100%',justifyContent:'center',padding:12,border:'2px dashed #e5e7eb',borderRadius:12,marginBottom:16}}>
            + Tambah Grup Layanan
          </Btn>
        </>
      ) : (
        <Card>
          <CardTitle action={<Btn onClick={addSvc} variant="primary" size="sm">+ Tambah Layanan</Btn>} sub="Format datar (lama)">Daftar Layanan</CardTitle>
          {services.map((s,i) => (
            <ServiceItem key={s.id||i} svc={s} onUpdate={upd=>updSvc(i,upd)} onRemove={()=>rmSvc(i)} />
          ))}
        </Card>
      )}

      <Card>
        <CardTitle sub="Catatan di bawah daftar layanan">Footer Section</CardTitle>
        <Field label="Catatan"><LocalizedTextarea value={fd.note} onChange={v=>updFoot('note',v)} rows={2} /></Field>
        <Grid2>
          <Field label="Teks Tombol CTA"><LocalizedInput value={fd.ctaLabel} onChange={v=>updFoot('ctaLabel',v)} /></Field>
          <Field label="Link CTA"><LocalizedInput value={fd.ctaHref} onChange={v=>updFoot('ctaHref',v)} /></Field>
        </Grid2>
      </Card>
    </div>
  )
}

// ─── STRUKTUR EDITOR ──────────────────────────────────────────────────────────
export function StrukturEditor({ data, onChange }) {
  const { founders = {}, ecosystem = {}, investment = {} } = data ?? {}
  const subholdings = ecosystem.subholdings || []
  const investCard = investment.card || {}

  const updF = (k,v) => onChange({ ...data, founders: { ...founders, [k]: v } })
  const updM = (i,k,v) => { const n=clone(founders.members||[]); n[i][k]=v; onChange({...data,founders:{...founders,members:n}}) }
  const addMember = () => onChange({ ...data, founders: { ...founders, members: [...(founders.members||[]), { name: 'Nama Baru', role: { id: 'Jabatan', en: 'Position' }, desc: { id: '', en: '' }, photo: '' }] } })
  const rmMember = i => onChange({ ...data, founders: { ...founders, members: (founders.members||[]).filter((_,idx)=>idx!==i) } })

  const updEco = (k,v) => onChange({ ...data, ecosystem: { ...ecosystem, [k]: v } })
  const updSub = (i,k,v) => { const n=clone(subholdings); n[i][k]=v; onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const updSubProd = (si,pi,v) => { const n=clone(subholdings); n[si].products[pi]=v; onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const addSubProd = si => { const n=clone(subholdings); n[si].products=[...(n[si].products||[]),'Produk baru']; onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const rmSubProd = (si,pi) => { const n=clone(subholdings); n[si].products=n[si].products.filter((_,idx)=>idx!==pi); onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const addSub = () => onChange({ ...data, ecosystem: { ...ecosystem, subholdings: [...subholdings, { id: Date.now(), icon: 'Building2', accentFrom: '#1BA882', accentTo: '#2DD4B0', name: 'Subholding Baru', label: { id: 'Label', en: 'Label' }, focus: { id: 'Fokus bisnis.', en: 'Business focus.' }, products: [] }] } })
  const rmSub = i => onChange({ ...data, ecosystem: { ...ecosystem, subholdings: subholdings.filter((_,idx)=>idx!==i) } })

  const updInv = (k,v) => onChange({ ...data, investment: { ...investment, [k]: v } })
  const updCard = (k,v) => onChange({ ...data, investment: { ...investment, card: { ...investCard, [k]: v } } })
  const updCardStat = (i,k,v) => { const n=clone(investCard.stats||[]); n[i][k]=v; onChange({...data,investment:{...investment,card:{...investCard,stats:n}}}) }
  const updPoint = (i,v) => { const n=clone(investment.points||[]); n[i]=v; onChange({...data,investment:{...investment,points:n}}) }
  const addPoint = () => onChange({ ...data, investment: { ...investment, points: [...(investment.points||[]), { id: 'Poin baru', en: 'New point' }] } })
  const rmPoint = i => onChange({ ...data, investment: { ...investment, points: (investment.points||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      {/* ── Founders ── */}
      <Card>
        <CardTitle sub="Header section struktur">Header</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={founders.chip} onChange={v=>updF('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={founders.title} onChange={v=>updF('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><LocalizedTextarea value={founders.subtitle} onChange={v=>updF('subtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addMember} variant="primary" size="sm">+ Tambah</Btn>} sub="Foto langsung upload ke Cloudinary (folder: ptboba/tim)">
          Pendiri & Pengurus
        </CardTitle>
        {(founders.members||[]).map((m,i) => (
          <ItemCard key={i} label={`${bt(m.name)} — ${bt(m.role)}`} accent="#1BA882" onRemove={()=>rmMember(i)}>
            <Grid2>
              <Field label="Nama Lengkap"><LocalizedInput value={m.name} onChange={v=>updM(i,'name',v)} /></Field>
              <Field label="Jabatan"><LocalizedInput value={m.role} onChange={v=>updM(i,'role',v)} /></Field>
            </Grid2>
            <Field label="Foto" hint="Klik 📤 untuk upload langsung ke Cloudinary, atau paste URL manual">
              <ImageUploadField value={m.photo||''} onChange={v=>updM(i,'photo',v)} folder="ptboba/tim" placeholder="https://res.cloudinary.com/... atau upload file" />
            </Field>
            <Field label="Deskripsi Peran"><LocalizedTextarea value={m.desc} onChange={v=>updM(i,'desc',v)} rows={3} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Ecosystem ── */}
      <Card>
        <CardTitle sub="Header bagian ekosistem bisnis">Ekosistem Bisnis — Header</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={ecosystem.chip} onChange={v=>updEco('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={ecosystem.title} onChange={v=>updEco('title',v)} /></Field>
          <Field label="Label Holding"><LocalizedInput value={ecosystem.holdingLabel} onChange={v=>updEco('holdingLabel',v)} /></Field>
          <Field label="Deskripsi Holding"><LocalizedInput value={ecosystem.holdingDesc} onChange={v=>updEco('holdingDesc',v)} /></Field>
          <Field label="Chip Subholdings"><LocalizedInput value={ecosystem.subholdingsChip} onChange={v=>updEco('subholdingsChip',v)} /></Field>
          <Field label="Judul Subholdings"><LocalizedInput value={ecosystem.subholdingsTitle} onChange={v=>updEco('subholdingsTitle',v)} /></Field>
        </Grid2>
        <Field label="Subtitle Subholdings"><LocalizedTextarea value={ecosystem.subholdingsSubtitle} onChange={v=>updEco('subholdingsSubtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addSub} variant="primary" size="sm">+ Tambah</Btn>} sub={`${subholdings.length} subholding`}>
          4 Subholding BOBA Group
        </CardTitle>
        {subholdings.map((sub,si) => (
          <ItemCard key={sub.id||si} label={sub.name} accent={sub.accentFrom} onRemove={()=>rmSub(si)}>
            <Grid2>
              <Field label="Nama"><LocalizedInput value={sub.name} onChange={v=>updSub(si,'name',v)} /></Field>
              <Field label="Label (kategori)"><LocalizedInput value={sub.label} onChange={v=>updSub(si,'label',v)} /></Field>
            </Grid2>
            <Grid2>
              <ColorField label="Warna Dari" value={sub.accentFrom} onChange={v=>updSub(si,'accentFrom',v)} />
              <ColorField label="Warna Ke" value={sub.accentTo} onChange={v=>updSub(si,'accentTo',v)} />
            </Grid2>
            <Field label="Fokus Bisnis"><LocalizedTextarea value={sub.focus} onChange={v=>updSub(si,'focus',v)} rows={2} /></Field>
            <Divider />
            <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:8}}>Produk / Program</label>
            {(sub.products||[]).map((prod,pi) => (
              <div key={pi} style={{display:'flex',gap:8,marginBottom:6}}>
                <LocalizedInput value={prod} onChange={v=>updSubProd(si,pi,v)} placeholder="Nama produk" />
                <Btn onClick={()=>rmSubProd(si,pi)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
            <Btn onClick={()=>addSubProd(si)} variant="ghost" size="xs">+ Tambah Produk</Btn>
          </ItemCard>
        ))}
      </Card>

      {/* ── Investment ── */}
      <Card>
        <CardTitle sub="Bagian peluang investasi">Peluang Investasi</CardTitle>
        <Grid2>
          <Field label="Badge"><LocalizedInput value={investment.badge} onChange={v=>updInv('badge',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={investment.title} onChange={v=>updInv('title',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><LocalizedTextarea value={investment.desc} onChange={v=>updInv('desc',v)} rows={3} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addPoint} variant="primary" size="xs">+ Tambah</Btn>}>Poin Investasi</CardTitle>
        {(investment.points||[]).map((p,i) => (
          <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
            <LocalizedInput value={p} onChange={v=>updPoint(i,v)} />
            <Btn onClick={()=>rmPoint(i)} variant="danger" size="xs">✕</Btn>
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Kartu CTA investor di sebelah kanan">Investment Card</CardTitle>
        <Grid2>
          <Field label="Judul Card"><LocalizedInput value={investCard.title} onChange={v=>updCard('title',v)} /></Field>
          <Field label="Deskripsi Card"><LocalizedInput value={investCard.desc} onChange={v=>updCard('desc',v)} /></Field>
          <Field label="Teks Tombol Utama"><LocalizedInput value={investCard.ctaLabel} onChange={v=>updCard('ctaLabel',v)} /></Field>
          <Field label="Link Tombol Utama"><LocalizedInput value={investCard.ctaHref} onChange={v=>updCard('ctaHref',v)} /></Field>
          <Field label="Teks Tombol Secondary"><LocalizedInput value={investCard.secondaryLabel} onChange={v=>updCard('secondaryLabel',v)} /></Field>
          <Field label="Link Tombol Secondary"><LocalizedInput value={investCard.secondaryHref} onChange={v=>updCard('secondaryHref',v)} /></Field>
        </Grid2>
        <Divider />
        <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:8}}>Stats Card (3 item)</label>
        {(investCard.stats||[]).map((s,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:6}}>
            <LocalizedInput value={s.v} onChange={v=>updCardStat(i,'v',v)} placeholder="Nilai" />
            <LocalizedInput value={s.l} onChange={v=>updCardStat(i,'l',v)} placeholder="Label" />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── PARTNERS EDITOR ──────────────────────────────────────────────────────────
export function PartnersEditor({ data, onChange }) {
  const { header = {}, categories = [], partners = [], benefits = {}, partnerTypes = {}, cta = {} } = data ?? {}
  const updH = (k,v) => onChange({ ...data, header: { ...header, [k]: v } })
  const updP = (i,k,v) => { const n=clone(partners); n[i][k]=v; onChange({...data,partners:n}) }
  const addPartner = () => onChange({ ...data, partners: [...partners, { id: Date.now(), cat: { id: 'Strategis', en: 'Strategic' }, initials: 'NEW', name: 'Mitra Baru', desc: { id: '', en: '' }, color: '#1BA882', textColor: '#fff' }] })
  const rmPartner = i => onChange({ ...data, partners: partners.filter((_,idx)=>idx!==i) })
  const updBenefit = (k,v) => onChange({ ...data, benefits: { ...benefits, [k]: v } })
  const updBenefitItem = (i,v) => { const n=clone(benefits.items||[]); n[i]=v; onChange({...data,benefits:{...benefits,items:n}}) }
  const addBenefitItem = () => onChange({ ...data, benefits: { ...benefits, items: [...(benefits.items||[]), { id: 'Keuntungan baru', en: 'New benefit' }] } })
  const rmBenefitItem = i => onChange({ ...data, benefits: { ...benefits, items: (benefits.items||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      <Card>
        <CardTitle>Header Section</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={header.title} onChange={v=>updH('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><LocalizedTextarea value={header.subtitle} onChange={v=>updH('subtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addPartner} variant="primary" size="sm">+ Tambah Mitra</Btn>} sub={`${partners.length} mitra aktif`}>
          Daftar Mitra
        </CardTitle>
        {partners.map((p,i) => (
          <ItemCard key={p.id||i} label={`[${bt(p.cat)}] ${bt(p.name)}`} accent={p.color} onRemove={()=>rmPartner(i)}>
            <Grid2>
              <Field label="Nama Mitra"><LocalizedInput value={p.name} onChange={v=>updP(i,'name',v)} /></Field>
              <Field label="Inisial (2-3 huruf)"><LocalizedInput value={p.initials} onChange={v=>updP(i,'initials',v)} /></Field>
              <Field label="Kategori">
                <Select value={p.cat} onChange={v=>updP(i,'cat',v)}>
                  {(categories.length ? categories : ['Strategis','Distribusi','Teknologi','Lingkungan']).filter(c=>c!=='Semua').map(c=><option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <ColorField label="Warna Background" value={p.color} onChange={v=>updP(i,'color',v)} />
            </Grid2>
            <Field label="Deskripsi"><LocalizedTextarea value={p.desc} onChange={v=>updP(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Bagian keuntungan bermitra">Manfaat Kemitraan</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={benefits.chip} onChange={v=>updBenefit('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={benefits.title} onChange={v=>updBenefit('title',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><LocalizedTextarea value={benefits.desc} onChange={v=>updBenefit('desc',v)} rows={2} /></Field>
        <Field label="URL Gambar"><LocalizedInput value={benefits.image} onChange={v=>updBenefit('image',v)} /></Field>
        <ImgPreview src={benefits.image} />
        <Divider />
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase'}}>Item Keuntungan</label>
          <Btn onClick={addBenefitItem} variant="primary" size="xs">+ Tambah</Btn>
        </div>
        {(benefits.items||[]).map((item,i) => (
          <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
            <LocalizedInput value={item} onChange={v=>updBenefitItem(i,v)} />
            <Btn onClick={()=>rmBenefitItem(i)} variant="danger" size="xs">✕</Btn>
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Bagian CTA bawah">CTA Section</CardTitle>
        <Field label="Judul"><LocalizedInput value={cta.title} onChange={v=>onChange({...data,cta:{...cta,title:v}})} /></Field>
        <Field label="Deskripsi"><LocalizedTextarea value={cta.desc} onChange={v=>onChange({...data,cta:{...cta,desc:v}})} rows={2} /></Field>
      </Card>
    </div>
  )
}

// ─── CONTACT EDITOR ───────────────────────────────────────────────────────────
export function ContactEditor({ data, onChange }) {
  const { header = {}, contactInfo = [], form: fd = {}, map = {}, quickContact = [], whatsapp = {}, faq = {} } = data ?? {}
  const updH = (k,v) => onChange({ ...data, header: { ...header, [k]: v } })
  const updInfo = (i,k,v) => { const n=clone(contactInfo); n[i][k]=v; onChange({...data,contactInfo:n}) }
  const updFd = (k,v) => onChange({ ...data, form: { ...fd, [k]: v } })
  const updWA = (k,v) => onChange({ ...data, whatsapp: { ...whatsapp, [k]: v } })
  const updQC = (i,k,v) => { const n=clone(quickContact); n[i][k]=v; onChange({...data,quickContact:n}) }
  const updFaqItem = (i,k,v) => { const n=clone(faq.items||[]); n[i][k]=v; onChange({...data,faq:{...faq,items:n}}) }
  const addFaq = () => onChange({ ...data, faq: { ...faq, items: [...(faq.items||[]), { q: { id: 'Pertanyaan baru?', en: 'New question?' }, a: { id: 'Jawaban.', en: 'Answer.' } }] } })
  const rmFaq = i => onChange({ ...data, faq: { ...faq, items: (faq.items||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      <Card>
        <CardTitle>Header Section</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={header.title} onChange={v=>updH('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><LocalizedTextarea value={header.subtitle} onChange={v=>updH('subtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle sub={`${contactInfo.length} item kontak`}>Informasi Kontak</CardTitle>
        {contactInfo.map((info,i) => (
          <ItemCard key={i} label={bt(info.label)||`Info ${i+1}`}>
            <Grid2>
              <Field label="Nilai Utama"><LocalizedInput value={info.value} onChange={v=>updInfo(i,'value',v)} /></Field>
              <Field label="Keterangan (sub)"><LocalizedInput value={info.sub} onChange={v=>updInfo(i,'sub',v)} /></Field>
              <Field label="Icon (lucide name)"><LocalizedInput value={info.icon} onChange={v=>updInfo(i,'icon',v)} placeholder="MapPin" /></Field>
              <Field label="Label"><LocalizedInput value={info.label} onChange={v=>updInfo(i,'label',v)} /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Tombol kontak cepat">Quick Contact</CardTitle>
        {quickContact.map((c,i) => (
          <ItemCard key={i} label={bt(c.label)}>
            <Grid2>
              <Field label="Label"><LocalizedInput value={c.label} onChange={v=>updQC(i,'label',v)} /></Field>
              <Field label="Nilai"><LocalizedInput value={c.value} onChange={v=>updQC(i,'value',v)} /></Field>
              <Field label="Link (href)"><LocalizedInput value={c.href} onChange={v=>updQC(i,'href',v)} /></Field>
              <Field label="Icon"><LocalizedInput value={c.icon} onChange={v=>updQC(i,'icon',v)} placeholder="Phone" /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle>WhatsApp</CardTitle>
        <Grid2>
          <Field label="Nomor" hint="Format: 62812xxxxxx"><LocalizedInput value={whatsapp.number} onChange={v=>updWA('number',v)} /></Field>
          <Field label="Label Tombol"><LocalizedInput value={whatsapp.label} onChange={v=>updWA('label',v)} /></Field>
        </Grid2>
      </Card>

      <Card>
        <CardTitle>Formulir Kontak</CardTitle>
        <Grid2>
          <Field label="Judul Form"><LocalizedInput value={fd.title} onChange={v=>updFd('title',v)} /></Field>
          <Field label="Subtitle Form"><LocalizedInput value={fd.subtitle} onChange={v=>updFd('subtitle',v)} /></Field>
          <Field label="Pesan Sukses — Judul"><LocalizedInput value={fd.successTitle} onChange={v=>updFd('successTitle',v)} /></Field>
        </Grid2>
        <Field label="Pesan Sukses — Deskripsi"><LocalizedTextarea value={fd.successDesc} onChange={v=>updFd('successDesc',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle>Embed Google Maps</CardTitle>
        <Field label="Judul Peta"><LocalizedInput value={map.title} onChange={v=>onChange({...data,map:{...map,title:v}})} /></Field>
        <Field label="URL Embed" hint="Dari Google Maps → Share → Embed a map → URL src">
          <LocalizedTextarea value={map.embedUrl} onChange={v=>onChange({...data,map:{...map,embedUrl:v}})} rows={3} />
        </Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addFaq} variant="primary" size="sm">+ Tambah FAQ</Btn>} sub={`${(faq.items||[]).length} pertanyaan`}>
          FAQ
        </CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={faq.chip} onChange={v=>onChange({...data,faq:{...faq,chip:v}})} /></Field>
          <Field label="Judul FAQ"><LocalizedInput value={faq.title} onChange={v=>onChange({...data,faq:{...faq,title:v}})} /></Field>
        </Grid2>
        {(faq.items||[]).map((item,i) => (
          <ItemCard key={i} label={`FAQ ${i+1}`} onRemove={()=>rmFaq(i)}>
            <Field label="Pertanyaan"><LocalizedInput value={item.q} onChange={v=>updFaqItem(i,'q',v)} /></Field>
            <Field label="Jawaban"><LocalizedTextarea value={item.a} onChange={v=>updFaqItem(i,'a',v)} rows={3} /></Field>
          </ItemCard>
        ))}
      </Card>
    </div>
  )
}

// ─── FOOTER EDITOR ────────────────────────────────────────────────────────────
export function FooterEditor({ data, onChange }) {
  const { brand = {}, socials = [], navGroups = [], newsletter = {}, bottomLinks = [], copyright = '' } = data ?? {}
  const updB = (k,v) => onChange({ ...data, brand: { ...brand, [k]: v } })
  const updSoc = (i,k,v) => { const n=clone(socials); n[i][k]=v; onChange({...data,socials:n}) }
  const addSoc = () => onChange({ ...data, socials: [...socials, { icon: 'Instagram', href: 'https://instagram.com/', label: 'Instagram' }] })
  const rmSoc = i => onChange({ ...data, socials: socials.filter((_,idx)=>idx!==i) })
  const updGroup = (gi,k,v) => { const n=clone(navGroups); n[gi][k]=v; onChange({...data,navGroups:n}) }
  const updLink = (gi,li,k,v) => { const n=clone(navGroups); n[gi].links[li][k]=v; onChange({...data,navGroups:n}) }
  const addLink = gi => { const n=clone(navGroups); n[gi].links=[...(n[gi].links||[]),{label:'Link Baru',href:'#'}]; onChange({...data,navGroups:n}) }
  const rmLink = (gi,li) => { const n=clone(navGroups); n[gi].links=n[gi].links.filter((_,idx)=>idx!==li); onChange({...data,navGroups:n}) }
  const addGroup = () => onChange({ ...data, navGroups: [...navGroups, { title: { id: 'Grup Baru', en: 'New Group' }, links: [] }] })
  const rmGroup = gi => onChange({ ...data, navGroups: navGroups.filter((_,idx)=>idx!==gi) })

  return (
    <div>
      <Card>
        <CardTitle>Brand Info Footer</CardTitle>
        <Field label="Tagline"><LocalizedTextarea value={brand.tagline} onChange={v=>updB('tagline',v)} rows={3} /></Field>
        <Field label="Alamat"><LocalizedInput value={brand.address} onChange={v=>updB('address',v)} /></Field>
        <Grid2>
          <Field label="Telepon"><LocalizedInput value={brand.phone} onChange={v=>updB('phone',v)} /></Field>
          <Field label="Email"><LocalizedInput value={brand.email} onChange={v=>updB('email',v)} /></Field>
        </Grid2>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addSoc} variant="primary" size="sm">+ Tambah</Btn>}>Social Media</CardTitle>
        {socials.map((s,i) => (
          <ItemCard key={i} label={s.label} onRemove={()=>rmSoc(i)}>
            <Grid2>
              <Field label="Platform"><LocalizedInput value={s.label} onChange={v=>updSoc(i,'label',v)} /></Field>
              <Field label="Icon (lucide)"><LocalizedInput value={s.icon} onChange={v=>updSoc(i,'icon',v)} placeholder="Instagram" /></Field>
            </Grid2>
            <Field label="URL"><LocalizedInput value={s.href} onChange={v=>updSoc(i,'href',v)} placeholder="https://..." /></Field>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addGroup} variant="primary" size="sm">+ Tambah Grup</Btn>} sub={`${navGroups.length} grup navigasi`}>
          Navigasi Footer
        </CardTitle>
        {navGroups.map((grp,gi) => (
          <ItemCard key={gi} label={bt(grp.title)} onRemove={()=>rmGroup(gi)}
            action={<Btn onClick={()=>addLink(gi)} variant="primary" size="xs">+ Link</Btn>}>
            <Field label="Judul Grup"><LocalizedInput value={grp.title} onChange={v=>updGroup(gi,'title',v)} /></Field>
            <Divider />
            {(grp.links||[]).map((link,li) => (
              <div key={li} style={{display:'flex',gap:8,marginBottom:6,alignItems:'flex-end'}}>
                <div style={{flex:1}}><LocalizedInput value={link.label} onChange={v=>updLink(gi,li,'label',v)} placeholder="Label" /></div>
                <div style={{flex:1}}><LocalizedInput value={link.href} onChange={v=>updLink(gi,li,'href',v)} placeholder="#href" /></div>
                <Btn onClick={()=>rmLink(gi,li)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle>Newsletter & Copyright</CardTitle>
        <Grid2>
          <Field label="Judul Newsletter"><LocalizedInput value={newsletter.title} onChange={v=>onChange({...data,newsletter:{...newsletter,title:v}})} /></Field>
          <Field label="Teks Tombol"><LocalizedInput value={newsletter.ctaLabel} onChange={v=>onChange({...data,newsletter:{...newsletter,ctaLabel:v}})} /></Field>
        </Grid2>
        <Field label="Subtitle Newsletter"><LocalizedInput value={newsletter.subtitle} onChange={v=>onChange({...data,newsletter:{...newsletter,subtitle:v}})} /></Field>
        <Field label="Copyright"><LocalizedInput value={copyright} onChange={v=>onChange({...data,copyright:v})} /></Field>
      </Card>
    </div>
  )
}

// ─── INVESTOR EDITOR ──────────────────────────────────────────────────────────
export function InvestorEditor({ data, onChange }) {
  const { hero = {}, whyBoba = {}, metrics = {}, roadmap = {}, documents = {}, form: fd = {} } = data ?? {}

  const updHero = (k,v) => onChange({ ...data, hero: { ...hero, [k]: v } })
  const updCtaPri = (k,v) => onChange({ ...data, hero: { ...hero, ctaPrimary: { ...hero.ctaPrimary, [k]: v } } })
  const updCtaSec = (k,v) => onChange({ ...data, hero: { ...hero, ctaSecondary: { ...hero.ctaSecondary, [k]: v } } })
  const updStat = (i,k,v) => { const n=clone(hero.floatingStats||[]); n[i][k]=v; onChange({...data,hero:{...hero,floatingStats:n}}) }

  const updWhy = (k,v) => onChange({ ...data, whyBoba: { ...whyBoba, [k]: v } })
  const updWhyItem = (i,k,v) => { const n=clone(whyBoba.items||[]); n[i][k]=v; onChange({...data,whyBoba:{...whyBoba,items:n}}) }
  const addWhyItem = () => onChange({ ...data, whyBoba: { ...whyBoba, items: [...(whyBoba.items||[]), { icon: 'TrendingUp', title: { id: 'Poin Baru', en: 'New Point' }, desc: { id: '', en: '' } }] } })
  const rmWhyItem = i => onChange({ ...data, whyBoba: { ...whyBoba, items: (whyBoba.items||[]).filter((_,idx)=>idx!==i) } })

  const updMetric = (i,k,v) => { const n=clone(metrics.items||[]); n[i][k]= k==='value'?(parseInt(v)||0):v; onChange({...data,metrics:{...metrics,items:n}}) }
  const updRoad = (i,k,v) => { const n=clone(roadmap.items||[]); n[i][k]= (k==='active'||k==='upcoming')?(v==='true'):v; onChange({...data,roadmap:{...roadmap,items:n}}) }
  const addRoad = () => onChange({ ...data, roadmap: { ...roadmap, items: [...(roadmap.items||[]), { year: '2026', month: { id: 'Q1', en: 'Q1' }, title: { id: 'Milestone Baru', en: 'New Milestone' }, desc: { id: '', en: '' }, active: false, upcoming: true }] } })
  const rmRoad = i => onChange({ ...data, roadmap: { ...roadmap, items: (roadmap.items||[]).filter((_,idx)=>idx!==i) } })

  const updDoc = (i,k,v) => { const n=clone(documents.items||[]); n[i][k]=v; onChange({...data,documents:{...documents,items:n}}) }
  const addDoc = () => onChange({ ...data, documents: { ...documents, items: [...(documents.items||[]), { icon: 'FileText', tag: 'Dokumen', tagColor: '#1BA882', title: { id: 'Dokumen Baru', en: 'New Document' }, desc: { id: '', en: '' }, status: 'Tersedia' }] } })
  const rmDoc = i => onChange({ ...data, documents: { ...documents, items: (documents.items||[]).filter((_,idx)=>idx!==i) } })

  const updFd = (k,v) => onChange({ ...data, form: { ...fd, [k]: v } })
  const updOpt = (key,i,v) => { const n=clone(fd[key]||[]); n[i]=v; onChange({...data,form:{...fd,[key]:n}}) }
  const addOpt = key => onChange({ ...data, form: { ...fd, [key]: [...(fd[key]||[]), 'Opsi baru'] } })
  const rmOpt = (key,i) => onChange({ ...data, form: { ...fd, [key]: (fd[key]||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      {/* ── Hero ── */}
      <Card>
        <CardTitle sub="Bagian atas halaman Investor Relations">Hero Section</CardTitle>
        <Grid2>
          <Field label="Badge"><LocalizedInput value={hero.badge} onChange={v=>updHero('badge',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={hero.title} onChange={v=>updHero('title',v)} /></Field>
          <Field label="Judul Highlight (hijau)"><LocalizedInput value={hero.titleHighlight} onChange={v=>updHero('titleHighlight',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><LocalizedTextarea value={hero.desc} onChange={v=>updHero('desc',v)} rows={3} /></Field>
        <Field label="URL Foto Hero"><LocalizedInput value={hero.image} onChange={v=>updHero('image',v)} /></Field>
        <ImgPreview src={hero.image} />
        <Grid2>
          <Field label="Teks CTA Utama"><LocalizedInput value={hero.ctaPrimary?.label} onChange={v=>updCtaPri('label',v)} /></Field>
          <Field label="Link CTA Utama"><LocalizedInput value={hero.ctaPrimary?.href} onChange={v=>updCtaPri('href',v)} /></Field>
          <Field label="Teks CTA Secondary"><LocalizedInput value={hero.ctaSecondary?.label} onChange={v=>updCtaSec('label',v)} /></Field>
          <Field label="Link CTA Secondary"><LocalizedInput value={hero.ctaSecondary?.href} onChange={v=>updCtaSec('href',v)} /></Field>
        </Grid2>
        <Divider />
        <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:8}}>Floating Stats (4 item)</label>
        {(hero.floatingStats||[]).map((s,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:6}}>
            <LocalizedInput value={s.value} onChange={v=>updStat(i,'value',v)} placeholder="Nilai" />
            <LocalizedInput value={s.label} onChange={v=>updStat(i,'label',v)} placeholder="Label" />
            <LocalizedInput value={s.sub} onChange={v=>updStat(i,'sub',v)} placeholder="Sub-label" />
          </div>
        ))}
      </Card>

      {/* ── Why BOBA ── */}
      <Card>
        <CardTitle action={<Btn onClick={addWhyItem} variant="primary" size="sm">+ Tambah</Btn>} sub="Alasan berinvestasi di PT BOBA">
          Why BOBA
        </CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={whyBoba.chip} onChange={v=>updWhy('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={whyBoba.title} onChange={v=>updWhy('title',v)} /></Field>
        </Grid2>
        {(whyBoba.items||[]).map((item,i) => (
          <ItemCard key={i} label={bt(item.title)} onRemove={()=>rmWhyItem(i)}>
            <Grid2>
              <Field label="Judul"><LocalizedInput value={item.title} onChange={v=>updWhyItem(i,'title',v)} /></Field>
              <Field label="Icon (lucide)"><LocalizedInput value={item.icon} onChange={v=>updWhyItem(i,'icon',v)} placeholder="TrendingUp" /></Field>
            </Grid2>
            <Field label="Deskripsi"><LocalizedTextarea value={item.desc} onChange={v=>updWhyItem(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Metrics ── */}
      <Card>
        <CardTitle sub="Angka-angka kunci perusahaan">Metrics / KPI</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={metrics.chip} onChange={v=>onChange({...data,metrics:{...metrics,chip:v}})} /></Field>
          <Field label="Judul"><LocalizedInput value={metrics.title} onChange={v=>onChange({...data,metrics:{...metrics,title:v}})} /></Field>
        </Grid2>
        {(metrics.items||[]).map((item,i) => (
          <ItemCard key={i} label={bt(item.label)}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 60px',gap:8,marginBottom:6}}>
              <LocalizedInput value={item.label} onChange={v=>updMetric(i,'label',v)} placeholder="Label" />
              <LocalizedInput value={item.value} onChange={v=>updMetric(i,'value',v)} type="number" placeholder="Nilai" />
              <LocalizedInput value={item.suffix} onChange={v=>updMetric(i,'suffix',v)} placeholder="+" />
            </div>
            <LocalizedInput value={item.sub} onChange={v=>updMetric(i,'sub',v)} placeholder="Sub-label kecil" />
          </ItemCard>
        ))}
      </Card>

      {/* ── Roadmap ── */}
      <Card>
        <CardTitle action={<Btn onClick={addRoad} variant="primary" size="sm">+ Tambah</Btn>} sub="Timeline milestone perusahaan">
          Roadmap
        </CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={roadmap.chip} onChange={v=>onChange({...data,roadmap:{...roadmap,chip:v}})} /></Field>
          <Field label="Judul"><LocalizedInput value={roadmap.title} onChange={v=>onChange({...data,roadmap:{...roadmap,title:v}})} /></Field>
        </Grid2>
        {(roadmap.items||[]).map((item,i) => (
          <ItemCard key={i} label={`${item.year} ${bt(item.month)} — ${bt(item.title)}`} onRemove={()=>rmRoad(i)}>
            <Grid2>
              <Field label="Judul"><LocalizedInput value={item.title} onChange={v=>updRoad(i,'title',v)} /></Field>
              <Field label="Tahun"><LocalizedInput value={item.year} onChange={v=>updRoad(i,'year',v)} /></Field>
              <Field label="Bulan/Kuartal"><LocalizedInput value={item.month} onChange={v=>updRoad(i,'month',v)} placeholder="Q1 2026" /></Field>
              <Field label="Status">
                <Select value={item.active?'active':item.upcoming?'upcoming':'done'} onChange={v=>{ updRoad(i,'active',String(v==='active')); updRoad(i,'upcoming',String(v==='upcoming')) }}>
                  <option value="done">Selesai</option>
                  <option value="active">Aktif</option>
                  <option value="upcoming">Akan Datang</option>
                </Select>
              </Field>
            </Grid2>
            <Field label="Deskripsi"><LocalizedTextarea value={item.desc} onChange={v=>updRoad(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Documents ── */}
      <Card>
        <CardTitle action={<Btn onClick={addDoc} variant="primary" size="sm">+ Tambah</Btn>} sub="Dokumen yang tersedia untuk investor">
          Dokumen Investor
        </CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={documents.chip} onChange={v=>onChange({...data,documents:{...documents,chip:v}})} /></Field>
          <Field label="Judul"><LocalizedInput value={documents.title} onChange={v=>onChange({...data,documents:{...documents,title:v}})} /></Field>
        </Grid2>
        {(documents.items||[]).map((doc,i) => (
          <ItemCard key={i} label={bt(doc.title)} onRemove={()=>rmDoc(i)}>
            <Grid2>
              <Field label="Judul Dokumen"><LocalizedInput value={doc.title} onChange={v=>updDoc(i,'title',v)} /></Field>
              <Field label="Tag"><LocalizedInput value={doc.tag} onChange={v=>updDoc(i,'tag',v)} /></Field>
              <Field label="Status"><LocalizedInput value={doc.status} onChange={v=>updDoc(i,'status',v)} placeholder="Tersedia" /></Field>
              <Field label="Warna Tag"><LocalizedInput value={doc.tagColor} onChange={v=>updDoc(i,'tagColor',v)} placeholder="#1BA882" /></Field>
            </Grid2>
            <Field label="Deskripsi"><LocalizedTextarea value={doc.desc} onChange={v=>updDoc(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Form ── */}
      <Card>
        <CardTitle sub="Formulir ketertarikan investor">Form Investor</CardTitle>
        <Grid2>
          <Field label="Chip"><LocalizedInput value={fd.chip} onChange={v=>updFd('chip',v)} /></Field>
          <Field label="Judul"><LocalizedInput value={fd.title} onChange={v=>updFd('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><LocalizedTextarea value={fd.subtitle} onChange={v=>updFd('subtitle',v)} rows={2} /></Field>
        <Grid2>
          <Field label="Judul Pesan Sukses"><LocalizedInput value={fd.successTitle} onChange={v=>updFd('successTitle',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi Pesan Sukses"><LocalizedTextarea value={fd.successDesc} onChange={v=>updFd('successDesc',v)} rows={2} /></Field>
        <Divider />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase'}}>Opsi Rentang Investasi</label>
              <Btn onClick={()=>addOpt('rangeOptions')} variant="primary" size="xs">+</Btn>
            </div>
            {(fd.rangeOptions||[]).map((opt,i) => (
              <div key={i} style={{display:'flex',gap:6,marginBottom:5}}>
                <LocalizedInput value={opt} onChange={v=>updOpt('rangeOptions',i,v)} placeholder="< Rp 100 Jt" />
                <Btn onClick={()=>rmOpt('rangeOptions',i)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase'}}>Opsi Minat Investasi</label>
              <Btn onClick={()=>addOpt('interestOptions')} variant="primary" size="xs">+</Btn>
            </div>
            {(fd.interestOptions||[]).map((opt,i) => (
              <div key={i} style={{display:'flex',gap:6,marginBottom:5}}>
                <LocalizedInput value={opt} onChange={v=>updOpt('interestOptions',i,v)} placeholder="Saham / Ekuitas" />
                <Btn onClick={()=>rmOpt('interestOptions',i)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}