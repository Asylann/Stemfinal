import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './EquipmentPage.css'

export default function EquipmentPage() {
  const { t } = useLang()

  const categories = [
    { title: 'ARDUINO',         img: '/img/equipment/arduino.png',   path: '#' },
    { title: 'LEGO SPIKE',      img: '/img/equipment/legospike.png', path: '#' },
    { title: 'LABDISC',         img: '/img/equipment/labdisc.png',   path: '/equipment/labdisc' },
    { title: 'ULAB',            img: '/img/equipment/ulab.png',      path: '/equipment/ulab' },
    { title: t.equipment_soon,  img: null,                           path: '#' },
    { title: t.equipment_soon,  img: null,                           path: '#' },
  ]

  return (
    <div className="equip-page">

      <div className="equip-breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <span>{t.equipment}</span>
      </div>

      <div className="equip-header">
        <h1 className="equip-header__title">{t.equipment}</h1>
        <span className="equip-header__count">{t.found} {categories.length} {t.found_categories}</span>
      </div>

      <main className="equip-grid">
        {categories.map((cat, i) => (
          <Link key={i} to={cat.path} className="equip-card">
            <span className="equip-card__title">{cat.title}</span>
            {cat.img ? (
              <img src={cat.img} alt={cat.title} className="equip-card__img" />
            ) : (
              <div className="equip-card__empty">
                <span>{t.equipment_soon}</span>
              </div>
            )}
          </Link>
        ))}
      </main>

    </div>
  )
}