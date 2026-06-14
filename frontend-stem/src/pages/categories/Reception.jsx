import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'

export default function Reception() {
  const { products, loading } = useCategoryProducts('reception')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Reception стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}
