import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Category.css'

export default function Tumby() {
  const { products, loading } = useCategoryProducts('tumby')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Тумбы"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}
