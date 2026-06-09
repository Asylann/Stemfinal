import ProductList from '../../components/ProductList'
import './Rasteniya.css'

const products = [
  {
    id: 1,
    title: 'ДЕРЕВО',
    img: '/img/pagedecor/rasteniya/item1/item1.png',
    description: 'Деревянные растения — это стильное и функциональное решение для оформления интерьера. Они добавляют уюта и тепла в комнату, создавая ощущение связи с природой. Идеально подходят для гостиных, спален и офисов.',
    material: ['Металл', 'Гипс', 'Пластик'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Белый', hex: '#FFFFFF', img: '/img/pagedecor/rasteniya/item1/item1.png'},
      { name: 'Черный', hex: '#222222', img: '/img/pagedecor/rasteniya/item1/item2.png'},
    ],
    article: 'L.DE-Ras.Der',
  },
  {
    id: 2,
    title: 'КОМАНДНЫЕ РАСТЕНИЯ',
    img: '/img/pagedecor/rasteniya/item2/item1.png',
    description: 'Командные растения — это идеальное решение для оформления интерьера. Они добавляют живости и цвета в комнату, создавая ощущение связи с природой. Идеально подходят для гостиных, спален и офисов.',
    material: ['Натуральные материалы'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Белый', hex: '#FFFFFF', img: '/img/pagedecor/rasteniya/item2/item1.png'},
      { name: 'Черный', hex: '#222222', img: '/img/pagedecor/rasteniya/item2/item2.png'},
      { name: 'Серый', hex: '#a8a49c', img: '/img/pagedecor/rasteniya/item2/item3.png'},
    ],
    article: 'L.DE-Ras.KomRas',
  },
  {
    id: 3,
    title: 'РАСТИТЕЛЬНОСТЬ НА СТЕНЕ',
    img: '/img/pagedecor/rasteniya/item3.png',
    description: 'Растительность на стене — это современное решение для оформления интерьера. Она добавляет живости и цвета в комнату, создавая ощущение связи с природой.',
    material: ['Мох', 'Натуральные материалы'],
    size: 'По размеру стены',
    article: 'L.DE-Ras.Moh',
  },
]

export default function Rasteniya() {
  return (
    <ProductList
      products={products}
      title="Растения"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}