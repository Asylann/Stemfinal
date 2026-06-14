import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Shtory.css'

export default function Shtory() {
  const { products, loading } = useCategoryProducts('shtory')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Шторы"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}
