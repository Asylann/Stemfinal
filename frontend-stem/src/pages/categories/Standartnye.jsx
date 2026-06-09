import ProductList from '../../components/ProductList'
import './Category.css'

const products = [{
  id: 1,
  title: `СТАНДАРТНЫЙ ШКАФ 1`,
  img: `/img/pagesecond/shkafy/standartnye/shkaf1_standart.png`,
  description: 'Функциональный стандартный шкаф из качественных мебельных панелей с универсальным дизайном и прочной фурнитурой.',
  material: ['ДСП', 'МДФ', 'Фурнитура металлическая', 'Зеркальные вставки'],
  size: '1800x600x2200',
  colors: [
    { name: 'Синий', hex: '#1460d2', img: `/img/pagesecond/shkafy/standartnye/shkaf1_standart.png` },
    { name: 'Белый', hex: '#FFFFFF', img: `/img/pagesecond/shkafy/standartnye/shkaf1_white.png`},
    { name: 'Венге', hex: '#3B1F0A', img: `/img/pagesecond/shkafy/standartnye/shkaf1_dark.png`},
    { name: 'Дуб сонома', hex: '#e4bf8a', img: `/img/pagesecond/shkafy/standartnye/shkaf1_light.png`},
    { name: 'Черный', hex: '#000000', img: `/img/pagesecond/shkafy/standartnye/shkaf1_black.png`},
  ],
  article: `L.Me-SN.UN`,
}
]

export default function Standartnye() {
  return (
    <ProductList
      products={products}
      title="Стандартные шкафы"
      backPath="/secondpage/shkafy"
      backLabel="Шкафы"
    />
  )
}