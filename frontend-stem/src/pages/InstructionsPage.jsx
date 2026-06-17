import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

const INSTRUCTIONS = [
  {
    icon: '📋',
    titleKey: 'instruction_1_title',
    descKey: 'instruction_1_desc',
    tagKey: 'instruction_1_tag',
    path: '/instructions',
  },
  {
    icon: '🖥️',
    titleKey: 'instruction_2_title',
    descKey: 'instruction_2_desc',
    tagKey: 'instruction_2_tag',
    path: '/instructions',
  },
  {
    icon: '🧪',
    titleKey: 'instruction_3_title',
    descKey: 'instruction_3_desc',
    tagKey: 'instruction_3_tag',
    path: '/instructions',
  },
  {
    icon: '🔧',
    titleKey: 'instruction_4_title',
    descKey: 'instruction_4_desc',
    tagKey: 'instruction_4_tag',
    path: '/instructions',
  },
  {
    icon: '💻',
    titleKey: 'instruction_5_title',
    descKey: 'instruction_5_desc',
    tagKey: 'instruction_5_tag',
    path: '/instructions',
  },
  {
    icon: '📐',
    titleKey: 'instruction_6_title',
    descKey: 'instruction_6_desc',
    tagKey: 'instruction_6_tag',
    path: '/instructions',
  },
  {
    icon: '🖨️',
    titleKey: 'instruction_7_title',
    descKey: 'instruction_7_desc',
    tagKey: 'instruction_7_tag',
    path: '/instructions',
  },
  {
    icon: '📺',
    titleKey: 'instruction_8_title',
    descKey: 'instruction_8_desc',
    tagKey: 'instruction_8_tag',
    path: '/instructions',
  },
  {
    icon: '🏫',
    titleKey: 'instruction_9_title',
    descKey: 'instruction_9_desc',
    tagKey: 'instruction_9_tag',
    path: '/instructions',
  },
]

export default function InstructionsPage() {
  const { t } = useLang()

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.instructions_title}
      </div>

      <div className="info-hero">
        <h1>{t.instructions_title}</h1>
        <p>{t.instructions_intro}</p>
      </div>

      <div className="info-body">
        <section className="info-section">
          <h2>{t.instructions_all_materials}</h2>
          <div className="instructions-grid">
            {INSTRUCTIONS.map((instr, i) => (
              <div key={i} className="instruction-card">
                <div className="instruction-card__icon">{instr.icon}</div>
                <div className="instruction-card__title">{t[instr.titleKey]}</div>
                <p className="instruction-card__desc">{t[instr.descKey]}</p>
                <span className="instruction-tag">{t[instr.tagKey]}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="info-cta-block">
          <h2>{t.instructions_help_title}</h2>
          <p>{t.instructions_help_text}</p>
          <Link to="/contacts" className="info-cta-btn">{t.instructions_help_btn}</Link>
        </div>
      </div>
    </div>
  )
}
