/**
 * useLang.jsx — PT BOBA Language System
 *
 * Menyediakan:
 *   - LangProvider        : context wrapper, persist ke localStorage
 *   - useLang()           : { lang, setLang, toggle }
 *   - useT()              : helper t(field) → string sesuai lang aktif
 *   - useLocalizedData()  : deep-resolve seluruh objek data JSON sekaligus
 *                           (RECOMMENDED — tidak perlu ubah JSX per-field)
 *
 * Penggunaan di component (minimal change):
 *   const rawData = useContent('hero')
 *   const data    = useLocalizedData(rawData)   // ← tambahkan ini
 *   // Setelah itu: data.title, data.desc, dst. sudah resolved ke bahasa aktif
 */
import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const LangCtx = createContext(null)

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('ptboba_lang') || 'id'
  )

  const setLang = useCallback((l) => {
    localStorage.setItem('ptboba_lang', l)
    setLangState(l)
  }, [])

  const toggle = useCallback(() => {
    setLangState(prev => {
      const next = prev === 'id' ? 'en' : 'id'
      localStorage.setItem('ptboba_lang', next)
      return next
    })
  }, [])

  return (
    <LangCtx.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangCtx.Provider>
  )
}

/* ─── Hook: akses lang state ─────────────────────────────────────────────── */
export function useLang() {
  const ctx = useContext(LangCtx)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

/* ─── Hook: single-field translation helper ─────────────────────────────── */
export function useT() {
  const { lang } = useLang()
  return useCallback(
    (field) => {
      if (field === null || field === undefined) return ''
      if (typeof field === 'number') return String(field)
      if (typeof field === 'string') return field
      if (typeof field === 'object' && !Array.isArray(field)) {
        return field[lang] ?? field.id ?? ''
      }
      return String(field)
    },
    [lang]
  )
}

/* ─── Core: deep-resolve bilingual object ────────────────────────────────── */
/**
 * Recursively walks a JSON value and resolves every { id, en } node
 * to the string for the given language.
 *
 * Non-translation objects, arrays, primitives, and nulls are returned
 * unchanged so no existing component logic breaks.
 */
function localizeDeep(value, lang) {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value              // primitive → as-is
  if (Array.isArray(value)) return value.map(v => localizeDeep(v, lang))

  const keys = Object.keys(value)

  // Detect bilingual leaf: exactly { id, en }
  // Tidak lagi mensyaratkan typeof === 'string' karena value.id bisa berupa
  // tipe apapun (number, object, dll) akibat data yang tidak konsisten.
  // Kita tetap resolve selama hanya ada 2 key: 'id' dan 'en'.
  if (keys.length === 2 && keys.includes('id') && keys.includes('en')) {
    const picked = lang === 'en' ? value.en : (value.id ?? value.en)
    // Kalau nilai yang dipilih masih berupa object, recurse sekali lagi
    if (picked !== null && typeof picked === 'object') {
      return localizeDeep(picked, lang)
    }
    // Pastikan hasilnya selalu string supaya tidak menjadi React child yang crash
    if (picked === null || picked === undefined) return ''
    return typeof picked === 'string' ? picked : String(picked)
  }

  // Recurse into all other objects
  const out = {}
  for (const k of keys) {
    out[k] = localizeDeep(value[k], lang)
  }
  return out
}

/* ─── Hook: deep-resolve an entire data object ───────────────────────────── */
/**
 * useLocalizedData(rawData)
 *
 * Takes the raw JSON returned by useContent() and returns a new object
 * where every { id, en } leaf has been replaced with the correct string
 * for the active language.
 *
 * The result is memoized; it only re-computes when rawData or lang changes.
 *
 * Usage in a component:
 *   const rawData = useContent('hero')
 *   const data    = useLocalizedData(rawData)
 *   // Now: data.header.title is already a plain string
 */
export function useLocalizedData(rawData) {
  const { lang } = useLang()
  return useMemo(() => localizeDeep(rawData, lang), [rawData, lang])
}