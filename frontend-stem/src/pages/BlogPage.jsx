import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

const POSTS = [
  {
    id: 1,
    date: '12 мая 2025',
    category: 'Обзор продукции',
    title: 'Как оснастить STEM-лабораторию под ключ',
    excerpt: 'Рассказываем о комплексном подходе к оснащению учебных лабораторий: от дизайн-проекта до выбора оборудования. Делимся опытом реализованных проектов.',
    img: '/img/pagefirst/room.png',
  },
  {
    id: 2,
    date: '3 мая 2025',
    category: 'Электроника',
    title: 'Интерактивные панели в образовании: обзор 2025',
    excerpt: 'Сравниваем актуальные модели интерактивных панелей для школ и вузов. Что выбрать в 2025 году? Разбираем характеристики, преимущества и недостатки.',
    img: '/img/pagethird/comp.png',
  },
  {
    id: 3,
    date: '25 апреля 2025',
    category: 'Мебель',
    title: 'Мебель для учебных классов: тренды и стандарты',
    excerpt: 'Современные тенденции в дизайне учебного пространства. Требования к мебели для образовательных учреждений согласно действующим нормам СанПиН.',
    img: '/img/pagesecond/bb20aa.png',
  },
  {
    id: 4,
    date: '18 апреля 2025',
    category: 'Цифровые продукты',
    title: 'Roqed Science: опыт использования в казахстанских школах',
    excerpt: 'Учителя физики, химии и биологии делятся опытом работы с платформой Roqed Science. Как цифровые лаборатории меняют подход к преподаванию точных наук.',
    img: '/img/pagefirst/Слой1.png',
  },
  {
    id: 5,
    date: '10 апреля 2025',
    category: 'Новости компании',
    title: 'STEM Academia открывает новый склад в Алматы',
    excerpt: 'С мая 2025 года мы начинаем обслуживание клиентов в Алматы напрямую со склада. Сроки доставки по югу Казахстана сократятся до 1–2 рабочих дней.',
    img: '/img/pagefirst/plant.png',
  },
  {
    id: 6,
    date: '2 апреля 2025',
    category: 'Оборудование',
    title: 'Arduino и LEGO в STEM-образовании: с чего начать',
    excerpt: 'Практическое руководство по интеграции Arduino и LEGO SPIKE в учебный процесс. Примеры проектов, которые можно реализовать уже с первого занятия.',
    img: '/img/equipment/arduino.png',
  },
]

export default function BlogPage() {
  const { t } = useLang()

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.blog_title}
      </div>

      <div className="info-hero">
        <h1>{t.blog_title}</h1>
        <p>{t.blog_intro}</p>
      </div>

      <div className="info-body">
        <section className="info-section">
          <h2>Все публикации</h2>
          <div className="blog-grid">
            {POSTS.map(post => (
              <div key={post.id} className="blog-card">
                <div className="blog-card__img">
                  <img src={post.img} alt={post.title} />
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span className="blog-card__date">{post.date}</span>
                    <span className="blog-card__category">{post.category}</span>
                  </div>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <span className="blog-card__link">{t.blog_read_more} →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="info-cta-block">
          <h2>Подпишитесь на новости</h2>
          <p>Первыми узнавайте о новых продуктах, акциях и полезных материалах от STEM Academia</p>
          <Link to="/contacts" className="info-cta-btn">Связаться с нами</Link>
        </div>
      </div>
    </div>
  )
}
