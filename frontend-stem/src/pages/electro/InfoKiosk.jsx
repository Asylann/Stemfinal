import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import ProductActions from '../../components/ProductActions'
import './InfoKiosk.css'

const SPEC_ICONS = {
  'серия процессора': 'Cpu', 'процессор': 'Cpu',
  'разрешение дисплея': 'Grid', 'дисплей': 'Grid',
  'объём оперативной памяти': 'Folder', 'оперативная память': 'Settings',
  'тип оперативной памяти': 'Settings',
  'тип накопителя': 'Disc', 'накопитель': 'Disc',
  'операционная система': 'Grid',
  'диагональ': 'Maximize',
  'количество касаний': 'MousePointer', 'касания': 'MousePointer',
}

function getSpecIcon(label) {
  const lower = (label || '').toLowerCase()
  for (const [key, icon] of Object.entries(SPEC_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return 'Info'
}

export default function InfoKiosk() {
  const { t, lang } = useLang()
  const { products } = useCategoryProducts('infokiosk')
  const main = products[0] || null
  const extras = products.slice(1)
  const img = main?.img || '/img/pagethird/infokiosk/item1.png'
  const title = main?.title || t.kiosk_title || 'Инфокиоск'
  const article = main?.article || 'S.Ee-INK.DDS.K'

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

          {main?.specs && main.specs.length > 0 && (
            <div className="infokiosk-card__specs-section">
              <h3 className="infokiosk-card__specs-title">{t.computers_specs}</h3>
              <div className="infokiosk-card__specs">
                {main.specs.map((s, i) => {
                  const iconName = getSpecIcon(s.label)
                  const IconComp = Icon[iconName]
                  return (
                    <div key={i} className="kiosk-spec">
                      <div className="kiosk-spec__icon">{IconComp ? <IconComp width="20" height="20" /> : ''}</div>
                      <div className="kiosk-spec__label">{s.label}</div>
                      <div className="kiosk-spec__value">{s.value}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <p className="infokiosk-card__article">{t.article_label}: {article}</p>

          <ProductActions product={{ id: main?.id, title, article, img }} />
        </div>

        <div className="infokiosk-image">
          <img src={img} alt={title} className="infokiosk-image__img" />
        </div>

        {extras.map((p) => (
          <div key={p.id} className="infokiosk-card" style={{ marginTop: '32px' }}>
            <h2 className="infokiosk-card__title">{p.title}</h2>
            <p className="infokiosk-card__desc">
              {Array.isArray(p.description)
                ? p.description.join(' ')
                : (lang === 'kz' ? p.description_kz : p.description_ru) || p.description}
            </p>
            {p.img && (
              <div className="infokiosk-card__img-wrap" style={{ maxWidth: 400, margin: '16px 0' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', borderRadius: '8px' }} />
              </div>
            )}
            {p.article && <p className="infokiosk-card__article">{t.article_label}: {p.article}</p>}
            <ProductActions product={{ id: p.id, title: p.title, article: p.article, img: p.img }} />
          </div>
        ))}

      </main>
    </div>
  )
}