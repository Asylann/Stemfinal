import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import '../categories/Category.css'

export default function Divany() {
  const { products, loading } = useCategoryProducts('divany')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Диваны"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}
