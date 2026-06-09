import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

const SEGMENTS = [
  { icon: '🏢', titleKey: 'cooperation_wholesale_title', textKey: 'cooperation_wholesale_text' },
  { icon: '🎓', titleKey: 'cooperation_org_title',       textKey: 'cooperation_org_text' },
  { icon: '🤝', titleKey: 'cooperation_partner_title',   textKey: 'cooperation_partner_text' },
  {
    icon: '📐',
    titleKey: null,
    textKey: null,
    title: 'Для проектных организаций',
    text: 'Предоставляем чертежи, технические паспорта, помогаем в подборе продукции под конкретные проекты. Работаем с тендерами и госзакупками.'
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
          <h2>Условия сотрудничества</h2>
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
          <h2>Как стать партнёром</h2>
          <p>
            Для начала сотрудничества свяжитесь с нашим отделом по работе с партнёрами любым удобным способом:
            по телефону, email или через форму обратной связи. Мы обсудим ваши потребности, согласуем
            условия и подготовим индивидуальное коммерческое предложение.
          </p>
          <p>
            Для оптовых покупателей и постоянных партнёров предусмотрена программа лояльности с
            накопительными скидками и приоритетным обслуживанием.
          </p>
        </section>

        <div className="info-cta-block">
          <h2>{t.cooperation_cta}</h2>
          <p>Наш менеджер свяжется с вами в течение одного рабочего дня</p>
          <Link to="/contacts" className="info-cta-btn">Отправить заявку</Link>
        </div>
      </div>
    </div>
  )
}
