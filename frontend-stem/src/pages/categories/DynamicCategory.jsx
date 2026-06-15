import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import { apiClient } from '../../api/api'

/**
 * Dynamic category page — renders products for any category slug.
 * Routes: /category/:slug or /secondpage/:slug (for unmatched slugs)
 * This allows admin-created categories to show up without code changes.
 */
export default function DynamicCategory() {
  const { slug } = useParams()
  const { products, loading } = useCategoryProducts(slug)
  const [categoryTitle, setCategoryTitle] = useState('')

  useEffect(() => {
    const loadCategoryTitle = async () => {
      try {
        const res = await apiClient.get(`/api/categories/${slug}`)
        setCategoryTitle(res.data.title_ru || res.data.slug || slug)
      } catch {
        setCategoryTitle(slug)
      }
    }
    if (slug) loadCategoryTitle()
  }, [slug])

  return (
    <ProductList
      products={products}
      loading={loading}
      title={categoryTitle || slug}
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}
