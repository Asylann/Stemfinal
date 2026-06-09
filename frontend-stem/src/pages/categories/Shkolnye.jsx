import ProductList from '../../components/ProductList'
import '../categories/Category.css'

const products = [
{
  id: 1,
  title: `ШКОЛЬНЫЙ СТУЛ 1`,
  img: `/img/pagesecond/stulya/shkolnye/shkolnye1/stul1_yellow.png`,
  description: 'Эргономичный школьный стул со стойкой конструкцией, лёгким уходом и устойчивой посадкой для учебных классов.',
  material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
  size: '400x400x850',
  colors: [
    { name: 'Оранжевый', hex: '#FF6600', img: `/img/pagesecond/stulya/shkolnye/shkolnye1/stul2_orange.png` },
    { name: 'Желтый', hex: '#f1e72b', img: `/img/pagesecond/stulya/shkolnye/shkolnye1/stul1_yellow.png`},
    { name: 'Тёмно-зелёный', hex: '#1B4D3E', img: `/img/pagesecond/stulya/shkolnye/shkolnye1/stul4_green.png`},
    { name: 'Серый', hex: '#888888', img: `/img/pagesecond/stulya/shkolnye/shkolnye1/stul3_grey.png`},
  ],
  article: `L.Me-SH.UN`,
},
{
  id: 2,
  title: `ШКОЛЬНЫЙ СТУЛ 2`,
  img: `/img/pagesecond/stulya/shkolnye/shkolnye2/stul1_green.png`,
  description: 'Эргономичный школьный стул со стойкой конструкцией, лёгким уходом и устойчивой посадкой для учебных классов.',
  material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
  size: '400x400x850',
  colors: [
    { name: 'Оранжевый', hex: '#FF6600', img: `/img/pagesecond/stulya/shkolnye/shkolnye2/stul2_orange.png`},
    { name: 'Синий', hex: '#1c37d3', img: `/img/pagesecond/stulya/shkolnye/shkolnye2/stul3_blue.png`},
    { name: 'Зелёный', hex: '#1aa317', img: `/img/pagesecond/stulya/shkolnye/shkolnye2/stul1_green.png`},
    { name: 'Серый', hex: '#888888', img: `/img/pagesecond/stulya/shkolnye/shkolnye2/stul4_grey.png`},
  ],
  article: `L.Me-SH.UN`,
},
{
  id: 3,
  title: `ШКОЛЬНЫЙ СТУЛ 3`,
  img: `/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_grey.png`,
  description: 'Эргономичный школьный стул со стойкой конструкцией, лёгким уходом и устойчивой посадкой для учебных классов.',
  material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
  size: '400x400x850',
  colors: [
    { name: 'Оранжевый', hex: '#FF6600', img: `/img/pagesecond/stulya/shkolnye/shkolnye3/stul2_orange.png` },
    { name: 'Желтый', hex: '#f1e72b', img: `/img/pagesecond/stulya/shkolnye/shkolnye3/stul4_yellow.png`},
    { name: 'Зелёный', hex: '#1B4D3E', img: `/img/pagesecond/stulya/shkolnye/shkolnye3/stul3_green.png`},
    { name: 'Серый', hex: '#888888', img: `/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_grey.png`},
  ],
  article: `L.Me-SH.UN`,
},
{
  id: 4,
  title: `ШКОЛЬНЫЙ СТУЛ 4`,
  img: `/img/pagesecond/stulya/shkolnye/shkolnye3/stul1_brownish_grey.png`,
  description: 'Эргономичный школьный стул со стойкой конструкцией, лёгким уходом и устойчивой посадкой для учебных классов.',
  material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
  size: '400x400x850',
  colors: [
    { name: 'Коричнево-серый', hex: '#5d4839', img: `/img/pagesecond/stulya/shkolnye/shkolnye4/stul1_brownish_grey.png` },
    { name: 'Белый', hex: '#ffffff', img: `/img/pagesecond/stulya/shkolnye/shkolnye4/stul2_white.png`},
    { name: 'Черный', hex: '#000000', img: `/img/pagesecond/stulya/shkolnye/shkolnye4/stul3_black.png`},
    { name: 'Серый', hex: '#888888', img: `/img/pagesecond/stulya/shkolnye/shkolnye4/stul4_grey.png`},
  ],
  article: `L.Me-SH.UN`,
}
]
export default function Shkolnye() {
  return (
    <ProductList
      products={products}
      title="Школьные стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}