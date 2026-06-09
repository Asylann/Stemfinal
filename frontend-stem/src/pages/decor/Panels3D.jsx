import ProductList from '../../components/ProductList'
import './Panels3D.css'

const products = [
  {
    id: 1,
    title: 'РЕЕЧНЫЙ',
    img: '/img/pagedecor/3dpanels/reechny.png',
    description: 'Реечные стеновые панели идеально подходят для обшивки фасадов на улице. Также они гармонично выглядят внутри интерьера и используются для обшивки стен и потолков внутри квартир, частных домов, бизнес центров и коммерческих помещений.',
    material: ['Гипс'],
    size: '600х600',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 2,
    title: 'РЕЛЬЕФНЫЕ',
    img: '/img/pagedecor/3dpanels/relefny.png',
    description: 'Декоративный отделочный материал, имеющий объемный рисунок на поверхности, который создает игру света и тени, преображает интерьер, улучшает акустику и теплоизоляцию стен.',
    material: ['Гипс'],
    size: '600х600',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 3,
    title: 'ЛИНЕЙНЫЕ',
    img: '/img/pagedecor/3dpanels/lineyny.png',
    description: 'Настенные панели, добавляющие объем и выразительность интерьеру. Идеальны для зонирования пространства или создания акцентов. Полиуретановая основа обеспечивает прочность и влагостойкость.',
    material: ['Гипс'],
    size: '600х600',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 4,
    title: 'ВОЛНИСТЫЙ',
    img: '/img/pagedecor/3dpanels/volnisty.png',
    description: 'Настенные панели, добавляющие объем и выразительность интерьеру. Идеальны для зонирования пространства или создания акцентов. Полиуретановая основа обеспечивает прочность и влагостойкость.',
    material: ['Гипс'],
    size: '600х600',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 5,
    title: 'УЗОРЧАТЫЕ',
    img: '/img/pagedecor/3dpanels/uzorchaty.png',
    description: 'Настенные панели, добавляющие объем и выразительность интерьеру. Идеальны для зонирования пространства или создания акцентов. Полиуретановая основа обеспечивает прочность и влагостойкость.',
    material: ['Гипс'],
    size: '600х600',
    article: 'S.Me-ST.S.DP',
  },
  {
    id: 6,
    title: 'ФИГУРНЫЕ',
    img: '/img/pagedecor/3dpanels/figurny.png',
    description: 'Настенные панели, добавляющие объем и выразительность интерьеру. Идеальны для зонирования пространства или создания акцентов. Полиуретановая основа обеспечивает прочность и влагостойкость.',
    material: ['Гипс'],
    size: '600х600',
    article: 'S.Me-ST.S.DP',
  },
]

export default function Panels3D() {
  return (
    <ProductList
      products={products}
      title="3D Панели"
      backPath="/decor"
      backLabel="Декор"
    />
  )
}