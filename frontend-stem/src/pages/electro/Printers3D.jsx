import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import './Printers3D.css'

export default function Printers3D() {
  const { t } = useLang()

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <Link to="/electro" className="breadcrumb-link">{t.electro}</Link>
        <span> / </span>
        <span>{t.electro_printers}</span>
      </div>

      <main className="printers3d-layout">

        <div className="printers3d-card">

          <div className="printers3d-block">
            <h3 className="printers3d-block__title">{t.printer_block1_title}</h3>
            <p className="printers3d-block__text">{t.printer_block1_text}</p>
          </div>

          <div className="printers3d-block printers3d-block--row">
            <div className="printers3d-block__left">
              <h3 className="printers3d-block__title">{t.printer_block2_title}</h3>
              <p className="printers3d-block__text">{t.printer_block2_text}</p>
              <ul className="printers3d-block__list">
                {t.printer_block2_list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="printers3d-block__img-wrap">
              <img src="/img/pagethird/printers3d/item1.png" alt="Дракон" className="printers3d-block__img" />
            </div>
          </div>

          <div className="printers3d-speed">
            <span className="printers3d-speed__label">{t.printer_speed_label}</span>
            <div className="printers3d-speed__bar">
              <div className="printers3d-speed__fill" />
            </div>
            <span className="printers3d-speed__time">{t.printer_speed_time}</span>
          </div>

          <div className="printers3d-block printers3d-block--circulation">
            <h3 className="printers3d-block__title">{t.printer_block3_title}</h3>
            <p className="printers3d-block__text">{t.printer_block3_text}</p>
            <div className="printers3d-circulation">
              <img src="/img/pagethird/printers3d/item2.png" alt="Циркуляция" className="printers3d-circulation__img" />
            </div>
          </div>

        </div>

        <div className="printers3d-right">
          <h3 className="printers3d-right__title">{t.printer_features_title}</h3>
          <ul className="printers3d-right__list">
            {t.printer_features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>

          <div className="printers3d-right__img-wrap">
            <img src="/img/pagethird/printers3d/item3.png" alt="Принтер" className="printers3d-right__img" />
          </div>

          <p className="printers3d-right__article">{t.article_label}: M.Ee-3DP.FL.5M</p>
        </div>

      </main>
    </div>
  )
}