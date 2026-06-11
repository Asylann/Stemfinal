/**
 * useCategoryProducts(slug)
 *
 * Fetches products for a given category slug from the backend API.
 * Returns { products, loading, error } so category pages can use it
 * and fall back to an empty state gracefully if the API is unavailable.
 *
 * Static products defined in the component file are accepted as
 * an optional `fallback` parameter and used when the API returns
 * an empty array or fails.
 */

import { useState, useEffect } from 'react'
import { getProducts } from '../api/api'

export function useCategoryProducts(slug, fallback = []) {
  const [products, setProducts] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getProducts({ category: slug })
      .then((data) => {
        if (cancelled) return
        // If API returns products — use them; otherwise keep the fallback
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        } else if (fallback.length > 0) {
          setProducts(fallback)
        } else {
          setProducts([])
        }
      })
      .catch((err) => {
        if (cancelled) return
        console.warn(`useCategoryProducts(${slug}): API error, using fallback.`, err)
        setError(err.message)
        // Keep the fallback so the page still shows something
        setProducts(fallback)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return { products, loading, error }
}
