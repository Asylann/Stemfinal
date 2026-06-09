import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import './InfoKiosk.css'

const specs = [
  { icon: '🖥', label_ru: 'Серия процессора',         label_kz: 'Процессор сериясы',      value: 'Intel Core i3 GEN6' },
  { icon: '⊞', label_ru: 'Разрешение дисплея',         label_kz: 'Дисплей ажыратымдылығы', value: 'FullHD' },
  { icon: '💾', label_ru: 'Объём оперативной памяти',   label_kz: 'Жедел жад көлемі',       value: '8Gb' },
  { icon: '🔧', label_ru: 'Тип оперативной памяти',     label_kz: 'Жедел жад түрі',         value: 'DDR3' },
  { icon: '💿', label_ru: 'Тип накопителя',             label_kz: 'Жинақтауыш түрі',        value: 'SSD 128Gb' },
  { icon: '⊞', label_ru: 'Операционная система',        label_kz: 'Операциялық жүйе',       value: 'Windows 10' },
  { icon: '📐', label_ru: 'Диагональ',                  label_kz: 'Диагональ',              value: '49"' },
  { icon: '👆', label_ru: 'Количество касаний',         label_kz: 'Тию саны',               value: '10' },
]

export default function InfoKiosk() {
  const { t, lang } = useLang()

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <Link to="/electro" className="breadcrumb-link">{t.electro}</Link>
        <span> / </span>
        <span>{t.electro_infokiosk}</span>
      </div>

      <main className="infokiosk-layout">

        <div className="infokiosk-card">
          <h2 className="infokiosk-card__title">{t.kiosk_title}</h2>

          <div className="infokiosk-card__content">
            <div className="infokiosk-card__col">
              <p className="infokiosk-card__desc">{t.kiosk_desc1}</p>
              <p className="infokiosk-card__desc">{t.kiosk_desc2}</p>
              <p className="infokiosk-card__section-title">{t.kiosk_advantages_title}</p>
              {t.kiosk_adv.slice(0, 2).map((a, i) => (
                <div key={i} className="infokiosk-card__advantage">
                  <p className="infokiosk-card__advantage-title">{a.title}</p>
                  <p className="infokiosk-card__advantage-text">{a.text}</p>
                </div>
              ))}
            </div>

            <div className="infokiosk-card__col">
              {t.kiosk_adv.slice(2).map((a, i) => (
                <div key={i} className="infokiosk-card__advantage">
                  <p className="infokiosk-card__advantage-title">{a.title}</p>
                  <p className="infokiosk-card__advantage-text">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="infokiosk-card__specs-section">
            <h3 className="infokiosk-card__specs-title">{t.computers_specs}</h3>
            <div className="infokiosk-card__specs">
              {specs.map((s, i) => (
                <div key={i} className="kiosk-spec">
                  <div className="kiosk-spec__icon">{s.icon}</div>
                  <div className="kiosk-spec__label">{lang === 'kz' ? s.label_kz : s.label_ru}</div>
                  <div className="kiosk-spec__value">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="infokiosk-card__article">{t.article_label}: S.Ee-INK.DDS.K</p>
        </div>

        <div className="infokiosk-image">
          <img src="/img/pagethird/infokiosk/item1.png" alt="Инфокиоск" className="infokiosk-image__img" />
        </div>

      </main>
    </div>
  )
}