import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Category.css'

export default function Barnye() {
  const { products, loading } = useCategoryProducts('barnye')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Барные стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}
