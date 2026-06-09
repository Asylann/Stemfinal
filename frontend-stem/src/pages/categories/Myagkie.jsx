import ProductList from '../../components/ProductList'
import './Category.css'

const products = [
  {
    id: 1,
    title: 'МЯГКИЙ СТУЛ 1',
    img: '/img/pagesecond/stulya/myagkie/myagkie/stul8.png',
    description: 'Мягкий и комфортный стул с плотной обивкой и надёжным основанием, идеально подходящий для длительного сидения и уютных интерьеров.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '450x450x900',
    colors: [
      { name: 'Оранжевый', hex: '#FF6600', img: '/img/pagesecond/stulya/myagkie/myagkie/stul8 (1).png'},
      { name: 'Синий', hex: '#7095cd', img: '/img/pagesecond/stulya/myagkie/myagkie/stul8 (2).png' },
      { name: 'Светло-зеленый', hex: '#528172', img: '/img/pagesecond/stulya/myagkie/myagkie/stul8.png' },
      { name: 'Серый', hex: '#888888', img: '/img/pagesecond/stulya/myagkie/myagkie/stul8 (3).png' },
    ],
    article: 'L.Me-MY.UN.450',
  },
  {
    id: 2,
    title: 'МЯГКИЙ СТУЛ 2',
    img: '/img/pagesecond/stulya/myagkie/myagkie2/stul9_grey.png',
    description: 'Мягкий и комфортный стул с плотной обивкой и надёжным основанием, идеально подходящий для длительного сидения и уютных интерьеров.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '450x450x900',
    colors: [
      { name: 'Серый', hex: '#a19e9c', img: '/img/pagesecond/stulya/myagkie/myagkie2/stul9_grey.png'},
      { name: 'Мутно-коричневый', hex: '#af863b', img: '/img/pagesecond/stulya/myagkie/myagkie2/kreslo9_muted_brown.png' },
      { name: 'Черный', hex: '#000000', img: '/img/pagesecond/stulya/myagkie/myagkie2/kreslo9_black.png' },
      { name: 'Белый', hex: '#ffffff', img: '/img/pagesecond/stulya/myagkie/myagkie2/kreslo9_vanilla_cream.png' },
    ],
    article: 'L.Me-MY.UN.451',
  },
  {
    id: 3,
    title: 'МЯГКИЙ СТУЛ 3',
    img: '/img/pagesecond/stulya/myagkie/myagkie3/stul7.png',
    description: 'Мягкий и комфортный стул с плотной обивкой и надёжным основанием, идеально подходящий для длительного сидения и уютных интерьеров.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '450x450x900',
    colors: [
      { name: 'Красный', hex: '#c81c1c', img: '/img/pagesecond/stulya/myagkie/myagkie3/stul7 (2).png' },
      { name: 'Желтый', hex: '#f3e706', img: '/img/pagesecond/stulya/myagkie/myagkie3/stul7 (3).png' },
      { name: 'Светло-зелёный', hex: '#256552', img: '/img/pagesecond/stulya/myagkie/myagkie3/stul7 (1).png' },
      { name: 'Серый', hex: '#888888', img: '/img/pagesecond/stulya/myagkie/myagkie3/stul7.png'},
    ],
    article: 'L.Me-MY.UN.452',
  },
]

export default function Myagkie() {
  return (
    <ProductList
      products={products}
      title="Мягкие стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}