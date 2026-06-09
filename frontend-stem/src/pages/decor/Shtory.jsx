import { Link } from 'react-router-dom'
import './Shtory.css'

const products = [
  {
    id: 1,
    title: 'РУЛОННЫЕ',
    img: '/img/pagedecor/shtory/item3.png',
    description: 'Рулонные шторы — это классическое решение для оформления окон. Они легко монтируются, удобны в эксплуатации и обеспечивают хорошую светоизоляцию. Идеально подходят для гостиных, спален и детских комнат.',
    material: ['Ткань', 'Синтетика'],
    size: 'По размеру окна',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 2,
    title: 'ЖАЛЮЗИ',
    img: '/img/pagedecor/shtory/item2/item1.png',
    description: 'Жалюзи — это стильное и функциональное решение для оформления окон. Они позволяют регулировать уровень освещения и обеспечивают хорошую вентиляцию. Идеально подходят для гостиных, спален и офисов.',
    material: ['Пластик', 'Алюминий'],
    size: 'По размеру окна',
    colors: [
      { name: 'Белый', hex: '#FFFFFF', img: '/img/pagedecor/shtory/item2/item7.png' },
      { name: 'Бежевый', hex: '#F5DEB3', img: '/img/pagedecor/shtory/item2/item6.png' },
      { name: 'Черный', hex: '#000000', img: '/img/pagedecor/shtory/item2/item8.png' },
      { name: 'Тёмно-зеленый', hex: '#184613', img: '/img/pagedecor/shtory/item2/item4.png' },
      { name: 'Темно-синий', hex: '#110780', img: '/img/pagedecor/shtory/item2/item2.png' },
      { name: 'Зеленый', hex: '#0c7b11', img: '/img/pagedecor/shtory/item2/item3.png' },
      { name: 'Серый', hex: '#888888', img: '/img/pagedecor/shtory/item2/item1.png' },
      { name: 'Красный', hex: '#d71a1a', img: '/img/pagedecor/shtory/item2/item5.png' },
    ],
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 3,
    title: 'ТКАНЕВЫЕ',
    img: '/img/pagedecor/shtory/item1/item3.png',
    description: 'Тканевые шторы — это уютное и элегантное решение для оформления окон. Они обеспечивают хорошую звукоизоляцию и могут быть выполнены в различных дизайнерских решениях.',
    material: ['Ткань', 'Лён', 'Хлопок'],
    size: 'По размеру окна',
    colors: [
      { name: 'Белый', hex: '#FFFFFF', img: '/img/pagedecor/shtory/item1/item1 (7).png' },
      { name: 'Бежевый', hex: '#F5DEB3', img: '/img/pagedecor/shtory/item1/item1.png' },
      { name: 'Черный', hex: '#000000', img: '/img/pagedecor/shtory/item1/item1 (1).png' },
      { name: 'Тёмно-зеленый', hex: '#184613', img: '/img/pagedecor/shtory/item1/item1 (4).png' },
      { name: 'Темно-синий', hex: '#110780', img: '/img/pagedecor/shtory/item1/item1 (3).png' },
      { name: 'Зеленый', hex: '#0c7b11', img: '/img/pagedecor/shtory/item1/item1 (5).png' },
      { name: 'Серый', hex: '#888888', img: '/img/pagedecor/shtory/item1/item1 (2).png' },
      { name: 'Красный', hex: '#880808', img: '/img/pagedecor/shtory/item1/item1 (6).png' },
    ],
    article: 'S.Me-ST.S.DP',
  },
]

import ProductList from '../../components/ProductList'

export default function Shtory() {
  return (
    <ProductList
      products={products}
      title="Шторы"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}