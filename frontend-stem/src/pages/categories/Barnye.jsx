import ProductList from '../../components/ProductList'
import './Category.css'

const products = [
  {
    id: 1,
    title: 'БАРНЫЙ СТУЛ 1',
    img: '/img/pagesecond/stulya/barnye/stul10/stul10_orange.png',
    description: 'Высота 75 см, прочный металлический каркас и мягкая обивка делают этот барный стул удобным и стильным элементом любой кухни или бара.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Металлические ножки'],
    size: '400x400x750',
    colors: [
      { name: 'Оранжевый', hex: '#FF6600', img: '/img/pagesecond/stulya/barnye/stul10/stul10_orange.png'},
      { name: 'Желтый', hex: '#e0ca06', img: '/img/pagesecond/stulya/barnye/stul10/stul10_yellow.png' },
      { name: 'Серо-зелёный', hex: '#2a9978', img: '/img/pagesecond/stulya/barnye/stul10/stul10_sage.png' },
      { name: 'Серый', hex: '#888888', img: '/img/pagesecond/stulya/barnye/stul10/stul10_grey.png' },
      { name: 'Белый', hex: '#fcfcfc', img: '/img/pagesecond/stulya/barnye/stul10/stul10_white.png'},
    ],
    article: 'L.Me-BA.UN.400',
  },
  {
    id: 2,
    title: 'БАРНЫЙ СТУЛ 2',
    img: '/img/pagesecond/stulya/barnye/stul11/stul11.png',
    description: 'Высота 75 см, прочный металлический каркас и мягкая обивка делают этот барный стул удобным и стильным элементом любой кухни или бара.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Металлические ножки'],
    size: '400x400x750',
    colors: [
      { name: 'Оранжевый', hex: '#FF6600', img: '/img/pagesecond/stulya/barnye/stul11/stul11 (1).png'},
      { name: 'Белый', hex: '#ffffff', img: '/img/pagesecond/stulya/barnye/stul11/stul11.png'},
      { name: 'Зелёный', hex: '#195a47', img: '/img/pagesecond/stulya/barnye/stul11/stul11 (3).png'},
      { name: 'Синий', hex: '#2c1fc4', img: '/img/pagesecond/stulya/barnye/stul11/stul11 (2).png'},
    ],
    article: 'L.Me-BA.UN.401',
  },
]

export default function Barnye() {
  return (
    <ProductList
      products={products}
      title="Барные стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}