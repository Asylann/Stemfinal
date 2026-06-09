import ProductList from '../../components/ProductList'
import './Category.css'

const products = [
  {
    id: 1,
    title: 'ПУФ 1',
    img: '/img/pagesecond/pufy/puf1/puf1_grey.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Красный', hex: '#95291A', img: '/img/pagesecond/pufy/puf1/puf1_red.jpeg'},
      { name: 'Коричневый', hex: '#5D3327', img: '/img/pagesecond/pufy/puf1/puf1_brown.jpeg'},
      { name: 'Тёмно-зелёный', hex: '#1B4D3E', img: '/img/pagesecond/pufy/puf1/puf1_dark_green.jpeg'},
      { name: 'Серый', hex: '#888888', img: '/img/pagesecond/pufy/puf1/puf1_grey.png'},
      { name: 'Темно-синий', hex: '#00008B', img: '/img/pagesecond/pufy/puf1/puf1_dark_blue.jpeg'},
      { name: 'Темный хаки', hex: '#756340', img: '/img/pagesecond/pufy/puf1/puf1_dark_khaki.jpeg'},
    ],
    article: 'L.Me-PF.UN.600',
  },
  {
    id: 2,
    title: 'ПУФ 2',
    img: '/img/pagesecond/pufy/puf2/puf2_pine_green.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      {name: "Темно-красный", hex: "#95291A", img: "/img/pagesecond/pufy/puf2/puf2_dark_red.jpeg"},
      {name: "Темно-коричневый",hex: "#5D3327", img: "/img/pagesecond/pufy/puf2/puf2_dark_brown.jpeg"},
      {name: "Мутно-коричневый", hex: "#846A49", img: "/img/pagesecond/pufy/puf2/puf2_muted_brown.jpeg"},
      {name: "Темно-синий", hex: "#00008B", img: "/img/pagesecond/pufy/puf2/puf2_dark_blue.jpeg"},
      {name: "Серый", hex: "#8A8A8A", img: "/img/pagesecond/pufy/puf2/puf2_grey.jpeg"},
      {name: "Хвойно-зеленый", hex: "#1B4D42", img: "/img/pagesecond/pufy/puf2/puf2_pine_green.png"}
    ],
    article: 'L.Me-PF.UN.600',
  },
  {
    id: 3,
    title: 'ПУФ 3',
    img: '/img/pagesecond/pufy/puf3/.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      {name: "Желто-зеленый", hex: "#CED097", img: "/img/pagesecond/pufy/puf3/divan6_yellowish-green.jpeg"},
      {name: "Темно-синий",hex: "#00008B", img: "/img/pagesecond/pufy/puf3/divan6_dark_blue.jpeg"},
      {name: "Темно-зеленый", hex: "#2E5E39", img: "/img/pagesecond/pufy/puf3/divan6_hunter_green.jpeg"},
      {name: "Темно-коричневый", hex: "#654321", img: "/img/pagesecond/pufy/puf3/divan6_dark_brown.jpeg"},
      {name: "Серый", hex: "#8A8A8A", img: "/img/pagesecond/pufy/puf3/divan6_grey.jpeg"},
      {name: "Красный", hex: "#FF0000", img: "/img/pagesecond/pufy/puf3/divan6_red.jpeg"},
      {name: "Золотисто-коричневый", hex: "#B67A2D", img: "/img/pagesecond/pufy/puf3/puf3_golden_brown.png"},
    ],
    article: 'L.Me-PF.UN.600',
  },
  {
    id: 4,
    title: 'ПУФ 4',
    img: '/img/pagesecond/pufy/puf4/puf4_blue.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Голубой', hex: '#00aaff', img: '/img/pagesecond/pufy/puf4/puf4_blue.png'},
      { name: 'Коричневый', hex: '#964B00', img: '/img/pagesecond/pufy/puf4/puf4_brown.jpeg'},
      { name: 'Латунный', hex: '#A99661 ', img: '/img/pagesecond/pufy/puf4/puf4_brass.jpeg'},
      { name: 'Серый', hex: '#888888', img: '/img/pagesecond/pufy/puf4/puf4_grey.jpeg'},
      { name: 'Хвойно-зеленый', hex: '#1B4D42', img: '/img/pagesecond/pufy/puf4/puf4_pine_green.jpeg'},
      { name: 'Красный', hex: '#d80606f3', img: '/img/pagesecond/pufy/puf4/puf4_red.jpeg'},
    ],
    article: 'L.Me-PF.UN.600',
  },
  {
    id: 5,
    title: 'ПУФ 5',
    img: '/img/pagesecond/pufy/puf5/puf5.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    article: 'L.Me-PF.UN.600',
  },
  {
    id: 6,
    title: 'ПУФ 6',
    img: '/img/pagesecond/pufy/puf6/puf6_white.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Белый', hex: '#ffffff', img: '/img/pagesecond/pufy/puf6/puf6_white.png'},
      { name: 'Коричневый', hex: '#964B00', img: '/img/pagesecond/pufy/puf6/puf6_brown.jpeg'},
      { name: 'Синий', hex: '#0f48e6 ', img: '/img/pagesecond/pufy/puf6/puf6_blue.jpeg'},
      { name: 'Серый', hex: '#888888', img: '/img/pagesecond/pufy/puf6/puf6_grey.jpeg'},
      { name: 'Хвойно-зеленый', hex: '#1B4D42', img: '/img/pagesecond/pufy/puf6/puf6_green.jpeg'},
      { name: 'Красный', hex: '#d80606f3', img: '/img/pagesecond/pufy/puf6/puf6_red.jpeg'},
      { name: 'Темный хаки', hex: '#756340', img: '/img/pagesecond/pufy/puf6/puf6_dark_haki.jpeg'},
    ],
    article: 'L.Me-PF.UN.600',
  },
  {
    id: 7,
    title: 'ПУФ 7',
    img: '/img/pagesecond/pufy/puf7/puf7_grey.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Коричневый', hex: '#964B00', img: '/img/pagesecond/pufy/puf7/puf7_brown.jpeg'},
      { name: 'Синий', hex: '#0f48e6 ', img: '/img/pagesecond/pufy/puf7/puf7_blue.jpeg'},
      { name: 'Серый', hex: '#888888', img: '/img/pagesecond/pufy/puf7/puf7_grey.png'},
      { name: 'Хвойно-зеленый', hex: '#1B4D42', img: '/img/pagesecond/pufy/puf7/puf7_green.jpeg'},
      { name: 'Красный', hex: '#d80606f3', img: '/img/pagesecond/pufy/puf7/puf7_red.jpeg'},
      { name: 'Темный хаки', hex: '#756340', img: '/img/pagesecond/pufy/puf7/puf7_dark_haki.jpeg'},
    ],
    article: 'L.Me-PF.UN.600',
  },
  {
    id: 8,
    title: 'ПУФ 8',
    img: '/img/pagesecond/pufy/puf8/puf8.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    article: 'L.Me-PF.UN.600',
  },
]

export default function Pufy() {
  return (
    <ProductList
      products={products}
      title="Пуфы"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}