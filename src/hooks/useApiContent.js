/**
 * Hook untuk mengambil konten dari API backend PT BOBA.
 * Fallback ke data JSON lokal jika API tidak tersedia.
 *
 * Cara pakai di komponen:
 *   import { useApiContent } from '../hooks/useApiContent'
 *
 *   const { data, loading } = useApiContent('hero')
 *   if (loading) return <LoadingSpinner />
 *   const { slides, floatingStats, autoplayDuration } = data
 */
import { useState, useEffect } from 'react'

// Fallback: import JSON lokal (sebagai default jika API gagal)
import heroDefault    from '../data/hero.json'
import aboutDefault   from '../data/about.json'
import brandDefault   from '../data/brand.json'
import productDefault from '../data/product.json'
import serviceDefault from '../data/service.json'
import strukturDefault from '../data/struktur.json'
import partnerDefault from '../data/partner.json'
import contactDefault from '../data/contact.json'
import footerDefault  from '../data/footer.json'

const DEFAULTS = {
  hero:     heroDefault,
  about:    aboutDefault,
  brands:   brandDefault,
  products: productDefault,
  services: serviceDefault,
  struktur: strukturDefault,
  partners: partnerDefault,
  contact:  contactDefault,
  footer:   footerDefault,
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function useApiContent(section) {
  const [data, setData]       = useState(DEFAULTS[section] || null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`${API_URL}/content/${section}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          setData(json.data)
          setError(null)
        }
      })
      .catch(err => {
        if (!cancelled) {
          // Fallback ke JSON lokal jika API tidak tersedia
          console.warn(`[PT BOBA] Gagal fetch section "${section}" dari API, menggunakan data lokal.`, err.message)
          setData(DEFAULTS[section] || null)
          setError(err.message)
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [section])

  return { data, loading, error }
}

/**
 * Hook untuk mengambil semua section sekaligus
 */
export function useAllContent() {
  const [data, setData]       = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then(res => res.json())
      .then(json => setData({ ...DEFAULTS, ...json.data }))
      .catch(() => setData(DEFAULTS))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}
