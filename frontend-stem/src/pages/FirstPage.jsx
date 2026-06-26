import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import './FirstPage.css'
import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import { useLang } from '../i18n/LanguageContext'
import Icon from '../components/Icons'

const ADVANTAGES = [
  { icon: 'Factory', key: 'adv_1' },
  { icon: 'CheckCircle', key: 'adv_2' },
  { icon: 'Package', key: 'adv_3' },
  { icon: 'Truck', key: 'adv_4' },
  { icon: 'Shield', key: 'adv_5' },
  { icon: 'Wrench', key: 'adv_6' },
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
  { icon: 'ClipboardList', title: 'Руководство по выбору мебели', desc: 'Как подобрать мебель под конкретный учебный кабинет', path: '/instructions' },
  { icon: 'Monitor', title: 'Подключение интерактивных панелей', desc: 'Пошаговая инструкция по установке и настройке', path: '/instructions' },
  { icon: 'FlaskConical', title: 'Оснащение лабораторий', desc: 'Комплектация STEM-лабораторий — с чего начать', path: '/instructions' },
]

export default function FirstPage() {
  const { t } = useLang()
  const packagesRef = useRef(null)

  const location = useLocation()

  // Scroll to anchor if URL has a hash (e.g. /#packages)
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location])

  return (
    <>
      <Helmet>
        <title>STEM Academia - Инновационное Образование и STEM Оборудование в Казахстане</title>
        <meta name="description" content="STEM Academia - лидер в поставке STEM оборудования, интерактивных панелей и мебели для школ в Казахстане. Создаем будущее образования!" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "STEM Academia",
            "image": "https://stem-academia.kz/img/pagefirst/Vector (89).png",
            "telephone": "+7 777 870 32 06",
            "email": "info@stem-academia.kz",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ул. Домалак ана, 26",
              "addressLocality": "Астана",
              "addressCountry": "KZ"
            },
            "url": "https://stem-academia.kz",
            "priceRange": "$$",
            "openingHours": "Mo-Fr 09:00-18:00",
            "sameAs": [
              "https://www.instagram.com/stem_academia",
              "https://www.youtube.com/@stemacademia6974"
            ]
          })}
        </script>
      </Helmet>
      
      <div className="page">
      {/* Hero и категории */}
      <HeroSlider />
      <CategoryGrid />

      {/* AI Визуализация — CTA секция */}
      <section className="visualize-cta-section">
        <div className="visualize-cta-container">
          <div className="visualize-cta-text">
            <h2 className="visualize-cta-title">{t.visualize_cta_title || 'Визуализируйте мебель в вашем помещении с AI'}</h2>
            <p className="visualize-cta-desc">{t.visualize_cta_desc || 'Загрузите фото вашего помещения и разместите мебель из нашего каталога с помощью AI'}</p>
          </div>
          <Link to="/visualize" className="visualize-cta-btn">
            {t.visualize_cta_btn || 'Попробовать визуализацию'} →
          </Link>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">{t.design_breadcrumb}</div>

      {/* Пакеты дизайна */}
      <main className="packages" id="packages" ref={packagesRef}>
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
        </div>
      </main>

      {/* Приказ №70 */}
      <section className="order70-section">
        <div className="order70-container">
          <div className="order70-badge">Приказ №70 МОН РК</div>
          <h2 className="order70-title">{t.order70_title}</h2>
          <p className="order70-desc">{t.order70_desc}</p>
          <p className="order70-note">{t.order70_note}</p>
          <a href="https://adilet.zan.kz/rus/docs/V1600013272" target="_blank" rel="noopener noreferrer" className="order70-link">
            {t.order70_link_text}
          </a>
        </div>
      </section>

      {/* БЛОК ПРЕИМУЩЕСТВ */}
      <section className="advantages-section">
        <div className="advantages-container">
          <h2 className="advantages-title">{t.advantages_title}</h2>
          <div className="advantages-grid">
            {ADVANTAGES.map(({ icon, key }) => {
              const IconComp = Icon[icon]
              return (
              <div key={key} className="advantage-card">
                <div className="advantage-icon">{IconComp ? <IconComp width="24" height="24" /> : ''}</div>
                <h3 className="advantage-card__title">{t[`${key}_title`]}</h3>
                <p className="advantage-card__desc">{t[`${key}_desc`]}</p>
              </div>
            )
            })}
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
            {INSTRUCTIONS.map((item, i) => {
              const IconComp = Icon[item.icon]
              return (
              <Link key={i} to={item.path} className="instr-preview-card">
                <span className="instr-preview-icon">{IconComp ? <IconComp width="24" height="24" /> : ''}</span>
                <div>
                  <h3 className="instr-preview-title">{item.title}</h3>
                  <p className="instr-preview-desc">{item.desc}</p>
                </div>
              </Link>
            )
            })}
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


    </div>
    </>
  )
}
