import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './ThirdPage.css'

export default function ThirdPage() {
  const { t } = useLang()

  const items = [
    { id: 1, title: t.electro_panels,    image: '/img/pagethird/panel.png',  path: '/electro/interactive' },
    { id: 2, title: t.electro_computers, image: '/img/pagethird/comp.png',   path: '/electro/computers' },
    { id: 3, title: t.electro_infokiosk, image: '/img/pagethird/info.png',   path: '/electro/infokiosk' },
    { id: 4, title: t.electro_stanki,    image: '/img/pagethird/stanki.png', path: '/electro/stanki' },
    { id: 5, title: t.electro_bytovaya,  image: '/img/pagethird/tech.png',   path: '/electro/bytovaya' },
    { id: 6, title: t.electro_printers,  image: '/img/pagethird/print.png',  path: '/electro/printers3d' },
  ]

  return (
    <div className="third-page">

      <div className="third-breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <span>{t.electro}</span>
      </div>

      <div className="third-content__header">
        <h1 className="third-content__title">{t.electro}</h1>
        <span className="third-content__count">{t.found} {items.length} {t.found_categories}</span>
      </div>

      <div className="third-grid">
        {items.map((item) => (
          <Link to={item.path} key={item.id} className="third-card">
            <div className="third-card__img-wrap">
              <img src={item.image} alt={item.title} className="third-card__img" />
            </div>
            <h3 className="third-card__title">{item.title}</h3>
          </Link>
        ))}
      </div>

    </div>
  )
}