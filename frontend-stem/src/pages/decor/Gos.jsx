import ProductList from '../../components/ProductList'
import './Gos.css'

const products = [
  {
    id: 1,
    title: 'ГОСУДАРСТВЕННАЯ СИМВОЛИКА 1',
    img: '/img/pagedecor/gos/gos1.png',
    description: 'Стенд государственных символов РК. Флаг. Флагшток. Герб РК.',
    material: ['ЛДСП', 'Ножки из пластмасса'],
    size: 'Высота: 2000 / 2500 / до потолка, Глубина: 400 / 500 / 600, Ширина: Варьируется',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 2,
    title: 'ГОСУДАРСТВЕННАЯ СИМВОЛИКА 2',
    img: '/img/pagedecor/gos/gos2.png',
    description: 'Стенд государственных символов РК. Флаг. Флагшток. Герб РК.',
    material: ['ЛДСП', 'Ножки из пластмасса'],
    size: 'Высота: 2000 / 2500 / до потолка, Глубина: 400 / 500 / 600, Ширина: Варьируется',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 3,
    title: 'ГОСУДАРСТВЕННАЯ СИМВОЛИКА 3',
    img: '/img/pagedecor/gos/gos3.png',
    description: 'Стенд государственных символов РК. Флаг. Флагшток. Герб РК.',
    material: ['ЛДСП', 'МДФ', 'Металл', 'Ножки из пластмасса'],
    size: 'Высота: 2000 / 2500 / до потолка, Глубина: 400 / 500 / 600, Ширина: Варьируется',
    article: 'S.Me-ST.S.DP',
  },
]

export default function Gos() {
  return (
    <ProductList
      products={products}
      title="Государственная символика"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}