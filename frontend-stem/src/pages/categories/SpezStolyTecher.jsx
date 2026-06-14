import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'

export default function SpezStolyTecher() {
  const { products, loading } = useCategoryProducts('spezstolytecher')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Спец. столы"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}
