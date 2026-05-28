// ─── Reusable UI Components untuk Admin Panel PT BOBA ─────────────────────────

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

export const CardTitle = ({ children, action, sub }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f3f4f6' }}>
    <div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111' }}>{children}</h3>
      {sub && <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9ca3af' }}>{sub}</p>}
    </div>
    {action && <div style={{ flexShrink: 0, marginLeft: 12 }}>{action}</div>}
  </div>
)

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

export const ItemCard = ({ children, onRemove, label, accent }) => (
  <div style={{ border: '1.5px solid #f0f0f0', borderRadius: 12, padding: '16px', marginBottom: 14, borderLeft: accent ? `4px solid ${accent}` : undefined }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      {label && <Badge color={accent || '#6b7280'}>{label}</Badge>}
      {onRemove && <Btn onClick={onRemove} variant="danger" size="xs">Hapus</Btn>}
    </div>
    {children}
  </div>
)

export const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>
)

export const Divider = () => <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '16px 0' }} />
