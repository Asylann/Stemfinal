import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import './Panels3D.css'

export default function Panels3D() {
  const { products, loading } = useCategoryProducts('3dpanels')
  return (
    <ProductList
      products={products}
      loading={loading}
      title="3D Панели"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}
