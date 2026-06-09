import ProductList from '../../components/ProductList'

const products = [
  {
    id: 'reception-1',
    title: 'РЕСЕПШЕН 1',
    imgs: ['/img/pagesecond/stoly/reception/item1.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'Ножки из пластмасса'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-STO.RS.001',
  },
  {
    id: 'reception-2',
    title: 'РЕСЕПШЕН 2',
    imgs: ['/img/pagesecond/stoly/reception/item2.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'Ножки из пластмасса'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-STO.RS.002',
  },
  {
    id: 'reception-3',
    title: 'РЕСЕПШЕН 3',
    imgs: ['/img/pagesecond/stoly/reception/item3.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'МДР', 'Металл', 'Ножки из пластмасса'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-STO.RS.003',
  },
]

export default function Reception() {
  return (
    <ProductList
      products={products}
      title="Мебель | Столы | Ресепшен"
      backPath="/secondpage/stoly"
      backLabel="Столы"
    />
  )
}