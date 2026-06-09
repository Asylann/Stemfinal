import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

export default function HowToOrderPage() {
  const { t } = useLang()

  const steps = [
    { key: 'step1' },
    { key: 'step2' },
    { key: 'step3' },
    { key: 'step4' },
    { key: 'step5' },
  ]

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.how_to_order_title}
      </div>

      <div className="info-hero">
        <h1>{t.how_to_order_title}</h1>
        <p>Простой процесс оформления заказа — от выбора товара до получения</p>
      </div>

      <div className="info-body">
        <section className="info-section">
          <h2>Шаги оформления заказа</h2>
          <div className="steps-list">
            {steps.map((step, i) => (
              <div key={i} className="step-item">
                <div className="step-number">{i + 1}</div>
                <div className="step-content">
                  <h3>{t[`how_to_order_${step.key}_title`]}</h3>
                  <p>{t[`how_to_order_${step.key}_text`]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section">
          <h2>Условия оплаты и доставки</h2>
          <div className="info-two-cols">
            <div className="info-box">
              <h3>💳 {t.how_to_order_payment_title}</h3>
              <p>{t.how_to_order_payment_text}</p>
            </div>
            <div className="info-box">
              <h3>🚚 {t.how_to_order_delivery_title}</h3>
              <p>{t.how_to_order_delivery_text}</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2>Остались вопросы?</h2>
          <p>
            Наши менеджеры готовы помочь вам с выбором товаров, оформлением заказа и любыми другими
            вопросами. Свяжитесь с нами любым удобным способом — по телефону, email или через форму
            на странице контактов.
          </p>
          <p>
            Также вы можете воспользоваться кнопкой "Обратный звонок" — наш менеджер перезвонит
            в течение 15 минут в рабочее время.
          </p>
        </section>

        <div className="info-cta-block">
          <h2>{t.how_to_order_cta}</h2>
          <p>Пн–Пт: 9:00 – 18:00 по времени Астаны</p>
          <Link to="/contacts" className="info-cta-btn">Связаться с нами</Link>
        </div>
      </div>
    </div>
  )
}
