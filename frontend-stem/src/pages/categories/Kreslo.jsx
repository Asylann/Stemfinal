import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import '../categories/Category.css'

export default function Kreslo() {
  const { products, loading } = useCategoryProducts('kreslo')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Кресла"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}
