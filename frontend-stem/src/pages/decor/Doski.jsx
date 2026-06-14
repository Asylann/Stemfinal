import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Doski.css'

export default function Doski() {
  const { products, loading } = useCategoryProducts('doski')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Доски"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}
