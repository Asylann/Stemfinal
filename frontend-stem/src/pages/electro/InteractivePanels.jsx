import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import './InteractivePanels.css'

const specs = [
  { icon: '⛶', label_ru: 'Диагональ/дюйм',       label_kz: 'Диагональ/дюйм',         value: "65' 75' 85'",                  highlight: true  },
  { icon: '⊞', label_ru: 'Разрешение',             label_kz: 'Ажыратымдылық',           value: '3840x2160',                   highlight: true  },
  { icon: '🛡', label_ru: 'Поверхность экрана',     label_kz: 'Экран беті',              value: 'Антибликовая Антивандальная', highlight: false },
  { icon: '💻', label_ru: 'Операционные системы',   label_kz: 'Операциялық жүйелер',     value: 'Android 11 Windows 11',       highlight: true  },
  { icon: '📡', label_ru: 'Применяемая технология', label_kz: 'Қолданылатын технология', value: 'инфракрасная сенсорная',      highlight: true  },
  { icon: '💾', label_ru: 'Тип оперативной памяти', label_kz: 'Жедел жад түрі',          value: 'DDR4',                        highlight: true  },
  { icon: '🔊', label_ru: 'Встроенные динамики',    label_kz: 'Кірістірілген динамиктер',value: '2x15 Вт',                     highlight: true  },
  { icon: '📋', label_ru: 'Оперативная память',     label_kz: 'Жедел жад',               value: '8Gb',                         highlight: true  },
  { icon: '🔆', label_ru: 'Контрастность',          label_kz: 'Контрасттылық',           value: '1200:1',                      highlight: false },
  { icon: 'R',  label_ru: 'Встроенная ПО',          label_kz: 'Кірістірілген БҚ',        value: 'ROQED SCIENCE',               highlight: true, orange: true },
]

export default function InteractivePanels() {
  const { t, lang } = useLang()

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

          <h3 className="interactive-card__section-title">{t.interactive_specs_title}</h3>
          <div className="interactive-card__specs">
            {specs.map((s, i) => (
              <div key={i} className={`spec-item ${s.orange ? 'spec-item--orange' : ''}`}>
                <div className="spec-item__icon">{s.icon}</div>
                <div className="spec-item__label">{lang === 'kz' ? s.label_kz : s.label_ru}</div>
                <div className={`spec-item__value ${s.highlight ? 'spec-item__value--bold' : ''}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <p className="interactive-card__article">{t.article_label}: L.Me-DI.UN.2500</p>
        </div>

        <div className="interactive-card--image">
          <div className="interactive-card__img-wrap">
            <img src="/img/pagethird/interactive/item2.png" alt="Интерактивная панель" className="interactive-card__img" />
          </div>
          <p className="interactive-card__article">{t.article_label}: M.Ee-IP.Rq.75</p>
        </div>

      </main>
    </div>
  )
}