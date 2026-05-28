import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import { Card, CardTitle, Field, Input, Btn, Alert, Badge, ItemCard, Grid2 } from '../components/UI'

function ChangePasswordCard() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword) { setStatus({ type: 'error', msg: 'Semua field wajib diisi.' }); return }
    if (form.newPassword.length < 6) { setStatus({ type: 'error', msg: 'Password baru minimal 6 karakter.' }); return }
    if (form.newPassword !== form.confirmPassword) { setStatus({ type: 'error', msg: 'Konfirmasi password tidak cocok.' }); return }
    setLoading(true); setStatus(null)
    try {
      await api.changePassword(form.currentPassword, form.newPassword)
      setStatus({ type: 'success', msg: 'Password berhasil diubah!' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally { setLoading(false) }
  }

  return (
    <Card>
      <CardTitle sub="Ubah password akun Anda">Ganti Password</CardTitle>
      {status && <Alert type={status.type === 'success' ? 'success' : 'error'}>{status.msg}</Alert>}
      <Field label="Password Lama"><Input type="password" value={form.currentPassword} onChange={v => setForm(f => ({ ...f, currentPassword: v }))} /></Field>
      <Field label="Password Baru" hint="Minimal 6 karakter"><Input type="password" value={form.newPassword} onChange={v => setForm(f => ({ ...f, newPassword: v }))} /></Field>
      <Field label="Konfirmasi Password Baru"><Input type="password" value={form.confirmPassword} onChange={v => setForm(f => ({ ...f, confirmPassword: v }))} /></Field>
      <Btn onClick={handleSubmit} variant="primary" disabled={loading}>{loading ? 'Menyimpan...' : '💾 Simpan Password'}</Btn>
    </Card>
  )
}

function ManageAdminsCard() {
  const { admin } = useAuth()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', displayName: '', role: 'editor' })
  const [status, setStatus] = useState(null)
  const [creating, setCreating] = useState(false)

  const loadAdmins = () => {
    setLoading(true)
    api.getAdmins().then(res => setAdmins(res.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(loadAdmins, [])

  const handleCreate = async () => {
    if (!form.username || !form.password) { setStatus({ type: 'error', msg: 'Username dan password wajib diisi.' }); return }
    setCreating(true); setStatus(null)
    try {
      await api.createAdmin(form)
      setStatus({ type: 'success', msg: `Admin "${form.username}" berhasil dibuat!` })
      setForm({ username: '', password: '', displayName: '', role: 'editor' })
      setShowForm(false)
      loadAdmins()
    } catch (err) { setStatus({ type: 'error', msg: err.message }) }
    finally { setCreating(false) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus admin "${name}"?`)) return
    try { await api.deleteAdmin(id); loadAdmins() }
    catch (err) { setStatus({ type: 'error', msg: err.message }) }
  }

  if (admin?.role !== 'superadmin') return null

  return (
    <Card>
      <CardTitle
        sub="Kelola akun admin (hanya superadmin)"
        action={<Btn onClick={() => setShowForm(x => !x)} variant="primary" size="sm">{showForm ? '✕ Batal' : '+ Admin Baru'}</Btn>}
      >
        Manajemen Admin
      </CardTitle>

      {status && <Alert type={status.type === 'success' ? 'success' : 'error'}>{status.msg}</Alert>}

      {showForm && (
        <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Buat Admin Baru</h4>
          <Grid2>
            <Field label="Username" required><Input value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} placeholder="username..." /></Field>
            <Field label="Password" required><Input type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="min. 6 karakter" /></Field>
            <Field label="Nama Tampil"><Input value={form.displayName} onChange={v => setForm(f => ({ ...f, displayName: v }))} placeholder="Nama Admin" /></Field>
            <Field label="Role">
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1.5px solid #e5e7eb', borderRadius: 8 }}>
                <option value="editor">Editor — Edit konten saja</option>
                <option value="superadmin">Superadmin — Akses penuh</option>
              </select>
            </Field>
          </Grid2>
          <Btn onClick={handleCreate} variant="primary" disabled={creating}>{creating ? 'Membuat...' : '+ Buat Admin'}</Btn>
        </div>
      )}

      {loading ? <p style={{ color: '#9ca3af', fontSize: 14 }}>Memuat...</p> : (
        <div>
          {admins.map(a => (
            <div key={a._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: a.role === 'superadmin' ? '#1BA882' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.role === 'superadmin' ? '#fff' : '#6b7280', fontWeight: 800, fontSize: 13 }}>
                  {(a.displayName || a.username).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111' }}>{a.displayName || a.username}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>@{a.username} · {a.role === 'superadmin' ? '👑 Superadmin' : '✏️ Editor'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {a._id === admin?._id && <Badge color="#1BA882">Anda</Badge>}
                {a._id !== admin?._id && (
                  <Btn onClick={() => handleDelete(a._id, a.username)} variant="danger" size="xs">Hapus</Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function SettingsPage() {
  const { admin } = useAuth()
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>⚙️ Pengaturan</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280' }}>Kelola akun dan keamanan panel admin.</p>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <CardTitle>Profil Anda</CardTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#1BA882', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 900 }}>
            {(admin?.displayName || admin?.username || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: '#111' }}>{admin?.displayName}</p>
            <p style={{ margin: '2px 0', fontSize: 13, color: '#6b7280' }}>@{admin?.username}</p>
            <Badge color={admin?.role === 'superadmin' ? '#1BA882' : '#6b7280'}>
              {admin?.role === 'superadmin' ? '👑 Superadmin' : '✏️ Editor'}
            </Badge>
          </div>
        </div>
      </Card>

      <ChangePasswordCard />
      <ManageAdminsCard />
    </div>
  )
}
