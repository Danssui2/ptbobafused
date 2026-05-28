/**
 * useContent.jsx — PT BOBA Content System
 *
 * Cache berlapis:
 *   L1 → Memory (Map)       instant, hilang saat refresh
 *   L2 → localStorage       instant, TTL 5 menit, persisten
 *   L3 → JSON fallback      selalu ada (di-bundle)
 *
 * Invalidasi cache otomatis (tanpa reload halaman):
 *   A) SAME BROWSER  → localStorage 'ptboba_invalidate' event (< 100ms)
 *      Admin panel tulis key ini setelah save → frontend langsung refetch
 *
 *   B) BEDA BROWSER / DEVICE → polling GET /api/content/version tiap 10 detik
 *      Jika version berubah → hapus cache → refetch semua section
 */
import { createContext, useContext, useEffect, useReducer, useRef, useCallback } from 'react'

// ─── Fallback JSON ────────────────────────────────────────────────────────────
import heroFallback     from '../data/hero.json'
import aboutFallback    from '../data/about.json'
import brandFallback    from '../data/brand.json'
import productFallback  from '../data/product.json'
import serviceFallback  from '../data/service.json'
import strukturFallback from '../data/struktur.json'
import partnerFallback  from '../data/partner.json'
import contactFallback  from '../data/contact.json'
import footerFallback   from '../data/footer.json'
import investorFallback from '../data/investor.json'

export const FALLBACKS = {
  hero: heroFallback, about: aboutFallback, brands: brandFallback,
  products: productFallback, services: serviceFallback, struktur: strukturFallback,
  partners: partnerFallback, contact: contactFallback, footer: footerFallback,
  investor: investorFallback,
}

// ─── Konstanta ────────────────────────────────────────────────────────────────
const CACHE_PREFIX      = 'ptboba_c_'
const TTL_MS            = 5 * 60 * 1000   // 5 menit
const POLL_INTERVAL_MS  = 5 * 60 * 1000       // polling version tiap x menit
const INVALIDATE_KEY    = 'ptboba_invalidate'  // key untuk same-browser signal

// ─── L1: Memory cache ────────────────────────────────────────────────────────
const mem = new Map()
const memGet = (k) => {
  const e = mem.get(k)
  if (!e || Date.now() - e.ts > TTL_MS) { mem.delete(k); return null }
  return e.data
}
const memSet = (k, data) => mem.set(k, { data, ts: Date.now() })

// ─── L2: localStorage cache ───────────────────────────────────────────────────
const lsGet = (k) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + k)
    if (!raw) return null
    const e = JSON.parse(raw)
    if (Date.now() - e.ts > TTL_MS) { localStorage.removeItem(CACHE_PREFIX + k); return null }
    return e.data
  } catch { return null }
}
const lsSet = (k, data) => {
  try { localStorage.setItem(CACHE_PREFIX + k, JSON.stringify({ data, ts: Date.now() })) }
  catch { /* quota exceeded */ }
}

// ─── Export: hapus semua cache content ───────────────────────────────────────
export const clearContentCache = () => {
  mem.clear()
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .forEach(k => localStorage.removeItem(k))
  } catch {}
}

// ─── Initial state ────────────────────────────────────────────────────────────
const buildInitialState = () =>
  Object.fromEntries(
    Object.keys(FALLBACKS).map(sec => {
      const cached = memGet(sec) ?? lsGet(sec)
      return [sec, { data: cached ?? FALLBACKS[sec], status: cached ? 'cached' : 'fallback' }]
    })
  )

// ─── Reducer ──────────────────────────────────────────────────────────────────
const reducer = (state, action) => {
  switch (action.type) {
    case 'BATCH_SUCCESS': {
      const next = { ...state }
      Object.entries(action.payload).forEach(([sec, data]) => {
        if (!FALLBACKS[sec]) return
        memSet(sec, data)
        lsSet(sec, data)
        next[sec] = { data, status: 'fresh' }
      })
      return next
    }
    case 'INVALIDATE':
      // Hapus cache, pertahankan data saat ini (tidak flicker)
      clearContentCache()
      return state
    case 'API_ERROR':
      return state
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ContentCtx = createContext(null)

export function ContentProvider({ children }) {
  const [state, dispatch]  = useReducer(reducer, null, buildInitialState)
  const firstFetch         = useRef(false)
  const knownVersion       = useRef(null)    // versi terakhir yang diketahui
  const pollingRef         = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  // ── Fetch semua konten dari API ──────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/content`, {
        signal: AbortSignal.timeout(8000),
        // pastikan tidak pakai browser cache
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.success && json.data) {
        dispatch({ type: 'BATCH_SUCCESS', payload: json.data })
      }
    } catch (err) {
      dispatch({ type: 'API_ERROR' })
      if (import.meta.env.DEV) {
        console.warn('[ContentProvider] API tidak tersedia, menggunakan cache/fallback:', err.message)
      }
    }
  }, [API_URL])

  // ── Periksa versi API, invalidasi cache jika ada yang baru ──────────────
  const checkVersion = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/content/version`, {
        signal: AbortSignal.timeout(5000),
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (!res.ok) return
      const { version } = await res.json()

      if (knownVersion.current === null) {
        // Pertama kali cek — simpan version tanpa invalidasi
        knownVersion.current = version
        return
      }

      if (version > knownVersion.current) {
        // Ada konten baru di DB → invalidasi cache → refetch
        if (import.meta.env.DEV) {
          console.info(`[ContentProvider] Konten diperbarui (v${version}), refetch...`)
        }
        knownVersion.current = version
        dispatch({ type: 'INVALIDATE' })
        await fetchAll()
      }
    } catch {
      // Polling gagal → abaikan, coba lagi di interval berikutnya
    }
  }, [API_URL, fetchAll])

  // ── Mount: fetch awal ───────────────────────────────────────────────────
  useEffect(() => {
    if (firstFetch.current) return
    firstFetch.current = true

    const allCached = Object.values(state).every(s => s.status === 'fresh' || s.status === 'cached')
    if (!allCached) fetchAll()

    // Setelah fetch awal, ambil versi sekarang sebagai baseline
    checkVersion()
  }, []) // eslint-disable-line

  // ── Polling version tiap 10 detik ──────────────────────────────────────
  useEffect(() => {
    pollingRef.current = setInterval(checkVersion, POLL_INTERVAL_MS)
    return () => clearInterval(pollingRef.current)
  }, [checkVersion])

  // ── Same-browser invalidasi via localStorage 'storage' event ───────────
  // Admin panel menulis localStorage key ini setelah save → trigger refetch
  // (hanya bekerja jika admin dan frontend ada di browser yang sama / tab berbeda)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key !== INVALIDATE_KEY) return
      if (import.meta.env.DEV) {
        console.info('[ContentProvider] Invalidasi dari admin panel (same browser), refetch...')
      }
      dispatch({ type: 'INVALIDATE' })
      fetchAll()
      // Update knownVersion agar polling tidak double-trigger
      checkVersion()
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fetchAll, checkVersion])

  // ── Visibilty change: refetch saat tab di-fokus kembali ─────────────────
  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === 'visible') checkVersion()
    }
    document.addEventListener('visibilitychange', handleVisible)
    return () => document.removeEventListener('visibilitychange', handleVisible)
  }, [checkVersion])

  return <ContentCtx.Provider value={state}>{children}</ContentCtx.Provider>
}

// ─── Hook: ambil data satu section ───────────────────────────────────────────
export function useContent(section) {
  const ctx = useContext(ContentCtx)
  if (!ctx) throw new Error('useContent must be inside <ContentProvider>')
  const entry = ctx[section]
  return {
    data:    entry?.data   ?? FALLBACKS[section],
    status:  entry?.status ?? 'fallback',
    loading: entry?.status === 'fallback' && !FALLBACKS[section],
  }
}
