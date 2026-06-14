import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Category.css'

export default function Stellazhi() {
  const { products, loading } = useCategoryProducts('stellazhi')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Стеллажи"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}
