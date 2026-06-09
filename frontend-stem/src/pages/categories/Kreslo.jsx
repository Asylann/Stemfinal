import ProductList from '../../components/ProductList'
import '../categories/Category.css'

const products = [
  {
    id: 1,
    title: 'КРЕСЛО 1',
    img: '/img/pagesecond/kreslo/kreslo1/kreslo1_dark_green.png',
    description: 'Каркас: стеклопластик, Ткань: велюр, микро велюр, рогожка.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'Ширина 94 см, Высота 120 см, Глубина 87 см',
    colors: [
      { name: 'Оранжевый', hex: '#B5522E', img: "/img/pagesecond/kreslo/kreslo1/kreslo1_burnt_orange.jpeg" },
      { name: 'Черный', hex: '#1C1C1C', img: "/img/pagesecond/kreslo/kreslo1/kreslo1_black.jpeg" },
      { name: 'Тёмно-зелёный', hex: '#1B4D3E', img: "/img/pagesecond/kreslo/kreslo1/kreslo1_dark_green.png"},
      { name: 'Белый', hex: '#FFFFFF', img: "/img/pagesecond/kreslo/kreslo1/kreslo1_white.jpeg" },
    ],
    article: 'L.Me-KR.UN.900',
  },
  {
    id: 2,
    title: 'КРЕСЛО 2',
    img: '/img/pagesecond/kreslo/kreslo2/kreslo2_rust.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Коричневый', hex: '#b24d1d', img: '/img/pagesecond/kreslo/kreslo2/kreslo2_rust.png'},
      { name: 'Темно-синий', hex: '#191970', img: '/img/pagesecond/kreslo/kreslo2/kreslo2_midnight_blue.jpeg'},
      { name: 'Тёмно-зелёный', hex: '#1B4D3E', img: '/img/pagesecond/kreslo/kreslo2/kreslo2_dark_forest_green.jpeg'},
      { name: 'Темно-красный', hex: '#8B0000', img: '/img/pagesecond/kreslo/kreslo2/kreslo2_dark_red.jpeg'},
      { name: 'Ванильно-кремовый', hex: '#FCFBF4', img: '/img/pagesecond/kreslo/kreslo2/kreslo2_vanilla_cream.jpeg'},
    ],
    article: 'L.Me-KR.UN.900',
  },
  {
    id: 3,
    title: 'КРЕСЛО 3',
    img: '/img/pagesecond/kreslo/kreslo3/kreslo3_arsenic.png',
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      { name: 'Темно-серый', hex: '#3B444B', img: '/img/pagesecond/kreslo/kreslo3/kreslo3_arsenic.png'},
      { name: 'Белый', hex: '#F2F1EC', img: '/img/pagesecond/kreslo/kreslo3/kreslo3_soft_beige.jpeg'},
      { name: 'Тёмно-зелёный', hex: '#014421', img: '/img/pagesecond/kreslo/kreslo3/kreslo3_deep_forest_green.jpeg'},
      { name: 'Темно-оранжевый', hex: '#C25A3C', img: '/img/pagesecond/kreslo/kreslo3/kreslo3_orange_rust.jpeg'},
      { name: 'Ванильно-кремовый', hex: '#000000', img: '/img/pagesecond/kreslo/kreslo3/kreslo3_black.jpeg'},
    ],
    article: 'L.Me-KR.UN.900',
  },
  {
    id: 4,
    title: 'КРЕСЛО 4',
    img: '/img/pagesecond/kreslo/kreslo4/kreslo4_red_brown.png',
    description: 'Вращающееся сиденье, регулируемое по высоте. Каркас из мультиплекса. Наполнитель из пенополиуретана.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'Ширина: 62 см, Высота: 71-80 см, Глубина: 63 см',
    colors: [
      { name: 'Коричневый', hex: '#A8553F', img: '/img/pagesecond/kreslo/kreslo4/kreslo4_red_brown.png'},
      { name: 'Черный', hex: '#000000', img: '/img/pagesecond/kreslo/kreslo4/kreslo4_black.jpeg'},
      { name: 'Зелёный', hex: '#4B5320', img: '/img/pagesecond/kreslo/kreslo4/kreslo4_army_green.jpeg'},
      { name: 'Светло-серый', hex: '#E5E5E3', img: '/img/pagesecond/kreslo/kreslo4/kreslo4_platinum.jpeg'},
    ],
    article: 'L.Me-KR.UN.900',
  },
  {
    id: 5,
    title: 'КРЕСЛО 5',
    img: '/img/pagesecond/kreslo/kreslo5/kreslo5_dark_green.png',
    description: 'Материал: Ткань, Металл, Пластик. Ножка из металла с эпоксидным покрытием.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'Длина 68.5 см, Ширина 68.5 см, Высота 104.5-115.5 см',
    colors: [
      { name: 'Темно-зеленый', hex: '#445E4D', img: '/img/pagesecond/kreslo/kreslo5/kreslo5_dark_green.png'},
      { name: 'Темно-синий', hex: '#2D4F93', img: '/img/pagesecond/kreslo/kreslo5/kreslo5_dark_blue.jpeg'},
      { name: 'Оранжевый', hex: '#BE5103', img: '/img/pagesecond/kreslo/kreslo5/kreslo5_burnt_orange.jpeg'},
      { name: 'Темно-красный', hex: '#A01E22', img: '/img/pagesecond/kreslo/kreslo5/kreslo5_deep_red.jpeg'},
      { name: 'Белый', hex: '#FFFFFF', img: '/img/pagesecond/kreslo/kreslo5/kreslo5_white.jpeg'},
    ],
    article: 'L.Me-KR.UN.900',
  },
  {
    id: 6,
    title: 'КРЕСЛО 6',
    img: '/img/pagesecond/kreslo/kreslo6/kreslo6.png',
    description: 'Материал спинки: сетка. Материал сиденья: ткань, сетка. Механизм качания: мультиблок.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'Высота кресла 105-116 см, Высота опоры 45 см',
    article: 'L.Me-KR.UN.900',
  },
  {
    id: 7,
    title: 'КРЕСЛО 7',
    img: '/img/pagesecond/kreslo/kreslo7/kreslo7_light_brown.png',
    description: 'Крестовина и подлокотники — хром. Обивка: экокожа. Максимальная нагрузка: 120 кг.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'Высота 106 см, Ширина 42 см, Глубина 46 см',
    colors: [
      { name: 'Светло-коричневый', hex: '#C5B39A', img: '/img/pagesecond/kreslo/kreslo7/kreslo7_light_brown.png'},
      { name: 'Черный', hex: '#000000', img: '/img/pagesecond/kreslo/kreslo7/kreslo7_black.jpeg'},
      { name: 'Тёмно-зелёный', hex: '#1B4D3E', img: '/img/pagesecond/kreslo/kreslo7/kreslo7_dark_green.jpeg'},
      { name: 'Оранжевый', hex: '#BE5103', img: '/img/pagesecond/kreslo/kreslo7/kreslo7_orange.jpeg'},
      { name: 'Белый', hex: '#FFFFFF', img: '/img/pagesecond/kreslo/kreslo7/kreslo7_white.jpeg'},
    ],
    article: 'L.Me-KR.UN.900',
  },
  {
    id: 8,
    title: 'КРЕСЛО 8',
    img: '/img/pagesecond/kreslo/kreslo8/kreslo8_black.png',
    description: 'Комфортное кресло с регулировкой и мягкой обивкой, созданное для работы и отдыха с удобной посадкой.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: '900x850x450',
    colors: [
      { name: 'Черный', hex: '#000000', img: '/img/pagesecond/kreslo/kreslo8/kreslo8_black.jpeg'},
      { name: 'Тёмно-зелёный', hex: '#1B4D3E', img: '/img/pagesecond/kreslo/kreslo8/kreslo8_dark_green.jpeg'},
      { name: 'Белый', hex: '#FFFFFF', img: '/img/pagesecond/kreslo/kreslo8/kreslo8_white.jpeg'},
    ],
    article: 'L.Me-KR.UN.900',
  },
]

export default function Kreslo() {
  return (
    <ProductList
      products={products}
      title="Кресла"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}