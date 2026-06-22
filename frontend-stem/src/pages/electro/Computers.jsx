import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import ProductActions from '../../components/ProductActions'
import './Computers.css'

// Generic spec icon mapping
const SPEC_ICONS = {
  'серия процессора': 'Cpu',
  'процессор': 'Cpu',
  'разрешение дисплея': 'Grid',
  'дисплей': 'Grid',
  'объём оперативной памяти': 'Folder',
  'оперативная память': 'Settings',
  'тип оперативной памяти': 'Settings',
  'веб-камера': 'Camera',
  'камера': 'Camera',
  'тип накопителя': 'Disc',
  'накопитель': 'Disc',
  'операционная система': 'Grid',
  'диагональ': 'Maximize',
  'матрица': 'Monitor',
  'экран': 'Monitor',
}

function getSpecIcon(label) {
  const lower = (label || '').toLowerCase()
  for (const [key, icon] of Object.entries(SPEC_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return 'Info'
}

export default function Computers() {
  const { t, lang } = useLang()
  const { products } = useCategoryProducts('computers')

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <Link to="/electro" className="breadcrumb-link">{t.electro}</Link>
        <span> / </span>
        <span>{t.computers_title}</span>
      </div>

      <main className="computers-layout">
        {products.map((c) => {
          const img = c.img || ''
          const productSpecs = c.specs || []

          return (
            <div key={c.id} className="computer-card">

              <div className="computer-card__top">
                <div className="computer-card__top-left">
                  <h2 className="computer-card__type">{c.title}</h2>
                  <p className="computer-card__desc">
                    {Array.isArray(c.description)
                      ? c.description.join(' ')
                      : (lang === 'kz' ? c.description_kz : c.description_ru) || c.description}
                  </p>
                </div>
                <div className="computer-card__img-wrap">
                  {img && <img src={img} alt={c.title} className="computer-card__img" />}
                </div>
              </div>

              {productSpecs.length > 0 && (
                <div className="computer-card__specs-section">
                  <h3 className="computer-card__specs-title">{t.computers_specs}</h3>
                  <div className="computer-card__specs">
                    {productSpecs.map((s, i) => {
                      const iconName = getSpecIcon(s.label)
                      const IconComp = Icon[iconName]
                      return (
                        <div key={i} className="comp-spec">
                          <div className="comp-spec__icon">{IconComp ? <IconComp width="20" height="20" /> : ''}</div>
                          <div className="comp-spec__label">{s.label}</div>
                          <div className="comp-spec__value">{s.value}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {c.article && (
                <p className="computer-card__article">{t.article_label}: {c.article}</p>
              )}

              <ProductActions product={{ id: c.id, title: c.title, article: c.article, img }} />
            </div>
          )
        })}
      </main>
    </div>
  )
}
