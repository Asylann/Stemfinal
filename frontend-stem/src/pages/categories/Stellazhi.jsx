import ProductList from '../../components/ProductList'
import './Category.css'

const products = [
  {
    id: 1,
    title: 'СТЕЛЛАЖ 1',
    img: '/img/pagesecond/stellazhi/stellazh1.png',
    description: 'Компактный и удобный стеллаж подойдёт для дома, офиса или магазина. Благодаря мягкой поверхности и аккуратному внешнему виду он не только помогает организовать хранение, но и выглядит современно.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '1200x400x1800',
    article: 'L.Me-ST.UN.1200',
  },
  {
    id: 2,
    title: 'СТЕЛЛАЖ 2',
    img: '/img/pagesecond/stellazhi/stellazh2.png',
    description: 'Компактный и удобный стеллаж подойдёт для дома, офиса или магазина. Благодаря мягкой поверхности и аккуратному внешнему виду он не только помогает организовать хранение, но и выглядит современно.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '1200x400x1800',
    article: 'L.Me-ST.UN.1200',
  },
  {
    id: 3,
    title: 'СТЕЛЛАЖ 3',
    img: '/img/pagesecond/stellazhi/stellazh3/stellazhi3_dark.png',
    description: 'Компактный и удобный стеллаж подойдёт для дома, офиса или магазина. Благодаря мягкой поверхности и аккуратному внешнему виду он не только помогает организовать хранение, но и выглядит современно.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '1200x400x1800',
    colors: [
      { name: 'Темный', hex: '#D49B61', img: '/img/pagesecond/stellazhi/stellazh3/stellazh3_dark.png'},
      { name: 'Белый', hex: '#ffffff', img: '/img/pagesecond/stellazhi/stellazh3/stellazh3_white.jpeg' },
      { name: 'Черный', hex: '#000000', img: '/img/pagesecond/stellazhi/stellazh3/stellazh3_black.jpeg' },
      { name: 'Светлый', hex: '#DBC29B', img: '/img/pagesecond/stellazhi/stellazh3/stellazh3_light.jpeg' },
    ],
    article: 'L.Me-ST.UN.1200',
  },
]

export default function Stellazhi() {
  return (
    <ProductList
      products={products}
      title="Стеллажи"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}