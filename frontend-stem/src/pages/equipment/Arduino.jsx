import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import ProductActions from '../../components/ProductActions'
import './EquipmentDetail.css'

const SPEC_ICONS = {
  'микроконтроллер': 'Cpu', 'процессор': 'Cpu',
  'напряжение': 'Zap', 'питание': 'Zap',
  'цифровые': 'Zap', 'входы': 'Zap', 'выходы': 'Zap',
  'аналоговые': 'Battery',
  'flash': 'Folder', 'память': 'Folder',
  'тактовая': 'Clock', 'частота': 'Clock',
  'интерфейс': 'Link2', 'подключ': 'Link2',
  'размер': 'Ruler', 'габарит': 'Ruler',
  'аккумулятор': 'Battery', 'батаре': 'Battery',
  'экран': 'Monitor', 'дисплей': 'Monitor',
  'датчик': 'Droplets', 'сенсор': 'Droplets',
  'беспроводное': 'Radio', 'bluetooth': 'Radio',
  'платформ': 'Laptop', 'совместимость': 'Laptop',
  'количество деталей': 'Puzzle', 'деталей': 'Puzzle',
  'моторы': 'Zap', 'мотор': 'Zap',
}

function getSpecIcon(label) {
  const lower = (label || '').toLowerCase()
  for (const [key, icon] of Object.entries(SPEC_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return 'Info'
}

export default function Arduino() {
  const { t, lang } = useLang()
  const { products } = useCategoryProducts('arduino')
  const product = products[0] || null
  const extras = products.slice(1)
  const img = product?.img || '/img/equipment/arduino.png'
  const title = product?.title || 'ARDUINO UNO'
  const article = product?.article || 'S.Eq-ARD.UnoR3'
  const desc = product
    ? (Array.isArray(product.description)
        ? product.description.join(' ')
        : (lang === 'kz' ? product.description_kz : product.description_ru) || product.description)
    : null

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>{t.home}</Link>
        {' / '}
        <Link to="/equipment" style={{ color: '#888', textDecoration: 'none' }}>{t.equipment}</Link>
        {' / ARDUINO'}
      </div>

      <main className="detail-layout">

        <div className="detail-left">

          <div className="detail-info-block">
            <h2 className="detail-title">{title}</h2>
            {desc && <p className="detail-desc">{desc}</p>}

            {product?.article && (
              <p className="detail-order">
                <strong>{product.article}</strong>
              </p>
            )}
          </div>

          {product?.specs && product.specs.length > 0 && (
            <div className="detail-chars">
              <h3 className="detail-chars__title">{t.computers_specs}</h3>
              <div className="detail-chars__grid">
                {product.specs.map((s, i) => {
                  const iconName = getSpecIcon(s.label)
                  const IconComp = Icon[iconName]
                  return (
                    <div key={i} className="char-card">
                      <span className="char-card__icon">{IconComp ? <IconComp width="18" height="18" /> : ''}</span>
                      <span className="char-card__label">{s.label}</span>
                      <span className="char-card__value">{s.value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <p className="detail-article">{t.article_label}: {article}</p>

          <ProductActions product={{ id: product?.id, title, article, img }} />
        </div>

        <div className="detail-right">
          <img src={img} alt={title} className="detail-img" />
        </div>

      </main>

      {extras.map((p) => {
        const pImg = p.img || ''
        const pDesc = Array.isArray(p.description)
          ? p.description.join(' ')
          : (lang === 'kz' ? p.description_kz : p.description_ru) || p.description
        return (
          <div key={p.id} className="detail-extra-card">
            <div className="detail-extra-card__left">
              <h3 className="detail-extra-card__title">{p.title}</h3>
              {pDesc && <p className="detail-extra-card__desc">{pDesc}</p>}
              {p.specs && p.specs.length > 0 && (
                <div className="detail-chars">
                  <h4 className="detail-chars__title">{t.computers_specs}</h4>
                  <div className="detail-chars__grid">
                    {p.specs.map((s, i) => {
                      const iconName = getSpecIcon(s.label)
                      const IconComp = Icon[iconName]
                      return (
                        <div key={i} className="char-card">
                          <span className="char-card__icon">{IconComp ? <IconComp width="18" height="18" /> : ''}</span>
                          <span className="char-card__label">{s.label}</span>
                          <span className="char-card__value">{s.value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {p.article && <p className="detail-article">{t.article_label}: {p.article}</p>}
              <ProductActions product={{ id: p.id, title: p.title, article: p.article, img: pImg }} />
            </div>
            {pImg && (
              <div className="detail-extra-card__right">
                <img src={pImg} alt={p.title} className="detail-extra-card__img" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
