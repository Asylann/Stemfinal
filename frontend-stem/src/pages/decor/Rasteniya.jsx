import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Rasteniya.css'

export default function Rasteniya() {
  const { products, loading } = useCategoryProducts('rasteniya')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Растения"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}
