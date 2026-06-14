import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Category.css'

export default function Myagkie() {
  const { products, loading } = useCategoryProducts('myagkie')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Мягкие стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}
