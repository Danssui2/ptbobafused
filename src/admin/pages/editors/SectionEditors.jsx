/**
 * SectionEditors.jsx — PT BOBA Admin Panel
 * Semua editor section website, sinkron dengan struktur data terbaru.
 *
 * Sections:
 *   AboutEditor, BrandsEditor, ProductsEditor, ServicesEditor,
 *   StrukturEditor, PartnersEditor, ContactEditor, FooterEditor, InvestorEditor
 */
import { Card, CardTitle, Field, Input, Textarea, Select, ItemCard, Btn, Grid2, Divider, Badge, Alert } from '../../components/UI'

const clone = v => JSON.parse(JSON.stringify(v))

// ─── Shared helpers ───────────────────────────────────────────────────────────
const ColorField = ({ label, value, onChange }) => (
  <Field label={label}>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
        style={{ width: 40, height: 36, border: '1.5px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', padding: 2, flexShrink: 0 }} />
      <Input value={value} onChange={onChange} placeholder="#000000" />
    </div>
  </Field>
)

const ImgPreview = ({ src }) =>
  src ? <img src={src} alt="preview" onError={e => e.target.style.display = 'none'}
    style={{ height: 80, borderRadius: 8, objectFit: 'cover', marginBottom: 14, maxWidth: '100%', display: 'block' }} /> : null

// ─── ABOUT EDITOR ─────────────────────────────────────────────────────────────
export function AboutEditor({ data, onChange }) {
  const { hero = {}, stats = [], visiMisi = {}, pillars = {}, timeline = {}, cta = {} } = data ?? {}

  const updHero = (k, v) => onChange({ ...data, hero: { ...hero, [k]: v } })
  const updBadge = (k, v) => onChange({ ...data, hero: { ...hero, badge: { ...hero.badge, [k]: v } } })
  const updStat = (i, k, v) => { const n = clone(stats); n[i][k] = k === 'value' ? (parseInt(v)||0) : v; onChange({ ...data, stats: n }) }
  const updVisi = (k, v) => onChange({ ...data, visiMisi: { ...visiMisi, visi: { ...visiMisi.visi, [k]: v } } })
  const updMisi = (i, v) => { const n = clone(visiMisi.misi||[]); n[i] = v; onChange({ ...data, visiMisi: { ...visiMisi, misi: n } }) }
  const addMisi = () => onChange({ ...data, visiMisi: { ...visiMisi, misi: [...(visiMisi.misi||[]), 'Misi baru'] } })
  const removeMisi = i => onChange({ ...data, visiMisi: { ...visiMisi, misi: (visiMisi.misi||[]).filter((_,idx)=>idx!==i) } })
  const updPillar = (i, k, v) => { const n = clone(pillars.items||[]); n[i][k] = v; onChange({ ...data, pillars: { ...pillars, items: n } }) }
  const addPillar = () => onChange({ ...data, pillars: { ...pillars, items: [...(pillars.items||[]), { icon: 'Leaf', title: 'Pilar Baru', desc: 'Deskripsi.', color: '#1BA882' }] } })
  const removePillar = i => onChange({ ...data, pillars: { ...pillars, items: (pillars.items||[]).filter((_,idx)=>idx!==i) } })
  const updMilestone = (i, k, v) => { const n = clone(timeline.milestones||[]); n[i][k] = v; onChange({ ...data, timeline: { ...timeline, milestones: n } }) }
  const addMilestone = () => onChange({ ...data, timeline: { ...timeline, milestones: [...(timeline.milestones||[]), { year: String(new Date().getFullYear()), event: 'Milestone baru' }] } })
  const removeMilestone = i => onChange({ ...data, timeline: { ...timeline, milestones: (timeline.milestones||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      {/* ── Hero ── */}
      <Card>
        <CardTitle sub="Bagian header section Tentang Kami">Hero / Header</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={hero.chip} onChange={v=>updHero('chip',v)} /></Field>
          <Field label="Judul"><Input value={hero.title} onChange={v=>updHero('title',v)} /></Field>
          <Field label="Judul Highlight (hijau)"><Input value={hero.titleHighlight} onChange={v=>updHero('titleHighlight',v)} /></Field>
          <Field label="Badge Nilai"><Input value={hero.badge?.value} onChange={v=>updBadge('value',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><Textarea value={hero.description} onChange={v=>updHero('description',v)} rows={4} /></Field>
        <Field label="URL Foto Tim" hint="URL gambar dari Pexels/Unsplash"><Input value={hero.image} onChange={v=>updHero('image',v)} /></Field>
        <ImgPreview src={hero.image} />
        <Grid2>
          <Field label="Label Foto"><Input value={hero.imageLabel} onChange={v=>updHero('imageLabel',v)} /></Field>
          <Field label="Sub Label Foto"><Input value={hero.imageSub} onChange={v=>updHero('imageSub',v)} /></Field>
        </Grid2>
      </Card>

      {/* ── Stats ── */}
      <Card>
        <CardTitle sub="Angka statistik di bawah hero">Statistik Perusahaan</CardTitle>
        {stats.map((s,i) => (
          <ItemCard key={i} label={`Stat ${i+1} — ${s.label}`}>
            <Grid2>
              <Field label="Label"><Input value={s.label} onChange={v=>updStat(i,'label',v)} /></Field>
              <Field label="Nilai (angka)"><Input value={s.value} onChange={v=>updStat(i,'value',v)} type="number" /></Field>
              <Field label="Suffix" hint='Contoh: +, K, %'><Input value={s.suffix} onChange={v=>updStat(i,'suffix',v)} /></Field>
              <Field label="Sub-label kecil"><Input value={s.sub} onChange={v=>updStat(i,'sub',v)} /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      {/* ── Visi Misi ── */}
      <Card>
        <CardTitle>Visi Perusahaan</CardTitle>
        <Field label="Judul Visi"><Input value={visiMisi.visi?.title} onChange={v=>updVisi('title',v)} /></Field>
        <Field label="Deskripsi Visi"><Textarea value={visiMisi.visi?.desc} onChange={v=>updVisi('desc',v)} rows={3} /></Field>
      </Card>
      <Card>
        <CardTitle action={<Btn onClick={addMisi} variant="primary" size="sm">+ Tambah</Btn>}>Misi Perusahaan</CardTitle>
        {(visiMisi.misi||[]).map((m,i) => (
          <ItemCard key={i} label={`Misi ${i+1}`} onRemove={()=>removeMisi(i)}>
            <Textarea value={m} onChange={v=>updMisi(i,v)} rows={2} />
          </ItemCard>
        ))}
      </Card>

      {/* ── Pillars (now has color field) ── */}
      <Card>
        <CardTitle action={<Btn onClick={addPillar} variant="primary" size="sm">+ Tambah</Btn>} sub="Pilar utama perusahaan (tiap item punya warna)">
          Empat Pilar
        </CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={pillars.chip} onChange={v=>onChange({...data,pillars:{...pillars,chip:v}})} /></Field>
          <Field label="Judul Section"><Input value={pillars.title} onChange={v=>onChange({...data,pillars:{...pillars,title:v}})} /></Field>
          <Field label="Teks CTA"><Input value={pillars.ctaLabel} onChange={v=>onChange({...data,pillars:{...pillars,ctaLabel:v}})} /></Field>
          <Field label="Link CTA"><Input value={pillars.ctaHref} onChange={v=>onChange({...data,pillars:{...pillars,ctaHref:v}})} /></Field>
        </Grid2>
        {(pillars.items||[]).map((item,i) => (
          <ItemCard key={i} label={item.title} accent={item.color} onRemove={()=>removePillar(i)}>
            <Grid2>
              <Field label="Judul"><Input value={item.title} onChange={v=>updPillar(i,'title',v)} /></Field>
              <Field label="Icon (lucide name)"><Input value={item.icon} onChange={v=>updPillar(i,'icon',v)} placeholder="Leaf" /></Field>
            </Grid2>
            <ColorField label="Warna Aksen" value={item.color} onChange={v=>updPillar(i,'color',v)} />
            <Field label="Deskripsi"><Textarea value={item.desc} onChange={v=>updPillar(i,'desc',v)} rows={2} /></Field>
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
              <Field label="Tahun"><Input value={m.year} onChange={v=>updMilestone(i,'year',v)} /></Field>
            </Grid2>
            <Field label="Keterangan"><Textarea value={m.event} onChange={v=>updMilestone(i,'event',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── CTA ── */}
      <Card>
        <CardTitle>Bagian CTA Bawah</CardTitle>
        <Field label="Judul"><Input value={cta.title} onChange={v=>onChange({...data,cta:{...cta,title:v}})} /></Field>
        <Field label="Deskripsi"><Textarea value={cta.desc} onChange={v=>onChange({...data,cta:{...cta,desc:v}})} rows={2} /></Field>
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
  const addBrand = () => onChange({ ...data, brands: [...brands, { id: Date.now(), name: 'Brand Baru', category: 'Kategori', desc: '', logoText: 'BRAND', logoBg: '#f0f0f0', logoTextColor: '#333', accent: '#1BA882', cta: { label: 'Lihat Produk', icon: 'ShoppingBag', href: '#products' } }] })
  const removeBrand = i => onChange({ ...data, brands: brands.filter((_,idx)=>idx!==i) })

  return (
    <div>
      <Card>
        <CardTitle sub="Teks header section brand">Header Section</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><Input value={header.title} onChange={v=>updH('title',v)} /></Field>
          <Field label="Subtitle (sebelum bold)"><Input value={header.subtitle} onChange={v=>updH('subtitle',v)} /></Field>
          <Field label="Subtitle Bold"><Input value={header.subtitleBold} onChange={v=>updH('subtitleBold',v)} /></Field>
        </Grid2>
        <Field label="Subtitle Akhir"><Input value={header.subtitleEnd} onChange={v=>updH('subtitleEnd',v)} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addBrand} variant="primary" size="sm">+ Tambah Brand</Btn>} sub={`${brands.length} brand aktif`}>
          Daftar Brand
        </CardTitle>
        {brands.map((b,i) => (
          <ItemCard key={b.id||i} label={b.name} accent={b.accent} onRemove={()=>removeBrand(i)}>
            <Grid2>
              <Field label="Nama Brand"><Input value={b.name} onChange={v=>updB(i,'name',v)} /></Field>
              <Field label="Kategori"><Input value={b.category} onChange={v=>updB(i,'category',v)} /></Field>
              <Field label="Logo Text"><Input value={b.logoText} onChange={v=>updB(i,'logoText',v)} /></Field>
            </Grid2>
            <Grid2>
              <ColorField label="Accent Color" value={b.accent} onChange={v=>updB(i,'accent',v)} />
              <ColorField label="Logo Background" value={b.logoBg} onChange={v=>updB(i,'logoBg',v)} />
            </Grid2>
            <Field label="Logo Text Color"><Input value={b.logoTextColor} onChange={v=>updB(i,'logoTextColor',v)} /></Field>
            <Field label="Deskripsi"><Textarea value={b.desc} onChange={v=>updB(i,'desc',v)} rows={3} /></Field>
            <Divider />
            <Grid2>
              <Field label="Teks Tombol CTA"><Input value={b.cta?.label} onChange={v=>updCta(i,'label',v)} /></Field>
              <Field label="Link CTA"><Input value={b.cta?.href} onChange={v=>updCta(i,'href',v)} /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle>Platform Note</CardTitle>
        <Grid2>
          <Field label="Teks"><Input value={platformNote.text} onChange={v=>onChange({...data,platformNote:{...platformNote,text:v}})} /></Field>
          <Field label="Nama Brand"><Input value={platformNote.brand} onChange={v=>onChange({...data,platformNote:{...platformNote,brand:v}})} /></Field>
          <Field label="Label CTA"><Input value={platformNote.ctaLabel} onChange={v=>onChange({...data,platformNote:{...platformNote,ctaLabel:v}})} /></Field>
          <Field label="Link CTA"><Input value={platformNote.ctaHref} onChange={v=>onChange({...data,platformNote:{...platformNote,ctaHref:v}})} /></Field>
        </Grid2>
      </Card>
    </div>
  )
}

// ─── PRODUCTS EDITOR ──────────────────────────────────────────────────────────
export function ProductsEditor({ data, onChange }) {
  const { header = {}, brands = [], waNumber = '', contactEmail = '' } = data ?? {}
  const updH = (k,v) => onChange({ ...data, header: { ...header, [k]: v } })
  const updP = (i,k,v) => { const n=clone(brands); n[i][k]=v; onChange({...data,brands:n}) }
  const updStat = (pi,si,k,v) => { const n=clone(brands); n[pi].stats[si][k]=v; onChange({...data,brands:n}) }
  const addProduct = () => onChange({ ...data, brands: [...brands, { id: Date.now(), name: 'Produk Baru', category: 'Kategori', tagline: '', desc: '', featured: false, color: '#1BA882', initials: 'P', img: '', website: '', stats: [{v:'0+',l:'Stat'}] }] })
  const removeProduct = i => onChange({ ...data, brands: brands.filter((_,idx)=>idx!==i) })

  return (
    <div>
      {/* ── Kontak Global ── */}
      <Card>
        <CardTitle sub="Nomor WA & email untuk tombol di setiap produk">Kontak Global Produk</CardTitle>
        <Grid2>
          <Field label="Nomor WhatsApp" hint="Format: 62812xxxxxx"><Input value={waNumber} onChange={v=>onChange({...data,waNumber:v})} placeholder="628xxxxxxxxx" /></Field>
          <Field label="Email Kontak"><Input value={contactEmail} onChange={v=>onChange({...data,contactEmail:v})} placeholder="hello@ptboba.id" /></Field>
        </Grid2>
      </Card>

      {/* ── Header ── */}
      <Card>
        <CardTitle>Header Section Produk</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul Awal"><Input value={header.title} onChange={v=>updH('title',v)} /></Field>
          <Field label="Judul Highlight (hijau)"><Input value={header.titleHighlight} onChange={v=>updH('titleHighlight',v)} /></Field>
          <Field label="Judul Akhir"><Input value={header.titleEnd} onChange={v=>updH('titleEnd',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><Textarea value={header.desc} onChange={v=>updH('desc',v)} rows={3} /></Field>
      </Card>

      {/* ── Produk ── */}
      <Card>
        <CardTitle action={<Btn onClick={addProduct} variant="primary" size="sm">+ Tambah Produk</Btn>} sub={`${brands.length} produk`}>
          Daftar Produk
        </CardTitle>
        {brands.map((p,i) => (
          <ItemCard key={p.id||i} label={`${p.name} — ${p.category}`} accent={p.color} onRemove={()=>removeProduct(i)}>
            <Grid2>
              <Field label="Nama"><Input value={p.name} onChange={v=>updP(i,'name',v)} /></Field>
              <Field label="Kategori"><Input value={p.category} onChange={v=>updP(i,'category',v)} /></Field>
              <Field label="Tagline"><Input value={p.tagline} onChange={v=>updP(i,'tagline',v)} /></Field>
              <Field label="Inisial (2-3 huruf)"><Input value={p.initials} onChange={v=>updP(i,'initials',v)} /></Field>
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
            <Field label="Deskripsi"><Textarea value={p.desc} onChange={v=>updP(i,'desc',v)} rows={2} /></Field>
            <Field label="URL Gambar"><Input value={p.img} onChange={v=>updP(i,'img',v)} placeholder="https://..." /></Field>
            <ImgPreview src={p.img} />
            <Field label="Website Produk" hint="URL website brand (opsional)"><Input value={p.website||''} onChange={v=>updP(i,'website',v)} placeholder="https://tsoecha.co" /></Field>
            <Divider />
            <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:8}}>Stats</label>
            {(p.stats||[]).map((st,si) => (
              <div key={si} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:6}}>
                <Input value={st.v} onChange={v=>updStat(i,si,'v',v)} placeholder="Nilai" />
                <Input value={st.l} onChange={v=>updStat(i,si,'l',v)} placeholder="Label" />
              </div>
            ))}
          </ItemCard>
        ))}
      </Card>
    </div>
  )
}

// ─── SERVICES EDITOR ──────────────────────────────────────────────────────────
const NEW_SVC = () => ({ id: Date.now(), icon: 'Leaf', title: 'Layanan Baru', tag: 'Tag', desc: 'Deskripsi.', price: 'Rp 0', unit: '/ bulan', cta: 'Pesan Layanan', ctaHref: '#contact' })
const NEW_GROUP = () => ({ id: `grp_${Date.now()}`, chip: 'Subholding Baru', label: 'Deskripsi grup', accentColor: '#1BA882', services: [NEW_SVC()] })

function ServiceItem({ svc, accent, onUpdate, onRemove }) {
  const u = (k,v) => onUpdate({ ...svc, [k]: v })
  return (
    <ItemCard label={svc.tag||'Layanan'} accent={accent} onRemove={onRemove}>
      <Grid2>
        <Field label="Judul"><Input value={svc.title} onChange={v=>u('title',v)} /></Field>
        <Field label="Tag"><Input value={svc.tag} onChange={v=>u('tag',v)} /></Field>
        <Field label="Harga"><Input value={svc.price} onChange={v=>u('price',v)} placeholder="Rp 0" /></Field>
        <Field label="Satuan"><Input value={svc.unit} onChange={v=>u('unit',v)} placeholder="/ bulan" /></Field>
        <Field label="Teks Tombol"><Input value={svc.cta} onChange={v=>u('cta',v)} /></Field>
        <Field label="Link Tombol"><Input value={svc.ctaHref} onChange={v=>u('ctaHref',v)} /></Field>
      </Grid2>
      <Field label="Deskripsi"><Textarea value={svc.desc} onChange={v=>u('desc',v)} rows={2} /></Field>
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
          <Field label="Chip"><Input value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><Input value={header.title} onChange={v=>updH('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><Textarea value={header.subtitle} onChange={v=>updH('subtitle',v)} rows={2} /></Field>
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
                <Field label="Chip (nama subholding)"><Input value={grp.chip} onChange={v=>updGrp(gi,'chip',v)} /></Field>
                <Field label="Label (deskripsi singkat)"><Input value={grp.label} onChange={v=>updGrp(gi,'label',v)} /></Field>
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
        <Field label="Catatan"><Textarea value={fd.note} onChange={v=>updFoot('note',v)} rows={2} /></Field>
        <Grid2>
          <Field label="Teks Tombol CTA"><Input value={fd.ctaLabel} onChange={v=>updFoot('ctaLabel',v)} /></Field>
          <Field label="Link CTA"><Input value={fd.ctaHref} onChange={v=>updFoot('ctaHref',v)} /></Field>
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
  const addMember = () => onChange({ ...data, founders: { ...founders, members: [...(founders.members||[]), { name: 'Nama Baru', role: 'Jabatan', desc: '', photo: '' }] } })
  const rmMember = i => onChange({ ...data, founders: { ...founders, members: (founders.members||[]).filter((_,idx)=>idx!==i) } })

  const updEco = (k,v) => onChange({ ...data, ecosystem: { ...ecosystem, [k]: v } })
  const updSub = (i,k,v) => { const n=clone(subholdings); n[i][k]=v; onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const updSubProd = (si,pi,v) => { const n=clone(subholdings); n[si].products[pi]=v; onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const addSubProd = si => { const n=clone(subholdings); n[si].products=[...(n[si].products||[]),'Produk baru']; onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const rmSubProd = (si,pi) => { const n=clone(subholdings); n[si].products=n[si].products.filter((_,idx)=>idx!==pi); onChange({...data,ecosystem:{...ecosystem,subholdings:n}}) }
  const addSub = () => onChange({ ...data, ecosystem: { ...ecosystem, subholdings: [...subholdings, { id: Date.now(), icon: 'Building2', accentFrom: '#1BA882', accentTo: '#2DD4B0', name: 'Subholding Baru', label: 'Label', focus: 'Fokus bisnis.', products: [] }] } })
  const rmSub = i => onChange({ ...data, ecosystem: { ...ecosystem, subholdings: subholdings.filter((_,idx)=>idx!==i) } })

  const updInv = (k,v) => onChange({ ...data, investment: { ...investment, [k]: v } })
  const updCard = (k,v) => onChange({ ...data, investment: { ...investment, card: { ...investCard, [k]: v } } })
  const updCardStat = (i,k,v) => { const n=clone(investCard.stats||[]); n[i][k]=v; onChange({...data,investment:{...investment,card:{...investCard,stats:n}}}) }
  const updPoint = (i,v) => { const n=clone(investment.points||[]); n[i]=v; onChange({...data,investment:{...investment,points:n}}) }
  const addPoint = () => onChange({ ...data, investment: { ...investment, points: [...(investment.points||[]), 'Poin baru'] } })
  const rmPoint = i => onChange({ ...data, investment: { ...investment, points: (investment.points||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      {/* ── Founders ── */}
      <Card>
        <CardTitle sub="Header section struktur">Header</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={founders.chip} onChange={v=>updF('chip',v)} /></Field>
          <Field label="Judul"><Input value={founders.title} onChange={v=>updF('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><Textarea value={founders.subtitle} onChange={v=>updF('subtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addMember} variant="primary" size="sm">+ Tambah</Btn>} sub="Foto: upload ke /public/founders/">
          Pendiri & Pengurus
        </CardTitle>
        {(founders.members||[]).map((m,i) => (
          <ItemCard key={i} label={`${m.name} — ${m.role}`} accent="#1BA882" onRemove={()=>rmMember(i)}>
            <Grid2>
              <Field label="Nama Lengkap"><Input value={m.name} onChange={v=>updM(i,'name',v)} /></Field>
              <Field label="Jabatan"><Input value={m.role} onChange={v=>updM(i,'role',v)} /></Field>
            </Grid2>
            <Field label="Path Foto" hint="Contoh: /founders/nama.jpg"><Input value={m.photo||''} onChange={v=>updM(i,'photo',v)} placeholder="/founders/nama.jpg" /></Field>
            {m.photo && <ImgPreview src={m.photo} />}
            <Field label="Deskripsi Peran"><Textarea value={m.desc} onChange={v=>updM(i,'desc',v)} rows={3} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Ecosystem ── */}
      <Card>
        <CardTitle sub="Header bagian ekosistem bisnis">Ekosistem Bisnis — Header</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={ecosystem.chip} onChange={v=>updEco('chip',v)} /></Field>
          <Field label="Judul"><Input value={ecosystem.title} onChange={v=>updEco('title',v)} /></Field>
          <Field label="Label Holding"><Input value={ecosystem.holdingLabel} onChange={v=>updEco('holdingLabel',v)} /></Field>
          <Field label="Deskripsi Holding"><Input value={ecosystem.holdingDesc} onChange={v=>updEco('holdingDesc',v)} /></Field>
          <Field label="Chip Subholdings"><Input value={ecosystem.subholdingsChip} onChange={v=>updEco('subholdingsChip',v)} /></Field>
          <Field label="Judul Subholdings"><Input value={ecosystem.subholdingsTitle} onChange={v=>updEco('subholdingsTitle',v)} /></Field>
        </Grid2>
        <Field label="Subtitle Subholdings"><Textarea value={ecosystem.subholdingsSubtitle} onChange={v=>updEco('subholdingsSubtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addSub} variant="primary" size="sm">+ Tambah</Btn>} sub={`${subholdings.length} subholding`}>
          4 Subholding BOBA Group
        </CardTitle>
        {subholdings.map((sub,si) => (
          <ItemCard key={sub.id||si} label={sub.name} accent={sub.accentFrom} onRemove={()=>rmSub(si)}>
            <Grid2>
              <Field label="Nama"><Input value={sub.name} onChange={v=>updSub(si,'name',v)} /></Field>
              <Field label="Label (kategori)"><Input value={sub.label} onChange={v=>updSub(si,'label',v)} /></Field>
            </Grid2>
            <Grid2>
              <ColorField label="Warna Dari" value={sub.accentFrom} onChange={v=>updSub(si,'accentFrom',v)} />
              <ColorField label="Warna Ke" value={sub.accentTo} onChange={v=>updSub(si,'accentTo',v)} />
            </Grid2>
            <Field label="Fokus Bisnis"><Textarea value={sub.focus} onChange={v=>updSub(si,'focus',v)} rows={2} /></Field>
            <Divider />
            <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:8}}>Produk / Program</label>
            {(sub.products||[]).map((prod,pi) => (
              <div key={pi} style={{display:'flex',gap:8,marginBottom:6}}>
                <Input value={prod} onChange={v=>updSubProd(si,pi,v)} placeholder="Nama produk" />
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
          <Field label="Badge"><Input value={investment.badge} onChange={v=>updInv('badge',v)} /></Field>
          <Field label="Judul"><Input value={investment.title} onChange={v=>updInv('title',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><Textarea value={investment.desc} onChange={v=>updInv('desc',v)} rows={3} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addPoint} variant="primary" size="xs">+ Tambah</Btn>}>Poin Investasi</CardTitle>
        {(investment.points||[]).map((p,i) => (
          <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
            <Input value={p} onChange={v=>updPoint(i,v)} />
            <Btn onClick={()=>rmPoint(i)} variant="danger" size="xs">✕</Btn>
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Kartu CTA investor di sebelah kanan">Investment Card</CardTitle>
        <Grid2>
          <Field label="Judul Card"><Input value={investCard.title} onChange={v=>updCard('title',v)} /></Field>
          <Field label="Deskripsi Card"><Input value={investCard.desc} onChange={v=>updCard('desc',v)} /></Field>
          <Field label="Teks Tombol Utama"><Input value={investCard.ctaLabel} onChange={v=>updCard('ctaLabel',v)} /></Field>
          <Field label="Link Tombol Utama"><Input value={investCard.ctaHref} onChange={v=>updCard('ctaHref',v)} /></Field>
          <Field label="Teks Tombol Secondary"><Input value={investCard.secondaryLabel} onChange={v=>updCard('secondaryLabel',v)} /></Field>
          <Field label="Link Tombol Secondary"><Input value={investCard.secondaryHref} onChange={v=>updCard('secondaryHref',v)} /></Field>
        </Grid2>
        <Divider />
        <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:8}}>Stats Card (3 item)</label>
        {(investCard.stats||[]).map((s,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:6}}>
            <Input value={s.v} onChange={v=>updCardStat(i,'v',v)} placeholder="Nilai" />
            <Input value={s.l} onChange={v=>updCardStat(i,'l',v)} placeholder="Label" />
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
  const addPartner = () => onChange({ ...data, partners: [...partners, { id: Date.now(), cat: 'Strategis', initials: 'NEW', name: 'Mitra Baru', desc: '', color: '#1BA882', textColor: '#fff' }] })
  const rmPartner = i => onChange({ ...data, partners: partners.filter((_,idx)=>idx!==i) })
  const updBenefit = (k,v) => onChange({ ...data, benefits: { ...benefits, [k]: v } })
  const updBenefitItem = (i,v) => { const n=clone(benefits.items||[]); n[i]=v; onChange({...data,benefits:{...benefits,items:n}}) }
  const addBenefitItem = () => onChange({ ...data, benefits: { ...benefits, items: [...(benefits.items||[]), 'Keuntungan baru'] } })
  const rmBenefitItem = i => onChange({ ...data, benefits: { ...benefits, items: (benefits.items||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      <Card>
        <CardTitle>Header Section</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><Input value={header.title} onChange={v=>updH('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><Textarea value={header.subtitle} onChange={v=>updH('subtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addPartner} variant="primary" size="sm">+ Tambah Mitra</Btn>} sub={`${partners.length} mitra aktif`}>
          Daftar Mitra
        </CardTitle>
        {partners.map((p,i) => (
          <ItemCard key={p.id||i} label={`[${p.cat}] ${p.name}`} accent={p.color} onRemove={()=>rmPartner(i)}>
            <Grid2>
              <Field label="Nama Mitra"><Input value={p.name} onChange={v=>updP(i,'name',v)} /></Field>
              <Field label="Inisial (2-3 huruf)"><Input value={p.initials} onChange={v=>updP(i,'initials',v)} /></Field>
              <Field label="Kategori">
                <Select value={p.cat} onChange={v=>updP(i,'cat',v)}>
                  {(categories.length ? categories : ['Strategis','Distribusi','Teknologi','Lingkungan']).filter(c=>c!=='Semua').map(c=><option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <ColorField label="Warna Background" value={p.color} onChange={v=>updP(i,'color',v)} />
            </Grid2>
            <Field label="Deskripsi"><Textarea value={p.desc} onChange={v=>updP(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Bagian keuntungan bermitra">Manfaat Kemitraan</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={benefits.chip} onChange={v=>updBenefit('chip',v)} /></Field>
          <Field label="Judul"><Input value={benefits.title} onChange={v=>updBenefit('title',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><Textarea value={benefits.desc} onChange={v=>updBenefit('desc',v)} rows={2} /></Field>
        <Field label="URL Gambar"><Input value={benefits.image} onChange={v=>updBenefit('image',v)} /></Field>
        <ImgPreview src={benefits.image} />
        <Divider />
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase'}}>Item Keuntungan</label>
          <Btn onClick={addBenefitItem} variant="primary" size="xs">+ Tambah</Btn>
        </div>
        {(benefits.items||[]).map((item,i) => (
          <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
            <Input value={item} onChange={v=>updBenefitItem(i,v)} />
            <Btn onClick={()=>rmBenefitItem(i)} variant="danger" size="xs">✕</Btn>
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Bagian CTA bawah">CTA Section</CardTitle>
        <Field label="Judul"><Input value={cta.title} onChange={v=>onChange({...data,cta:{...cta,title:v}})} /></Field>
        <Field label="Deskripsi"><Textarea value={cta.desc} onChange={v=>onChange({...data,cta:{...cta,desc:v}})} rows={2} /></Field>
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
  const addFaq = () => onChange({ ...data, faq: { ...faq, items: [...(faq.items||[]), { q: 'Pertanyaan baru?', a: 'Jawaban.' }] } })
  const rmFaq = i => onChange({ ...data, faq: { ...faq, items: (faq.items||[]).filter((_,idx)=>idx!==i) } })

  return (
    <div>
      <Card>
        <CardTitle>Header Section</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={header.chip} onChange={v=>updH('chip',v)} /></Field>
          <Field label="Judul"><Input value={header.title} onChange={v=>updH('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><Textarea value={header.subtitle} onChange={v=>updH('subtitle',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle sub={`${contactInfo.length} item kontak`}>Informasi Kontak</CardTitle>
        {contactInfo.map((info,i) => (
          <ItemCard key={i} label={info.label||`Info ${i+1}`}>
            <Grid2>
              <Field label="Nilai Utama"><Input value={info.value} onChange={v=>updInfo(i,'value',v)} /></Field>
              <Field label="Keterangan (sub)"><Input value={info.sub} onChange={v=>updInfo(i,'sub',v)} /></Field>
              <Field label="Icon (lucide name)"><Input value={info.icon} onChange={v=>updInfo(i,'icon',v)} placeholder="MapPin" /></Field>
              <Field label="Label"><Input value={info.label} onChange={v=>updInfo(i,'label',v)} /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle sub="Tombol kontak cepat">Quick Contact</CardTitle>
        {quickContact.map((c,i) => (
          <ItemCard key={i} label={c.label}>
            <Grid2>
              <Field label="Label"><Input value={c.label} onChange={v=>updQC(i,'label',v)} /></Field>
              <Field label="Nilai"><Input value={c.value} onChange={v=>updQC(i,'value',v)} /></Field>
              <Field label="Link (href)"><Input value={c.href} onChange={v=>updQC(i,'href',v)} /></Field>
              <Field label="Icon"><Input value={c.icon} onChange={v=>updQC(i,'icon',v)} placeholder="Phone" /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle>WhatsApp</CardTitle>
        <Grid2>
          <Field label="Nomor" hint="Format: 62812xxxxxx"><Input value={whatsapp.number} onChange={v=>updWA('number',v)} /></Field>
          <Field label="Label Tombol"><Input value={whatsapp.label} onChange={v=>updWA('label',v)} /></Field>
        </Grid2>
      </Card>

      <Card>
        <CardTitle>Formulir Kontak</CardTitle>
        <Grid2>
          <Field label="Judul Form"><Input value={fd.title} onChange={v=>updFd('title',v)} /></Field>
          <Field label="Subtitle Form"><Input value={fd.subtitle} onChange={v=>updFd('subtitle',v)} /></Field>
          <Field label="Pesan Sukses — Judul"><Input value={fd.successTitle} onChange={v=>updFd('successTitle',v)} /></Field>
        </Grid2>
        <Field label="Pesan Sukses — Deskripsi"><Textarea value={fd.successDesc} onChange={v=>updFd('successDesc',v)} rows={2} /></Field>
      </Card>

      <Card>
        <CardTitle>Embed Google Maps</CardTitle>
        <Field label="Judul Peta"><Input value={map.title} onChange={v=>onChange({...data,map:{...map,title:v}})} /></Field>
        <Field label="URL Embed" hint="Dari Google Maps → Share → Embed a map → URL src">
          <Textarea value={map.embedUrl} onChange={v=>onChange({...data,map:{...map,embedUrl:v}})} rows={3} />
        </Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addFaq} variant="primary" size="sm">+ Tambah FAQ</Btn>} sub={`${(faq.items||[]).length} pertanyaan`}>
          FAQ
        </CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={faq.chip} onChange={v=>onChange({...data,faq:{...faq,chip:v}})} /></Field>
          <Field label="Judul FAQ"><Input value={faq.title} onChange={v=>onChange({...data,faq:{...faq,title:v}})} /></Field>
        </Grid2>
        {(faq.items||[]).map((item,i) => (
          <ItemCard key={i} label={`FAQ ${i+1}`} onRemove={()=>rmFaq(i)}>
            <Field label="Pertanyaan"><Input value={item.q} onChange={v=>updFaqItem(i,'q',v)} /></Field>
            <Field label="Jawaban"><Textarea value={item.a} onChange={v=>updFaqItem(i,'a',v)} rows={3} /></Field>
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
  const addGroup = () => onChange({ ...data, navGroups: [...navGroups, { title: 'Grup Baru', links: [] }] })
  const rmGroup = gi => onChange({ ...data, navGroups: navGroups.filter((_,idx)=>idx!==gi) })

  return (
    <div>
      <Card>
        <CardTitle>Brand Info Footer</CardTitle>
        <Field label="Tagline"><Textarea value={brand.tagline} onChange={v=>updB('tagline',v)} rows={3} /></Field>
        <Field label="Alamat"><Input value={brand.address} onChange={v=>updB('address',v)} /></Field>
        <Grid2>
          <Field label="Telepon"><Input value={brand.phone} onChange={v=>updB('phone',v)} /></Field>
          <Field label="Email"><Input value={brand.email} onChange={v=>updB('email',v)} /></Field>
        </Grid2>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addSoc} variant="primary" size="sm">+ Tambah</Btn>}>Social Media</CardTitle>
        {socials.map((s,i) => (
          <ItemCard key={i} label={s.label} onRemove={()=>rmSoc(i)}>
            <Grid2>
              <Field label="Platform"><Input value={s.label} onChange={v=>updSoc(i,'label',v)} /></Field>
              <Field label="Icon (lucide)"><Input value={s.icon} onChange={v=>updSoc(i,'icon',v)} placeholder="Instagram" /></Field>
            </Grid2>
            <Field label="URL"><Input value={s.href} onChange={v=>updSoc(i,'href',v)} placeholder="https://..." /></Field>
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addGroup} variant="primary" size="sm">+ Tambah Grup</Btn>} sub={`${navGroups.length} grup navigasi`}>
          Navigasi Footer
        </CardTitle>
        {navGroups.map((grp,gi) => (
          <ItemCard key={gi} label={grp.title} onRemove={()=>rmGroup(gi)}
            action={<Btn onClick={()=>addLink(gi)} variant="primary" size="xs">+ Link</Btn>}>
            <Field label="Judul Grup"><Input value={grp.title} onChange={v=>updGroup(gi,'title',v)} /></Field>
            <Divider />
            {(grp.links||[]).map((link,li) => (
              <div key={li} style={{display:'flex',gap:8,marginBottom:6,alignItems:'flex-end'}}>
                <div style={{flex:1}}><Input value={link.label} onChange={v=>updLink(gi,li,'label',v)} placeholder="Label" /></div>
                <div style={{flex:1}}><Input value={link.href} onChange={v=>updLink(gi,li,'href',v)} placeholder="#href" /></div>
                <Btn onClick={()=>rmLink(gi,li)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
          </ItemCard>
        ))}
      </Card>

      <Card>
        <CardTitle>Newsletter & Copyright</CardTitle>
        <Grid2>
          <Field label="Judul Newsletter"><Input value={newsletter.title} onChange={v=>onChange({...data,newsletter:{...newsletter,title:v}})} /></Field>
          <Field label="Teks Tombol"><Input value={newsletter.ctaLabel} onChange={v=>onChange({...data,newsletter:{...newsletter,ctaLabel:v}})} /></Field>
        </Grid2>
        <Field label="Subtitle Newsletter"><Input value={newsletter.subtitle} onChange={v=>onChange({...data,newsletter:{...newsletter,subtitle:v}})} /></Field>
        <Field label="Copyright"><Input value={copyright} onChange={v=>onChange({...data,copyright:v})} /></Field>
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
  const addWhyItem = () => onChange({ ...data, whyBoba: { ...whyBoba, items: [...(whyBoba.items||[]), { icon: 'TrendingUp', title: 'Poin Baru', desc: '' }] } })
  const rmWhyItem = i => onChange({ ...data, whyBoba: { ...whyBoba, items: (whyBoba.items||[]).filter((_,idx)=>idx!==i) } })

  const updMetric = (i,k,v) => { const n=clone(metrics.items||[]); n[i][k]= k==='value'?(parseInt(v)||0):v; onChange({...data,metrics:{...metrics,items:n}}) }
  const updRoad = (i,k,v) => { const n=clone(roadmap.items||[]); n[i][k]= (k==='active'||k==='upcoming')?(v==='true'):v; onChange({...data,roadmap:{...roadmap,items:n}}) }
  const addRoad = () => onChange({ ...data, roadmap: { ...roadmap, items: [...(roadmap.items||[]), { year: '2026', month: 'Q1', title: 'Milestone Baru', desc: '', active: false, upcoming: true }] } })
  const rmRoad = i => onChange({ ...data, roadmap: { ...roadmap, items: (roadmap.items||[]).filter((_,idx)=>idx!==i) } })

  const updDoc = (i,k,v) => { const n=clone(documents.items||[]); n[i][k]=v; onChange({...data,documents:{...documents,items:n}}) }
  const addDoc = () => onChange({ ...data, documents: { ...documents, items: [...(documents.items||[]), { icon: 'FileText', tag: 'Dokumen', tagColor: '#1BA882', title: 'Dokumen Baru', desc: '', status: 'Tersedia' }] } })
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
          <Field label="Badge"><Input value={hero.badge} onChange={v=>updHero('badge',v)} /></Field>
          <Field label="Judul"><Input value={hero.title} onChange={v=>updHero('title',v)} /></Field>
          <Field label="Judul Highlight (hijau)"><Input value={hero.titleHighlight} onChange={v=>updHero('titleHighlight',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi"><Textarea value={hero.desc} onChange={v=>updHero('desc',v)} rows={3} /></Field>
        <Field label="URL Foto Hero"><Input value={hero.image} onChange={v=>updHero('image',v)} /></Field>
        <ImgPreview src={hero.image} />
        <Grid2>
          <Field label="Teks CTA Utama"><Input value={hero.ctaPrimary?.label} onChange={v=>updCtaPri('label',v)} /></Field>
          <Field label="Link CTA Utama"><Input value={hero.ctaPrimary?.href} onChange={v=>updCtaPri('href',v)} /></Field>
          <Field label="Teks CTA Secondary"><Input value={hero.ctaSecondary?.label} onChange={v=>updCtaSec('label',v)} /></Field>
          <Field label="Link CTA Secondary"><Input value={hero.ctaSecondary?.href} onChange={v=>updCtaSec('href',v)} /></Field>
        </Grid2>
        <Divider />
        <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:8}}>Floating Stats (4 item)</label>
        {(hero.floatingStats||[]).map((s,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:6}}>
            <Input value={s.value} onChange={v=>updStat(i,'value',v)} placeholder="Nilai" />
            <Input value={s.label} onChange={v=>updStat(i,'label',v)} placeholder="Label" />
            <Input value={s.sub} onChange={v=>updStat(i,'sub',v)} placeholder="Sub-label" />
          </div>
        ))}
      </Card>

      {/* ── Why BOBA ── */}
      <Card>
        <CardTitle action={<Btn onClick={addWhyItem} variant="primary" size="sm">+ Tambah</Btn>} sub="Alasan berinvestasi di PT BOBA">
          Why BOBA
        </CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={whyBoba.chip} onChange={v=>updWhy('chip',v)} /></Field>
          <Field label="Judul"><Input value={whyBoba.title} onChange={v=>updWhy('title',v)} /></Field>
        </Grid2>
        {(whyBoba.items||[]).map((item,i) => (
          <ItemCard key={i} label={item.title} onRemove={()=>rmWhyItem(i)}>
            <Grid2>
              <Field label="Judul"><Input value={item.title} onChange={v=>updWhyItem(i,'title',v)} /></Field>
              <Field label="Icon (lucide)"><Input value={item.icon} onChange={v=>updWhyItem(i,'icon',v)} placeholder="TrendingUp" /></Field>
            </Grid2>
            <Field label="Deskripsi"><Textarea value={item.desc} onChange={v=>updWhyItem(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Metrics ── */}
      <Card>
        <CardTitle sub="Angka-angka kunci perusahaan">Metrics / KPI</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={metrics.chip} onChange={v=>onChange({...data,metrics:{...metrics,chip:v}})} /></Field>
          <Field label="Judul"><Input value={metrics.title} onChange={v=>onChange({...data,metrics:{...metrics,title:v}})} /></Field>
        </Grid2>
        {(metrics.items||[]).map((item,i) => (
          <ItemCard key={i} label={item.label}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 60px',gap:8,marginBottom:6}}>
              <Input value={item.label} onChange={v=>updMetric(i,'label',v)} placeholder="Label" />
              <Input value={item.value} onChange={v=>updMetric(i,'value',v)} type="number" placeholder="Nilai" />
              <Input value={item.suffix} onChange={v=>updMetric(i,'suffix',v)} placeholder="+" />
            </div>
            <Input value={item.sub} onChange={v=>updMetric(i,'sub',v)} placeholder="Sub-label kecil" />
          </ItemCard>
        ))}
      </Card>

      {/* ── Roadmap ── */}
      <Card>
        <CardTitle action={<Btn onClick={addRoad} variant="primary" size="sm">+ Tambah</Btn>} sub="Timeline milestone perusahaan">
          Roadmap
        </CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={roadmap.chip} onChange={v=>onChange({...data,roadmap:{...roadmap,chip:v}})} /></Field>
          <Field label="Judul"><Input value={roadmap.title} onChange={v=>onChange({...data,roadmap:{...roadmap,title:v}})} /></Field>
        </Grid2>
        {(roadmap.items||[]).map((item,i) => (
          <ItemCard key={i} label={`${item.year} ${item.month} — ${item.title}`} onRemove={()=>rmRoad(i)}>
            <Grid2>
              <Field label="Judul"><Input value={item.title} onChange={v=>updRoad(i,'title',v)} /></Field>
              <Field label="Tahun"><Input value={item.year} onChange={v=>updRoad(i,'year',v)} /></Field>
              <Field label="Bulan/Kuartal"><Input value={item.month} onChange={v=>updRoad(i,'month',v)} placeholder="Q1 2026" /></Field>
              <Field label="Status">
                <Select value={item.active?'active':item.upcoming?'upcoming':'done'} onChange={v=>{ updRoad(i,'active',String(v==='active')); updRoad(i,'upcoming',String(v==='upcoming')) }}>
                  <option value="done">Selesai</option>
                  <option value="active">Aktif</option>
                  <option value="upcoming">Akan Datang</option>
                </Select>
              </Field>
            </Grid2>
            <Field label="Deskripsi"><Textarea value={item.desc} onChange={v=>updRoad(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Documents ── */}
      <Card>
        <CardTitle action={<Btn onClick={addDoc} variant="primary" size="sm">+ Tambah</Btn>} sub="Dokumen yang tersedia untuk investor">
          Dokumen Investor
        </CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={documents.chip} onChange={v=>onChange({...data,documents:{...documents,chip:v}})} /></Field>
          <Field label="Judul"><Input value={documents.title} onChange={v=>onChange({...data,documents:{...documents,title:v}})} /></Field>
        </Grid2>
        {(documents.items||[]).map((doc,i) => (
          <ItemCard key={i} label={doc.title} onRemove={()=>rmDoc(i)}>
            <Grid2>
              <Field label="Judul Dokumen"><Input value={doc.title} onChange={v=>updDoc(i,'title',v)} /></Field>
              <Field label="Tag"><Input value={doc.tag} onChange={v=>updDoc(i,'tag',v)} /></Field>
              <Field label="Status"><Input value={doc.status} onChange={v=>updDoc(i,'status',v)} placeholder="Tersedia" /></Field>
              <Field label="Warna Tag"><Input value={doc.tagColor} onChange={v=>updDoc(i,'tagColor',v)} placeholder="#1BA882" /></Field>
            </Grid2>
            <Field label="Deskripsi"><Textarea value={doc.desc} onChange={v=>updDoc(i,'desc',v)} rows={2} /></Field>
          </ItemCard>
        ))}
      </Card>

      {/* ── Form ── */}
      <Card>
        <CardTitle sub="Formulir ketertarikan investor">Form Investor</CardTitle>
        <Grid2>
          <Field label="Chip"><Input value={fd.chip} onChange={v=>updFd('chip',v)} /></Field>
          <Field label="Judul"><Input value={fd.title} onChange={v=>updFd('title',v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><Textarea value={fd.subtitle} onChange={v=>updFd('subtitle',v)} rows={2} /></Field>
        <Grid2>
          <Field label="Judul Pesan Sukses"><Input value={fd.successTitle} onChange={v=>updFd('successTitle',v)} /></Field>
        </Grid2>
        <Field label="Deskripsi Pesan Sukses"><Textarea value={fd.successDesc} onChange={v=>updFd('successDesc',v)} rows={2} /></Field>
        <Divider />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase'}}>Opsi Rentang Investasi</label>
              <Btn onClick={()=>addOpt('rangeOptions')} variant="primary" size="xs">+</Btn>
            </div>
            {(fd.rangeOptions||[]).map((opt,i) => (
              <div key={i} style={{display:'flex',gap:6,marginBottom:5}}>
                <Input value={opt} onChange={v=>updOpt('rangeOptions',i,v)} placeholder="< Rp 100 Jt" />
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
                <Input value={opt} onChange={v=>updOpt('interestOptions',i,v)} placeholder="Saham / Ekuitas" />
                <Btn onClick={()=>rmOpt('interestOptions',i)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
