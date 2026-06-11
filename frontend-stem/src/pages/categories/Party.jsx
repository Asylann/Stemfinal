import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'

const STATIC_PRODUCTS = [
  {
    id: 'party-1',
    title: 'ПАРТА 1',
    imgs: ['/img/pagesecond/stoly/party/item1.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'Металл', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-ST.PA.001',
  },
  {
    id: 'party-2',
    title: 'ПАРТА 2',
    imgs: ['/img/pagesecond/stoly/party/item2.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'МДФ', 'Металл', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-ST.PA.002',
  },
  {
    id: 'party-3',
    title: 'ПАРТА 3',
    imgs: ['/img/pagesecond/stoly/party/item3.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'МДФ', 'Металл', 'Пластмасса'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-ST.PA.003',
  },
  {
    id: 'party-4',
    title: 'ПАРТА 4',
    imgs: ['/img/pagesecond/stoly/party/item4.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'МДФ', 'Металл', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-ST.PA.004',
  },
  {
    id: 'party-5',
    title: 'ПАРТА 5',
    imgs: ['/img/pagesecond/stoly/party/item5.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'МДФ', 'Металл', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-ST.PA.005',
  },
  {
    id: 'party-6',
    title: 'ПАРТА 6',
    imgs: ['/img/pagesecond/stoly/party/item6.png'],
    description: 'Каркас: брус, фанера, дсп. Наполнение: ППУ синтепон. Ткань: велюр, микро велюр, рогожка, экокожа, кожзам.',
    material: ['ЛДСП', 'МДФ', 'Металл', 'Пластмассовые ножки'],
    size: 'По согласованию с заказчиком',
    article: 'S.Me-ST.PA.006',
  },
]

export default function Party() {
  const { products, loading } = useCategoryProducts('party', STATIC_PRODUCTS)
  return (
    <ProductList
      products={products}
      loading={loading}
      title="Party стулья"
      backPath="/secondpage/stulya"
      backLabel="Стулья"
    />
  )
}
