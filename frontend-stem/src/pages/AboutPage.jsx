import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

const ADVANTAGES = [
  { title: 'Собственное производство', desc: 'Изготавливаем мебель и поставляем оборудование для STEM-лабораторий любого масштаба' },
  { title: 'Сертифицированная продукция', desc: 'Вся продукция соответствует стандартам качества и имеет необходимые сертификаты' },
  { title: 'Широкий ассортимент', desc: 'Мебель, электроника, оборудование и цифровые решения для образовательных пространств' },
  { title: 'Быстрая поставка', desc: 'Отгружаем заказы в кратчайшие сроки, доставка по Казахстану' },
  { title: 'Гарантия качества', desc: 'Предоставляем гарантию на всю продукцию и техническую поддержку' },
  { title: 'Комплексные решения', desc: 'От дизайн-проекта до сдачи готового кабинета — всё под ключ' },
]

export default function AboutPage() {
  const { t } = useLang()

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.about_title}
      </div>

      <div className="info-hero">
        <h1>{t.about_title}</h1>
        <p>{t.about_hero}</p>
      </div>

      <div className="info-body">
        <section className="info-section">
          <h2>{t.about_section1_title}</h2>
          <p>{t.about_section1_text}</p>
          <p>
            Мы работаем с 2015 года и за это время реализовали более 500 проектов по всему Казахстану.
            В нашем портфолио — оснащение школ, университетов, техникумов и корпоративных обучающих
            центров в Астане, Алматы, Шымкенте и других городах страны.
          </p>
        </section>

        <section className="info-section">
          <h2>{t.about_section2_title}</h2>
          <div className="info-advantages-grid">
            {ADVANTAGES.map((adv, i) => (
              <div key={i} className="info-adv-card">
                <h3>{adv.title}</h3>
                <p>{adv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section">
          <h2>{t.about_section3_title}</h2>
          <p>{t.about_section3_text}</p>
          <p>
            Мы сотрудничаем с ведущими производителями учебного оборудования и интерактивных систем.
            Перед поставкой каждая единица оборудования проверяется нашими специалистами. Для мебели
            мы используем только экологически чистые материалы, соответствующие требованиям для
            учебных заведений.
          </p>
        </section>

        <div className="info-cta-block">
          <h2>Готовы к сотрудничеству?</h2>
          <p>Свяжитесь с нами для получения консультации и коммерческого предложения</p>
          <Link to="/contacts" className="info-cta-btn">Связаться с нами</Link>
        </div>
      </div>
    </div>
  )
}
