import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Category.css'

export default function Standartnye() {
  const { products, loading } = useCategoryProducts('standartnye')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Стандартные шкафы"
      backPath="/secondpage/shkafy"
      backLabel="Шкафы"
    />
  )
}
