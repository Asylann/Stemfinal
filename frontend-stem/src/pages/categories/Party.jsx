import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'

export default function Party() {
  const { products, loading } = useCategoryProducts('party')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Party стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}
