import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Gos.css'

export default function Gos() {
  const { products, loading } = useCategoryProducts('gos')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Государственная символика"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}
