import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import '../categories/Category.css'

export default function Shkolnye() {
  const { products, loading } = useCategoryProducts('shkolnye')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Школьные стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}
