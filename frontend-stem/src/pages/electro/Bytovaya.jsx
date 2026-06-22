import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import ProductActions from '../../components/ProductActions'
import './Bytovaya.css'

export default function Bytovaya() {
  const { t, lang } = useLang()
  const { products } = useCategoryProducts('bytovaya')
  const main = products[0] || null
  const extras = products.slice(1)
  const img = main?.img || '/img/pagethird/bytovaya/item1.png'
  const title = main?.title || t.electro_bytovaya || 'Бытовая техника'
  const article = main?.article || 'S.Ee-BYT.GEN'

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
            {t.bytovaya_cats.map((c, i) => {
              const IconComp = Icon[c.icon]
              return (
                <div key={i} className="bytovaya-cat">
                  <div className="bytovaya-cat__icon">{IconComp ? <IconComp width="24" height="24" /> : ''}</div>
                <p className="bytovaya-cat__label">{c.label}</p>
              </div>
            )
            })}
          </div>

          {main?.specs && main.specs.length > 0 && (
            <>
              <p className="bytovaya-card__section-title">{t.computers_specs}</p>
              <div className="bytovaya-card__specs">
                {main.specs.map((s, i) => (
                  <div key={i} className="bytovaya-card__spec">
                    <span className="bytovaya-card__spec-label">{s.label}</span>
                    <span className="bytovaya-card__spec-value">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="bytovaya-card__divider" />
          <p className="bytovaya-card__article">{t.article_label}: {article}</p>

          <ProductActions product={{ id: main?.id, title, article, img }} />
        </div>

        <div className="bytovaya-image">
          <img src={img} alt={title} className="bytovaya-image__img" />
        </div>

        {extras.map((p) => (
          <div key={p.id} className="bytovaya-card" style={{ marginTop: '32px' }}>
            <h2 className="bytovaya-card__title">{p.title}</h2>
            <p className="bytovaya-card__desc">
              {Array.isArray(p.description)
                ? p.description.join(' ')
                : (lang === 'kz' ? p.description_kz : p.description_ru) || p.description}
            </p>
            {p.img && (
              <div style={{ maxWidth: 400, margin: '16px 0' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', borderRadius: '8px' }} />
              </div>
            )}
            {p.article && <p className="bytovaya-card__article">{t.article_label}: {p.article}</p>}
            <ProductActions product={{ id: p.id, title: p.title, article: p.article, img: p.img }} />
          </div>
        ))}

      </main>
    </div>
  )
}