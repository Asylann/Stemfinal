import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

const ADVANTAGES = [
  { titleKey: 'advantage_1_title', descKey: 'advantage_1_desc' },
  { titleKey: 'advantage_2_title', descKey: 'advantage_2_desc' },
  { titleKey: 'advantage_3_title', descKey: 'advantage_3_desc' },
  { titleKey: 'advantage_4_title', descKey: 'advantage_4_desc' },
  { titleKey: 'advantage_5_title', descKey: 'advantage_5_desc' },
  { titleKey: 'advantage_6_title', descKey: 'advantage_6_desc' },
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
            {t.about_section1_extra || 'Мы работаем с 2015 года и за это время реализовали более 500 проектов по всему Казахстану. В нашем портфолио — оснащение школ, университетов, техникумов и корпоративных обучающих центров в Астане, Алматы, Шымкенте и других городах страны.'}
          </p>
        </section>

        <section className="info-section">
          <h2>{t.about_section2_title}</h2>
          <div className="info-advantages-grid">
            {ADVANTAGES.map((adv, i) => (
              <div key={i} className="info-adv-card">
                <h3>{t[adv.titleKey]}</h3>
                <p>{t[adv.descKey]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section">
          <h2>{t.about_section3_title}</h2>
          <p>{t.about_section3_text}</p>
          <p>
            {t.about_section3_extra || 'Мы сотрудничаем с ведущими производителями учебного оборудования и интерактивных систем. Перед поставкой каждая единица оборудования проверяется нашими специалистами. Для мебели мы используем только экологически чистые материалы, соответствующие требованиям для учебных заведений.'}
          </p>
        </section>

        <div className="info-cta-block">
          <h2>{t.about_cta_title}</h2>
          <p>{t.about_cta_text}</p>
          <Link to="/contacts" className="info-cta-btn">{t.about_cta_btn}</Link>
        </div>
      </div>
    </div>
  )
}
