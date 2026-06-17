import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

const SEGMENTS = [
  { icon: '🏢', titleKey: 'cooperation_wholesale_title', textKey: 'cooperation_wholesale_text' },
  { icon: '🎓', titleKey: 'cooperation_org_title',       textKey: 'cooperation_org_text' },
  { icon: '🤝', titleKey: 'cooperation_partner_title',   textKey: 'cooperation_partner_text' },
  {
    icon: '📐',
    titleKey: 'cooperation_project_title',
    textKey: 'cooperation_project_text',
    title: null,
    text: null
  },
]

export default function CooperationPage() {
  const { t } = useLang()

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.cooperation_title}
      </div>

      <div className="info-hero">
        <h1>{t.cooperation_title}</h1>
        <p>{t.cooperation_intro}</p>
      </div>

      <div className="info-body">
        <section className="info-section">
          <h2>{t.cooperation_conditions}</h2>
          <div className="cooperation-cards">
            {SEGMENTS.map((seg, i) => (
              <div key={i} className="cooperation-card">
                <div className="cooperation-card__icon">{seg.icon}</div>
                <h3>{seg.titleKey ? t[seg.titleKey] : seg.title}</h3>
                <p>{seg.textKey ? t[seg.textKey] : seg.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section">
          <h2>{t.cooperation_how_title}</h2>
          <p>
            {t.cooperation_how_text1}
          </p>
          <p>
            {t.cooperation_how_text2}
          </p>
        </section>

        <div className="info-cta-block">
          <h2>{t.cooperation_cta}</h2>
          <p>{t.cooperation_cta_text}</p>
          <Link to="/contacts" className="info-cta-btn">{t.cooperation_cta_btn}</Link>
        </div>
      </div>
    </div>
  )
}
