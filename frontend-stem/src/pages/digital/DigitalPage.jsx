import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import './DigitalPage.css'

export default function DigitalPage() {
  const { t } = useLang()

  const row1 = [
    { title: t.roqed_title || 'ROQED AI',  img: '/img/Roqed AI/Roqed AI logo.jpeg',         path: '/digital/roqed' },
    { title: 'STEM PLATFORM',  img: '/img/Roqed AI/New Stem Platform.jpg', path: '/digital/stemplatform' },
  ]

  const row2 = [
    {
      title: t.digital_infostends || 'ИНФО СТЕНДЫ',
      img: '/img/pagedigital/infostend.png',
      path: '/digital/infostend',
      description: t.digital_infostends_desc || 'Инфо-стенды для образовательных пространств с современным дизайном и удобной подачей материалов для учеников и преподавателей.',
    },
    {
      title: 'STEAM BOOK',
      img: '/img/pagedigital/steambook.png',
      path: '/digital/steambook',
      description: t.digital_steambook_desc || 'STEAM BOOK — интерактивный образовательный формат с цифровыми ресурсами, практическими заданиями и учебными материалами для STEM-программ.',
    },
  ]

  const allItems = [...row1, ...row2]

  return (
    <div className="digital-page">

      <div className="digital-breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <span>{t.nav_digital}</span>
      </div>

      <div className="digital-header">
        <h1 className="digital-header__title">{t.nav_digital}</h1>
        <span className="digital-header__count">{t.found} {allItems.length} {t.categories}</span>
      </div>

      <main className="digital-main">

        <div className="digital-row digital-row--2">
          {row1.map((item, i) => (
            <Link key={i} to={item.path} className="digital-card digital-card--img">
              <span className="digital-card__title">{item.title}</span>
              <div className="digital-card__img-wrap">
                <img src={item.img} alt={item.title} className="digital-card__img" />
              </div>
            </Link>
          ))}
        </div>

        <div className="digital-row digital-row--2">
          {row2.map((item, i) => (
            <Link key={i} to={item.path} className="digital-card digital-card--text">
              <div className="digital-card__content">
                <span className="digital-card__title">{item.title}</span>
                <p className="digital-card__desc">{item.description}</p>
              </div>
              <div className="digital-card__img-wrap">
                <img src={item.img} alt={item.title} className="digital-card__img" />
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  )
}