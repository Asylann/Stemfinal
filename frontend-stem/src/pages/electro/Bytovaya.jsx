import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import './Bytovaya.css'

export default function Bytovaya() {
  const { t } = useLang()

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <Link to="/electro" className="breadcrumb-link">{t.electro}</Link>
        <span> / </span>
        <span>{t.electro_bytovaya}</span>
      </div>

      <main className="bytovaya-layout">

        <div className="bytovaya-card">
          <h2 className="bytovaya-card__title">{t.kiosk_title}</h2>

          <p className="bytovaya-card__desc">{t.kiosk_desc1}</p>
          <p className="bytovaya-card__desc">{t.kiosk_desc2}</p>

          <p className="bytovaya-card__section-title">{t.kiosk_advantages_title}</p>
          {t.kiosk_adv.slice(0, 2).map((a, i) => (
            <div key={i} className="bytovaya-card__advantage">
              <p className="bytovaya-card__advantage-title">{a.title}</p>
              <p className="bytovaya-card__advantage-text">{a.text}</p>
            </div>
          ))}

          <div className="bytovaya-card__categories">
            {t.bytovaya_cats.map((c, i) => (
              <div key={i} className="bytovaya-cat">
                <div className="bytovaya-cat__icon">{c.icon}</div>
                <p className="bytovaya-cat__label">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="bytovaya-card__divider" />
          <p className="bytovaya-card__article">{t.article_label}: S.Ee-INK.DDS.K</p>
        </div>

        <div className="bytovaya-image">
          <img src="/img/pagethird/bytovaya/item1.png" alt="Бытовая техника" className="bytovaya-image__img" />
        </div>

      </main>
    </div>
  )
}