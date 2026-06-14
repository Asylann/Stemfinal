import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Category.css'

export default function Vstroenye() {
  const { products, loading } = useCategoryProducts('vstroenye')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Встроенные шкафы"
      backPath="/secondpage/shkafy"
      backLabel="Шкафы"
    />
  )
}
