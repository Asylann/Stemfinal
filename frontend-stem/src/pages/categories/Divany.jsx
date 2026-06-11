import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import '../categories/Category.css'

const STATIC_PRODUCTS = [
  {
    id: 1,
    title: 'ДИВАН 1',
    imgs: ['/img/pagesecond/divany/divan1/divan1_light_gray_fabric.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      {name: 'Светло серый', hex: '#D3D3D3', img: '/img/pagesecond/divany/divan1/divan1_light_gray_fabric.png'},
      {name: 'Бежевый', hex: '#B89A72', img: '/img/pagesecond/divany/divan1/divan1_beige.jpeg'},
      {name: 'Темно зеленый', hex: '#1E3B2F', img: '/img/pagesecond/divany/divan1/divan1_dark_green.jpeg'},
      {name: 'Теплый, жженый оранжевый', hex: '#A94F2B', img: '/img/pagesecond/divany/divan1/divan1_warm_burnt_orange.jpeg'}
    ],
    article: 'L.Me-DI.UN.2500',
    in_stock: true
  },
  {
    id: 2,
    title: 'ДИВАН 2',
    imgs: ['/img/pagesecond/divany/divan2/divan2_deep_teal_blue.png'],
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      {"name": "Глубоко, бирюзовый синий", "hex": "#1F5A70", "img": "/img/pagesecond/divany/divan2/divan2_deep_teal_blue.png"},
      {"name": "Теплый, средне оранжевый", "hex": "#D97A2B", "img": "/img/pagesecond/divany/divan2/divan2_warm_medium_orange.jpeg"},
      {"name": "Светло коричневый", "hex": "#B89472", "img": "/img/pagesecond/divany/divan2/divan2_light_brown.jpeg"},
      {"name": "Темно зеленый", "hex": "#1E3B2F", "img": "/img/pagesecond/divany/divan2/divan2_dark_green.jpeg"},
      {"name": "Средне серый", "hex": "#8A8A8A", "img": "/img/pagesecond/divany/divan2/divan2_medium_grey.jpeg"}
    ],
    article: 'L.Me-DI.UN.2500',
  },
  {
    id: 3,
    title: 'ДИВАН 3',
    imgs: ['/img/pagesecond/divany/divan3/divan3_light_beige.png'],
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      {"name": "Светло бежевый", "hex": "#C8B8A8", "img": "/img/pagesecond/divany/divan3/divan3_light_beige.png"},
      {"name": "Мягко, средне серый", "hex": "#8A8F94", "img": "/img/pagesecond/divany/divan3/divan3_soft_medium_grey.jpeg"},
      {"name": "Темно зеленый", "hex": "#1E3B2F", "img": "/img/pagesecond/divany/divan3/divan3_dark_green.jpeg"},
      {"name": "Горчично желтый", "hex": "#D38B2F", "img": "/img/pagesecond/divany/divan3/divan3_mustard_yellow.jpeg"},
    ],
    article: 'L.Me-DI.UN.2500',
  },
  {
    id: 4,
    title: 'ДИВАН 4',
    imgs: ['/img/pagesecond/divany/divan4/divan4_warm_yellow-orange.png'],
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      {name: "Тепло, желто оранжевый", hex: "#F4B63A", img: "/img/pagesecond/divany/divan4/divan4_warm_yellow-orange.png"},
      {name: "Теплый средне оранжевый", hex: "#D97A2B", img: "/img/pagesecond/divany/divan4/divan4_warm_medium_orange.jpeg"},
      {name: "Светло коричневый", hex: "#B89472", img: "/img/pagesecond/divany/divan4/divan4_light_brown.jpeg"},
      {name: "Темно зеленый", hex: "#1E3B2F", img: "/img/pagesecond/divany/divan4/divan4_dark_green.jpeg"},
      {name: "Средне серый", hex: "#8A8A8A", img: "/img/pagesecond/divany/divan4/divan4_medium_grey.jpeg"}
    ],
    article: 'L.Me-DI.UN.2500',
  },
  {
    id: 5,
    title: 'ДИВАН 5',
    imgs: ['/img/pagesecond/divany/divan5/divan5_light_grayish-blue.png'],
    description: 'Каркас: брус, фанера, дсп Наполнение: ППУ синтепон Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['Синтепон', 'Мягкая поверхность', 'Велкор', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    colors: [
      {name: "Глубоко бирюзовый синий", hex: "#9DBCD4", img: "/img/pagesecond/divany/divan5/divan5_light_grayish-blue.png"},
      {name: "Теплый средне оранжевый", hex: "#B75E2A", img: "/img/pagesecond/divany/divan5/divan5_warm_burnt_orange.jpeg"},
      {name: "Светло коричневый", hex: "#B89A76", img: "/img/pagesecond/divany/divan5/divan5_light_beige.jpeg"},
      {name: "Темно зеленый", hex: "#1E3B2F", img: "/img/pagesecond/divany/divan5/divan5_dark_green.jpeg"}
    ],
    article: 'L.Me-DI.UN.2500',
  },
]

export default function Divany() {
  const { products, loading } = useCategoryProducts('divany', STATIC_PRODUCTS)
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Диваны"
      backPath="/secondpage"
      backLabel="Мебель"
    />
  )
}