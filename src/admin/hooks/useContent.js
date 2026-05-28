/**
 * useContent.js — Admin Panel Content Hook
 *
 * Fetch satu section dari API, dengan dirty-tracking untuk tombol Simpan.
 *
 * Setelah save berhasil:
 *   1. Tulis localStorage key 'ptboba_invalidate' → memberi sinyal ke
 *      frontend (jika dibuka di tab lain di browser yang sama) untuk
 *      langsung membuang cache dan refetch — fast refresh < 100ms.
 *   2. Backend juga memperbarui updatedAt → polling frontend di browser
 *      lain akan mendeteksi perubahan dalam ≤ 10 detik.
 */
import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'

const INVALIDATE_KEY = 'ptboba_invalidate'

export function useContent(section) {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState(null)
  const [dirty,     setDirty]     = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  const fetch = useCallback(async () => {
    if (!section) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.getSection(section)
      setData(res.data)
      setDirty(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [section])

  useEffect(() => { fetch() }, [fetch])

  const update = useCallback((val) => {
    setData(typeof val === 'function' ? val : val)
    setDirty(true)
  }, [])

  const save = useCallback(async () => {
    if (!data || !section) return
    setSaving(true)
    setError(null)
    try {
      await api.updateSection(section, data)
      setDirty(false)
      setLastSaved(new Date())

      // ── Sinyal ke frontend di tab/window lain (same browser) ──────────
      // localStorage 'storage' event hanya trigger di tab LAIN — bukan tab ini.
      // Frontend yang terbuka akan langsung refetch tanpa menunggu polling.
      try {
        localStorage.setItem(INVALIDATE_KEY, String(Date.now()))
      } catch { /* private mode / quota */ }

    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [section, data])

  return { data, loading, saving, error, dirty, lastSaved, update, save, refetch: fetch }
}
