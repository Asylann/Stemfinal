import ProductList from '../../components/ProductList'
import './Doski.css'

const products = [
  {
    id: 1,
    title: 'МАРКЕРНАЯ ДОСКА',
    img: '/img/pagedecor/doski/item1.png',
    description: 'Компактная модель для небольших пространств. Легко вписывается в интерьер, не перегружая его. Простая сборка, аккуратный внешний вид. Подходит для дома или офиса.',
    material: ['Металл', 'Лак'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 2,
    title: 'ГРИФЕЛЬНАЯ ДОСКА',
    img: '/img/pagedecor/doski/item2.png',
    description: 'Грифельная доска — это классическое решение для оформления интерьера. Она добавляет уюта и тепла в комнату. Идеально подходит для гостиных, спален и офисов.',
    material: ['МДФ', 'Грифельное покрытие'],
    size: 'По согласованию с заказчиком',
    article: 'M.Me-ST.P.DP',
  },
  {
    id: 3,
    title: 'СТЕКЛЯННАЯ ДОСКА',
    img: '/img/pagedecor/doski/item3.png',
    description: 'Стеклянная доска — это современное решение для оформления интерьера. Она добавляет света и простора в комнату, создавая ощущение лёгкости. Идеально подходит для офисов.',
    material: ['Закалённое стекло', 'Металл'],
    size: 'По согласованию с заказчиком',
    article: 'L.Me-ST.Mg.DP',
  },
]

export default function Doski() {
  return (
    <ProductList
      products={products}
      title="Доски"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}