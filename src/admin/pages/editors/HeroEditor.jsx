import { Card, CardTitle, Field, Input, Textarea, LocalizedInput, LocalizedTextarea, ItemCard, Btn, Grid2 } from '../../components/UI'

const clone = v => JSON.parse(JSON.stringify(v))

export default function HeroEditor({ data, onChange }) {
  const { slides = [], floatingStats = [], autoplayDuration } = data

  const updSlide = (i, key, val) => { const n = clone(slides); n[i][key] = val; onChange({ ...data, slides: n }) }
  const updCta = (i, k, v) => { const n = clone(slides); n[i].cta = { ...n[i].cta, [k]: v }; onChange({ ...data, slides: n }) }
  const addSlide = () => onChange({ ...data, slides: [...slides, { id: Date.now(), src: '', poster: '', title: { id: 'Slide Baru', en: 'New Slide' }, subtitle: { id: 'Subtitle slide', en: 'Slide subtitle' }, tag: { id: 'Tag', en: 'Tag' }, cta: { primary: { id: 'Pelajari', en: 'Learn More' }, href: '#about', secondary: { id: 'Lihat', en: 'View' }, href2: '#products' } }] })
  const removeSlide = i => onChange({ ...data, slides: slides.filter((_, idx) => idx !== i) })
  const moveSlide = (i, dir) => { const n = clone(slides); [n[i], n[i + dir]] = [n[i + dir], n[i]]; onChange({ ...data, slides: n }) }

  const updStat = (i, k, v) => { const n = clone(floatingStats); n[i][k] = v; onChange({ ...data, floatingStats: n }) }
  const addStat = () => onChange({ ...data, floatingStats: [...floatingStats, { value: '0+', label: { id: 'Label Baru', en: 'New Label' } }] })
  const removeStat = i => onChange({ ...data, floatingStats: floatingStats.filter((_, idx) => idx !== i) })

  return (
    <div>
      <Card>
        <CardTitle sub="Durasi antar slide dalam milidetik">Pengaturan Umum</CardTitle>
        <Field label="Durasi Autoplay (ms)" hint="Contoh: 7000 = 7 detik">
          <LocalizedInput value={autoplayDuration} onChange={v => onChange({ ...data, autoplayDuration: parseInt(v) || 7000 })} type="number" />
        </Field>
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addSlide} variant="primary" size="sm">+ Tambah Slide</Btn>} sub={`${slides.length} slide aktif`}>
          Slides Video
        </CardTitle>
        {slides.map((slide, i) => (
          <ItemCard key={slide.id} label={`Slide ${i + 1} — ${slide.title?.id ?? slide.title ?? ''}`} accent="#1BA882"
            onRemove={() => removeSlide(i)}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <Btn onClick={() => i > 0 && moveSlide(i, -1)} variant="outline" size="xs" disabled={i === 0}>↑ Naik</Btn>
              <Btn onClick={() => i < slides.length - 1 && moveSlide(i, 1)} variant="outline" size="xs" disabled={i === slides.length - 1}>↓ Turun</Btn>
            </div>
            <Field label="Tag / Label chip"><LocalizedInput value={slide.tag} onChange={v => updSlide(i, 'tag', v)} placeholder="Visi & Misi" /></Field>
            <Field label="Judul Utama"><LocalizedInput value={slide.title} onChange={v => updSlide(i, 'title', v)} /></Field>
            <Field label="Subtitle / Deskripsi"><LocalizedTextarea value={slide.subtitle} onChange={v => updSlide(i, 'subtitle', v)} rows={2} /></Field>
            <Grid2>
              <Field label="Teks CTA Kiri"><LocalizedInput value={slide.cta?.primary} onChange={v => updCta(i, 'primary', v)} /></Field>
              <Field label="Link CTA Kiri"><LocalizedInput value={slide.cta?.href} onChange={v => updCta(i, 'href', v)} placeholder="#about" /></Field>
              <Field label="Teks CTA Kanan"><LocalizedInput value={slide.cta?.secondary} onChange={v => updCta(i, 'secondary', v)} /></Field>
              <Field label="Link CTA Kanan"><LocalizedInput value={slide.cta?.href2} onChange={v => updCta(i, 'href2', v)} placeholder="#products" /></Field>
            </Grid2>
            <Field label="URL Poster / Thumbnail" hint="Gambar yang tampil sebelum video diputar">
              <LocalizedInput value={slide.poster} onChange={v => updSlide(i, 'poster', v)} placeholder="https://..." />
            </Field>
            {slide.poster && <div style={{ marginBottom: 14 }}><img src={slide.poster} alt="preview" style={{ height: 80, borderRadius: 8, objectFit: 'cover', maxWidth: '100%' }} onError={e => e.target.style.display = 'none'} /></div>}
            <Field label="URL Video (Sumber)" hint="URL langsung ke file .mp4">
              <LocalizedInput value={slide.src} onChange={v => updSlide(i, 'src', v)} placeholder="https://..." />
            </Field>
          </ItemCard>
        ))}
        {slides.length === 0 && <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: 24 }}>Belum ada slide. Klik "+ Tambah Slide".</p>}
      </Card>

      <Card>
        <CardTitle action={<Btn onClick={addStat} variant="primary" size="sm">+ Tambah</Btn>} sub="Statistik yang melayang di atas hero">
          Floating Stats
        </CardTitle>
        {floatingStats.map((stat, i) => (
          <ItemCard key={i} label={`Stat ${i + 1}`} onRemove={() => removeStat(i)}>
            <Grid2>
              <Field label="Nilai (value)"><LocalizedInput value={stat.value} onChange={v => updStat(i, 'value', v)} placeholder="6+" /></Field>
              <Field label="Label"><LocalizedInput value={stat.label} onChange={v => updStat(i, 'label', v)} placeholder="Lini Bisnis" /></Field>
            </Grid2>
          </ItemCard>
        ))}
      </Card>
    </div>
  )
}
