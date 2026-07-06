// ─── Reusable UI Components untuk Admin Panel PT BOBA ─────────────────────────
import { useState } from 'react'

export const Field = ({ label, children, hint, required }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
      {label}
      {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ margin: '5px 0 0', fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>{hint}</p>}
  </div>
)

export const Input = ({ value, onChange, placeholder, type = 'text', disabled, style = {} }) => (
  <input
    type={type} value={value ?? ''} disabled={disabled}
    onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder}
    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', fontSize: 14, border: '1.5px solid #e5e7eb', borderRadius: 8, background: disabled ? '#f9fafb' : '#fff', color: '#111', outline: 'none', transition: 'border-color 0.15s', ...style }}
    onFocus={e => e.target.style.borderColor = '#1BA882'}
    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
  />
)

export const Textarea = ({ value, onChange, rows = 3, placeholder, disabled }) => (
  <textarea
    value={value ?? ''} rows={rows} disabled={disabled}
    onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder}
    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', fontSize: 14, border: '1.5px solid #e5e7eb', borderRadius: 8, background: disabled ? '#f9fafb' : '#fff', color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, transition: 'border-color 0.15s' }}
    onFocus={e => e.target.style.borderColor = '#1BA882'}
    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
  />
)

// ─── Bilingual ({ id, en }) field detection helper ────────────────────────────
const isBilingual = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v) &&
  ('id' in v || 'en' in v)

const LangTabs = ({ tab, setTab }) => (
  <div style={{ display: 'inline-flex', gap: 2, marginBottom: 6, background: '#f3f4f6', borderRadius: 7, padding: 2 }}>
    {['id', 'en'].map(l => (
      <button key={l} type="button" onClick={() => setTab(l)}
        style={{
          padding: '3px 11px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          borderRadius: 5, border: 'none', cursor: 'pointer',
          background: tab === l ? '#1BA882' : 'transparent',
          color: tab === l ? '#fff' : '#9ca3af',
          transition: 'all 0.15s',
        }}>
        {l === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
      </button>
    ))}
  </div>
)

/**
 * LocalizedInput — drop-in replacement for <Input>.
 * If `value` is a bilingual object ({ id, en }), shows an ID/EN tab switcher
 * and edits the active language only, preserving the other.
 * If `value` is a plain string/number/null, behaves exactly like <Input>.
 */
export const LocalizedInput = ({ value, onChange, placeholder, type = 'text', disabled, style = {} }) => {
  const [tab, setTab] = useState('id')

  if (!isBilingual(value)) {
    return <Input value={value} onChange={onChange} placeholder={placeholder} type={type} disabled={disabled} style={style} />
  }

  return (
    <div>
      <LangTabs tab={tab} setTab={setTab} />
      <Input
        value={value[tab] ?? ''}
        onChange={v => onChange && onChange({ ...value, [tab]: v })}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        style={style}
      />
    </div>
  )
}

/**
 * LocalizedTextarea — drop-in replacement for <Textarea>.
 * Same bilingual ID/EN tab behavior as LocalizedInput.
 */
export const LocalizedTextarea = ({ value, onChange, rows = 3, placeholder, disabled }) => {
  const [tab, setTab] = useState('id')

  if (!isBilingual(value)) {
    return <Textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} disabled={disabled} />
  }

  return (
    <div>
      <LangTabs tab={tab} setTab={setTab} />
      <Textarea
        value={value[tab] ?? ''}
        onChange={v => onChange && onChange({ ...value, [tab]: v })}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export const Select = ({ value, onChange, children, disabled }) => (
  <select
    value={value ?? ''} disabled={disabled}
    onChange={e => onChange && onChange(e.target.value)}
    style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1.5px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#111', outline: 'none', cursor: 'pointer' }}
  >
    {children}
  </select>
)

export const ColorInput = ({ value, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <input
      type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
      style={{ width: 40, height: 36, padding: 2, border: '1.5px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', background: '#fff' }}
    />
    <Input value={value} onChange={onChange} placeholder="#000000" style={{ flex: 1 }} />
  </div>
)

export const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px', marginBottom: 20, ...style }}>
    {children}
  </div>
)

export const CardTitle = ({ children, action, sub, sticky = false }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f3f4f6',
    ...(sticky ? {
      position: 'sticky', top: 57, zIndex: 10,
      background: '#fff', marginTop: -20, paddingTop: 20,
      marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24,
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 4px 12px -4px rgba(0,0,0,0.06)',
    } : {})
  }}>
    <div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111' }}>{children}</h3>
      {sub && <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9ca3af' }}>{sub}</p>}
    </div>
    {action && <div style={{ flexShrink: 0, marginLeft: 12 }}>{action}</div>}
  </div>
)

// Tiap item produk bisa collapse/expand agar layar tidak penuh.
// Header (nama + warna) selalu tampil. Isi form muncul hanya saat dibuka.
export const CollapsibleItemCard = ({ children, label, accent, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ border: `1.5px solid ${open ? (accent || '#1BA882') : '#f0f0f0'}`, borderRadius: 12, marginBottom: 10, borderLeft: accent ? `4px solid ${accent}` : undefined, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      {/* ── Row header (selalu tampil) ── */}
      <div
        onClick={() => setOpen(x => !x)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer', background: open ? '#f9fffe' : '#fff', userSelect: 'none', transition: 'background 0.15s' }}>
        <span style={{ fontSize: 13, color: '#9ca3af', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: accent || '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {/* Tombol aksi — stopPropagation agar tidak toggle accordion */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {onMoveUp && <Btn onClick={onMoveUp} variant="outline" size="xs" disabled={!canMoveUp} style={{ padding: '3px 8px' }}>↑</Btn>}
          {onMoveDown && <Btn onClick={onMoveDown} variant="outline" size="xs" disabled={!canMoveDown} style={{ padding: '3px 8px' }}>↓</Btn>}
          {onRemove && <Btn onClick={onRemove} variant="danger" size="xs">Hapus</Btn>}
        </div>
      </div>
      {/* ── Form fields (hanya tampil saat open) ── */}
      {open && (
        <div style={{ padding: '16px 16px 18px', borderTop: `1px solid ${accent ? accent + '30' : '#f3f4f6'}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

export const Btn = ({ children, onClick, variant = 'default', size = 'md', disabled, type = 'button', style = {} }) => {
  const sizes = { xs: { padding: '4px 10px', fontSize: 12 }, sm: { padding: '6px 14px', fontSize: 13 }, md: { padding: '9px 18px', fontSize: 14 }, lg: { padding: '12px 24px', fontSize: 15 } }
  const variants = {
    default: { background: '#f3f4f6', color: '#374151', border: 'none' },
    primary: { background: '#1BA882', color: '#fff', border: 'none' },
    success: { background: '#059669', color: '#fff', border: 'none' },
    danger: { background: '#fee2e2', color: '#dc2626', border: 'none' },
    outline: { background: 'transparent', color: '#374151', border: '1.5px solid #e5e7eb' },
    ghost: { background: 'transparent', color: '#6b7280', border: 'none' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, opacity: disabled ? 0.55 : 1, transition: 'all 0.15s', ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

export const Badge = ({ children, color = '#1BA882', style = {} }) => (
  <span style={{ background: color + '18', color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, display: 'inline-block', ...style }}>{children}</span>
)

export const Alert = ({ type = 'info', children }) => {
  const styles = {
    info: { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af', icon: 'ℹ️' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', icon: '✓' },
    warning: { bg: '#fffbeb', border: '#fde68a', color: '#92400e', icon: '⚠️' },
    error: { bg: '#fef2f2', border: '#fecaca', color: '#991b1b', icon: '✕' },
  }
  const s = styles[type]
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 16px', borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: 13, marginBottom: 16 }}>
      <span>{s.icon}</span>
      <div>{children}</div>
    </div>
  )
}

export const Spinner = ({ size = 20, color = '#1BA882' }) => (
  <div style={{ width: size, height: size, border: `2px solid ${color}30`, borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
)

export const Toggle = ({ value, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
    <div
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#1BA882' : '#d1d5db', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: 9, background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
    {label && <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{label}</span>}
  </label>
)

export const ItemCard = ({ children, onRemove, label, accent, onMoveUp, onMoveDown, canMoveUp = true, canMoveDown = true }) => (
  <div style={{ border: '1.5px solid #f0f0f0', borderRadius: 12, padding: '16px', marginBottom: 14, borderLeft: accent ? `4px solid ${accent}` : undefined }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      {label && <Badge color={accent || '#6b7280'}>{label}</Badge>}
      <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
        {(onMoveUp || onMoveDown) && (
          <div style={{ display: 'flex', gap: 2, marginRight: 4 }}>
            {onMoveUp && (
              <Btn onClick={onMoveUp} variant="outline" size="xs" disabled={!canMoveUp}
                style={{ padding: '4px 9px' }} title="Naikkan urutan">↑</Btn>
            )}
            {onMoveDown && (
              <Btn onClick={onMoveDown} variant="outline" size="xs" disabled={!canMoveDown}
                style={{ padding: '4px 9px' }} title="Turunkan urutan">↓</Btn>
            )}
          </div>
        )}
        {onRemove && <Btn onClick={onRemove} variant="danger" size="xs">Hapus</Btn>}
      </div>
    </div>
    {children}
  </div>
)

export const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>
)

export const Divider = () => <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '16px 0' }} />