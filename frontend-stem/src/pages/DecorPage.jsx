import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './DecorPage.css'

export default function DecorPage() {
  const { t } = useLang()

  const row1 = [
    { title: t.decor_gos,    img: '/img/pagedecor/gos.png', path: '/decor/gos' },
    { title: t.decor_panels, imgs: ['/img/pagedecor/3dpanel1.png', '/img/pagedecor/3dpanel2.png'], path: '/decor/3dpanels' },
    { title: t.decor_lighting, img: '/img/pagedecor/light.png', path: '/decor/lighting' },
  ]

  const row2 = [
    { title: t.decor_peregorodki, img: '/img/pagedecor/peregorodki.png', path: '/decor/peregorodki' },
    { title: t.decor_shtory,      img: '/img/pagedecor/shtory.png',      path: '/decor/shtory' },
    { title: t.decor_rasteniya,   img: '/img/pagedecor/plant.png',       path: '/decor/rasteniya' },
    { title: t.decor_doski,       img: '/img/pagedecor/doska.png',       path: '/decor/doski' },
  ]

  return (
    <div className="decor-page">

      <div className="decor-breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <span>{t.decor}</span>
      </div>

      <div className="decor-header">
        <h1 className="decor-header__title">{t.decor}</h1>
        <span className="decor-header__count">{t.found} {row1.length + row2.length} {t.found_categories}</span>
      </div>

      <main className="decor-main">

        <div className="decor-row decor-row--3">
          {row1.map((item, i) => (
            <Link key={i} to={item.path} className="decor-card">
              <span className="decor-card__title">{item.title}</span>
              {item.imgs ? (
                <div className="decor-card__double">
                  <img src={item.imgs[0]} alt={item.title + ' left'}  className="decor-card__img" />
                  <img src={item.imgs[1]} alt={item.title + ' right'} className="decor-card__img" />
                </div>
              ) : (
                <img src={item.img} alt={item.title} className="decor-card__img" />
              )}
            </Link>
          ))}
        </div>

        <div className="decor-row decor-row--4">
          {row2.map((item, i) => (
            <Link key={i} to={item.path} className="decor-card">
              <span className="decor-card__title">{item.title}</span>
              <img src={item.img} alt={item.title} className="decor-card__img" />
            </Link>
          ))}
        </div>

      </main>
    </div>
  )
}