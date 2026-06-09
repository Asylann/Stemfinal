import ProductList from '../../components/ProductList'
import './Category.css'

const products = [
  {
    id: 1,
    title: 'ТУМБА 1',
    img: '/img/pagesecond/tumby/tumba1/tumba.png',
    description: 'Удобная и практичная модель. Подходит для ежедневного использования. Простая конструкция, аккуратный внешний вид. Хорошо вписывается в любое пространство.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '800x400x600',
    colors: [
      { name: 'Дуб', hex: '#ab5014', img: '/img/pagesecond/tumby/tumba1/tumba1.png' },
      { name: 'Белый', hex: '#ffffff', img: '/img/pagesecond/tumby/tumba1/tumba1_white.png' },
      { name: 'Золотистый дуб', hex: '#C18A4F', img: '/img/pagesecond/tumby/tumba1/tumba1_dark.png' },
      { name: 'Светлый дуб', hex: '#dc8b3f', img: '/img/pagesecond/tumby/tumba1/tumba1_light.png' },
      { name: 'Черный', hex: '#000000', img: '/img/pagesecond/tumby/tumba1/tumba1_black.png' },
    ],
    article: 'L.Me-TU.UN.800',
  },
  {
    id: 2,
    title: 'ТУМБА 2',
    img: '/img/pagesecond/tumby/tumba2/tumba2_white.png',
    description: 'Компактный, надёжный, функциональный. Отличается от первой модели небольшими конструктивными особенностями, но сохраняет те же преимущества: простоту и удобство.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '800x400x600',
    colors: [
      { name: 'Белый', hex: '#ffffff', img: '/img/pagesecond/tumby/tumba2/tumba2_white.png' },
      { name: 'Золотистый дуб', hex: '#C18A4F', img: '/img/pagesecond/tumby/tumba2/tumba2_dark.png' },
      { name: 'Светлый дуб', hex: '#dc8b3f', img: '/img/pagesecond/tumby/tumba2/tumba2_light.png' },
      { name: 'Черный', hex: '#000000', img: '/img/pagesecond/tumby/tumba2/tumba2_black.png' },
    ],
    article: 'L.Me-TU.UN.800',
  },
]

export default function Tumby() {
  return (
    <ProductList
      products={products}
      title="Тумбы"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}