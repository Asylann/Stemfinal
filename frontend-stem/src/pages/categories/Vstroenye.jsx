import ProductList from '../../components/ProductList'
import './Category.css'

const products = [{
  id: 1,
  title: `ВСТРОЕННЫЙ ШКАФ 1`,
  img: `/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf1.png`,
  description: 'Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора. Внутреннее пространство организовано удобно - есть отделения для одежды, обуви и аксессуаров.',
  material: ['ДСП', 'МДФ', 'Фурнитура металлическая', 'Зеркальные вставки'],
  size: '2000x600x2400',
  colors: [
    { name: 'Белый', hex: '#FFFFFF', img: `/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf1.png`},
    { name: 'Венге', hex: '#9d5116', img: `/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf2.png`},
    { name: 'Дуб сонома', hex: '#C8A97E', img: `/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf3.png`},
    { name: 'Черный', hex: '#000000', img: `/img/pagesecond/shkafy/vstroenye/shkaf1/shkaf4.png`},
  ],
  article: `L.Me-VS.UN`,
},
{
  id: 2,
  title: `ВСТРОЕННЫЙ ШКАФ 2`,
  img: `/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf1.png`,
  description: 'Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора. Внутреннее пространство организовано удобно - есть отделения для одежды, обуви и аксессуаров.',
  material: ['ДСП', 'МДФ', 'Фурнитура металлическая', 'Зеркальные вставки'],
  size: '2000x600x2400',
  colors: [
    { name: 'Берюзовый', hex: '#2c8360', img: `/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf1.png`},
    { name: 'Дуб сонома', hex: '#C8A97E', img: `/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf2.png`},
    { name: 'Венге', hex: '#9d5116', img: `/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf4.png`},
    { name: 'Черный', hex: '#000000', img: `/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf3.png`},
    { name: 'Белый', hex: '#ffffff', img: `/img/pagesecond/shkafy/vstroenye/shkaf2/shkaf5.png`},
  ],
  article: `L.Me-VS.UN`,
},
{
  id: 3,
  title: `ВСТРОЕННЫЙ ШКАФ 3`,
  img: `/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf1.png`,
  description: 'Компактная модель для небольших помещений. Идеально подходит для прихожей, спальни или коридора. Внутреннее пространство организовано удобно - есть отделения для одежды, обуви и аксессуаров.',
  material: ['ДСП', 'МДФ', 'Фурнитура металлическая', 'Зеркальные вставки'],
  size: '2000x600x2400',
  colors: [
    { name: 'Белый', hex: '#FFFFFF', img: `/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf1.png`},
    { name: 'Венге', hex: '#9d5116', img: `/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf2.png`},
    { name: 'Дуб сонома', hex: '#C8A97E', img: `/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf3.png`},
    { name: 'Черный', hex: '#000000', img: `/img/pagesecond/shkafy/vstroenye/shkaf3/shkaf4.png`},
  ],
  article: `L.Me-VS.UN`,
}]

export default function Vstroenye() {
  return (
    <ProductList
      products={products}
      title="Встроенные шкафы"
      backPath="/secondpage/shkafy"
      backLabel="Шкафы"
    />
  )
}