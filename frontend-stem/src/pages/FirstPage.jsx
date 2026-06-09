import { Link } from 'react-router-dom'
import './FirstPage.css'
import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import { useLang } from '../i18n/LanguageContext'

const ADVANTAGES = [
  { icon: '🏭', key: 'adv_1' },
  { icon: '✅', key: 'adv_2' },
  { icon: '📦', key: 'adv_3' },
  { icon: '🚚', key: 'adv_4' },
  { icon: '🛡️', key: 'adv_5' },
  { icon: '🔧', key: 'adv_6' },
]

const BLOG_POSTS = [
  {
    id: 1,
    date: '12 мая 2025',
    title: 'Как оснастить STEM-лабораторию под ключ',
    excerpt: 'Рассказываем о комплексном подходе к оснащению учебных лабораторий: от дизайн-проекта до выбора оборудования.',
    img: '/img/pagefirst/room.png',
    path: '/blog',
  },
  {
    id: 2,
    date: '3 мая 2025',
    title: 'Интерактивные панели в образовании: обзор 2025',
    excerpt: 'Сравниваем актуальные модели интерактивных панелей для школ и вузов. Что выбрать в 2025 году?',
    img: '/img/pagethird/comp.png',
    path: '/blog',
  },
  {
    id: 3,
    date: '25 апреля 2025',
    title: 'Мебель для учебных классов: тренды и стандарты',
    excerpt: 'Разбираем современные тенденции в дизайне учебного пространства и требования к мебели для образовательных учреждений.',
    img: '/img/pagesecond/bb20aa.png',
    path: '/blog',
  },
]

const INSTRUCTIONS = [
  { icon: '📋', title: 'Руководство по выбору мебели', desc: 'Как подобрать мебель под конкретный учебный кабинет', path: '/instructions' },
  { icon: '🖥️', title: 'Подключение интерактивных панелей', desc: 'Пошаговая инструкция по установке и настройке', path: '/instructions' },
  { icon: '🧪', title: 'Оснащение лабораторий', desc: 'Комплектация STEM-лабораторий — с чего начать', path: '/instructions' },
]

export default function FirstPage() {
  const { t } = useLang()

  return (
    <div className="page">
      {/* Hero и категории */}
      <HeroSlider />
      <CategoryGrid />

      {/* Breadcrumb */}
      <div className="breadcrumb">{t.design_breadcrumb}</div>

      {/* Пакеты дизайна */}
      <main className="packages">
        {/* STANDARD */}
        <div className="package package--s">
          <div className="package__content">
            <h2 className="package__title">Standard</h2>
            <p className="package__desc">{t.pkg_s_desc}</p>
            <ul className="package__list">
              {t.pkg_s_items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <img src="/img/pagefirst/Слой1.png" alt="Стул" className="package__img" />
          <div className="package__price">90 000 ₸</div>
        </div>

        {/* COMFORT */}
        <div className="package package--m">
          <div className="package__content">
            <h2 className="package__title">Comfort</h2>
            <p className="package__desc">{t.pkg_m_desc}</p>
            <ul className="package__list">
              {t.pkg_m_items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <img src="/img/pagefirst/plant.png" alt="Растение" className="package__img" />
          <div className="package__price">130 000 ₸</div>
        </div>

        {/* PREMIUM */}
        <div className="package package--l">
          <div className="package__content">
            <h2 className="package__title">Premium</h2>
            <p className="package__desc">{t.pkg_l_desc}</p>
            <ul className="package__list">
              {t.pkg_l_items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <img src="/img/pagefirst/F5.png" alt="Кресло" className="package__img" />
          <div className="package__price">180 000 ₸</div>
        </div>
      </main>

      {/* БЛОК ПРЕИМУЩЕСТВ */}
      <section className="advantages-section">
        <div className="advantages-container">
          <h2 className="advantages-title">{t.advantages_title}</h2>
          <div className="advantages-grid">
            {ADVANTAGES.map(({ icon, key }) => (
              <div key={key} className="advantage-card">
                <div className="advantage-icon">{icon}</div>
                <h3 className="advantage-card__title">{t[`${key}_title`]}</h3>
                <p className="advantage-card__desc">{t[`${key}_desc`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕВЬЮ ИНСТРУКЦИЙ */}
      <section className="instructions-preview-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.instructions_section_title}</h2>
            <Link to="/instructions" className="section-link">{t.instructions_all} →</Link>
          </div>
          <div className="instr-preview-grid">
            {INSTRUCTIONS.map((item, i) => (
              <Link key={i} to={item.path} className="instr-preview-card">
                <span className="instr-preview-icon">{item.icon}</span>
                <div>
                  <h3 className="instr-preview-title">{item.title}</h3>
                  <p className="instr-preview-desc">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕВЬЮ БЛОГА */}
      <section className="blog-preview-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.blog_section_title}</h2>
            <Link to="/blog" className="section-link">{t.blog_read_all} →</Link>
          </div>
          <div className="blog-preview-grid">
            {BLOG_POSTS.map(post => (
              <Link key={post.id} to={post.path} className="blog-preview-card">
                <div className="blog-preview-img">
                  <img src={post.img} alt={post.title} />
                </div>
                <div className="blog-preview-body">
                  <span className="blog-preview-date">{post.date}</span>
                  <h3 className="blog-preview-title">{post.title}</h3>
                  <p className="blog-preview-excerpt">{post.excerpt}</p>
                  <span className="blog-preview-link">{t.blog_read_more} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dream секция */}
      <section className="dream">
        <img src="/img/pagefirst/key1.png" alt="" className="dream__key dream__key--tl" />
        <img src="/img/pagefirst/key1.png" alt="" className="dream__key dream__key--tm" />
        <img src="/img/pagefirst/key1.png" alt="" className="dream__key dream__key--bl" />
        <img src="/img/pagefirst/key1.png" alt="" className="dream__key dream__key--br" />

        <div className="dream__left">
          <h2 className="dream__title">Инновационное решение для нашего будущего</h2>
          <p className="dream__desc">{t.dream_desc}</p>
          <a href="#" className="dream__btn">{t.dream_btn}</a>
        </div>

        <div className="dream__right">
          <img src="/img/pagefirst/room.png" alt="Комната" className="dream__room" />
        </div>
      </section>
    </div>
  )
}
