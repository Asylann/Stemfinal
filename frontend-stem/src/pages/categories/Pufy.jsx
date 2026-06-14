import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Category.css'

export default function Pufy() {
  const { products, loading } = useCategoryProducts('pufy')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Пуфы"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}
