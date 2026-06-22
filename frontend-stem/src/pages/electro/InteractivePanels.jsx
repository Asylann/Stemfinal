import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import ProductActions from '../../components/ProductActions'
import './InteractivePanels.css'

export default function InteractivePanels() {
  const { t, lang } = useLang()
  const { products } = useCategoryProducts('interactive')
  const main = products[0] || null
  const extras = products.slice(1)
  const img = main?.img || '/img/pagethird/interactive/item2.png'
  const title = main?.title || t.electro_panels || 'Интерактивная панель'
  const article = main?.article || 'M.Ee-IP.Rq.75'

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <Link to="/electro" className="breadcrumb-link">{t.electro}</Link>
        <span> / </span>
        <span>{t.electro_panels}</span>
      </div>

      <main className="interactive-layout">

        <div className="interactive-card--detailed">

          <h3 className="interactive-card__section-title">{t.interactive_desc_title}</h3>
          <p className="interactive-card__desc">{t.interactive_desc}</p>

          <div className="interactive-card__software">
            <p className="interactive-card__software-title">{t.interactive_software_title}</p>
            <div className="interactive-card__software-inner">
              <p className="interactive-card__software-text">
                <strong>Roqed Science</strong> {t.interactive_software_text}
              </p>
              <img src="/img/pagethird/interactive/item1.png" alt="Roqed Science" className="interactive-card__software-img" />
            </div>
          </div>

          <h3 className="interactive-card__section-title">{t.interactive_included_title}</h3>
          <ul className="interactive-card__list">
            {t.interactive_included.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>

          {main?.specs && main.specs.length > 0 && (
            <>
              <h3 className="interactive-card__section-title">{t.interactive_specs_title}</h3>
              <div className="interactive-card__specs">
                {main.specs.map((s, i) => (
                  <div key={i} className="spec-item">
                    <div className="spec-item__icon">{Icon.Info ? <Icon.Info width="20" height="20" /> : ''}</div>
                    <div className="spec-item__label">{s.label}</div>
                    <div className="spec-item__value spec-item__value--bold">{s.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="interactive-card__article">{t.article_label}: {article}</p>

          <ProductActions product={{ id: main?.id, title, article, img }} />
        </div>

        <div className="interactive-card--image">
          <div className="interactive-card__img-wrap">
            <img src={img} alt={title} className="interactive-card__img" />
          </div>
          <p className="interactive-card__article">{t.article_label}: {article}</p>
        </div>

        {extras.map((p) => (
          <div key={p.id} className="interactive-card--detailed" style={{ marginTop: '32px' }}>
            <h3 className="interactive-card__section-title">{p.title}</h3>
            <p className="interactive-card__desc">
              {Array.isArray(p.description)
                ? p.description.join(' ')
                : (lang === 'kz' ? p.description_kz : p.description_ru) || p.description}
            </p>
            {p.img && (
              <div className="interactive-card__img-wrap" style={{ maxWidth: 400, margin: '16px 0' }}>
                <img src={p.img} alt={p.title} className="interactive-card__img" />
              </div>
            )}
            {p.article && <p className="interactive-card__article">{t.article_label}: {p.article}</p>}
            <ProductActions product={{ id: p.id, title: p.title, article: p.article, img: p.img }} />
          </div>
        ))}

      </main>
    </div>
  )
}