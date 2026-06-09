import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './Contacts.css'

export default function Contacts() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 900)
  }

  return (
    <div className="contacts-page">
      {/* Breadcrumb */}
      <div className="contacts-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.contacts_title}
      </div>

      {/* Верхняя часть — зелёный фон с лого */}
      <div className="contacts-hero">
        <div className="contacts-hero__bg" />
        <div className="contacts-hero__logo">
          <img src="/img/vvedenie/Vector.png" alt="STEM Academia" className="contacts-hero__logo-img" />
        </div>
      </div>

      {/* Контактная информация */}
      <div className="contacts-info">
        <div className="contacts-info__divider" />

        <div className="contacts-info__grid">
          {/* Телефон */}
          <div className="contacts-col">
            <h3 className="contacts-col__title">{t.contacts_phone}</h3>
            <a href="tel:+77778703206" className="contacts-col__text">+7 777 870 32 06</a>
            <a href="tel:+77776971423" className="contacts-col__text">+7 777 697 14 23</a>
            <a href="tel:+77000880132" className="contacts-col__text">+7 700 088 01 32</a>
            <a href="tel:+77000880137" className="contacts-col__text">+7 700 088 01 37</a>
            <a href="tel:+77000880958" className="contacts-col__text">+7 700 088 09 58</a>
          </div>

          {/* Почта */}
          <div className="contacts-col">
            <h3 className="contacts-col__title">{t.contacts_email}</h3>
            <p className="contacts-col__desc">Для приобретения кабинетов и услуг:</p>
            <a href="mailto:sm1@stem-academia.com" className="contacts-col__text">sm1@stem-academia.com</a>
            <a href="mailto:sm2@stem-academia.com" className="contacts-col__text">sm2@stem-academia.com</a>
            <a href="mailto:sm3@stem-academia.com" className="contacts-col__text">sm3@stem-academia.com</a>
            <p className="contacts-col__desc" style={{marginTop:'10px'}}>Поддержка и предложения:</p>
            <a href="mailto:info@stem-academia.com" className="contacts-col__text">info@stem-academia.com</a>
          </div>

          {/* Адрес */}
          <div className="contacts-col">
            <h3 className="contacts-col__title">{t.contacts_address}</h3>
            <p className="contacts-col__text">📍 г. Астана, Домалак-ана 26</p>
            <p className="contacts-col__text">📍 г. Алматы, пр. Аль-Фараби 77/2</p>
            <h3 className="contacts-col__title" style={{marginTop:'16px'}}>{t.contacts_schedule}</h3>
            <p className="contacts-col__text">Пн–Пт: 9:00 – 18:00</p>
            <p className="contacts-col__text">Сб–Вс: выходной</p>
          </div>

          {/* Мессенджеры */}
          <div className="contacts-col">
            <h3 className="contacts-col__title">{t.contacts_messengers_title}</h3>
            <div className="contacts-messengers">
              <a
                href="https://wa.me/77778703206"
                target="_blank"
                rel="noreferrer"
                className="contacts-messenger contacts-messenger--wa"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="https://t.me/stemacademia"
                target="_blank"
                rel="noreferrer"
                className="contacts-messenger contacts-messenger--tg"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ФОРМА ОБРАТНОЙ СВЯЗИ + КАРТА */}
      <div className="contacts-bottom">
        {/* Форма */}
        <div className="contacts-form-block">
          <h2 className="contacts-form-title">{t.contacts_form_title}</h2>
          {sent ? (
            <div className="contacts-form-success">
              <div className="contacts-success-icon">✓</div>
              <p>{t.contacts_form_success}</p>
            </div>
          ) : (
            <form className="contacts-form" onSubmit={handleSubmit}>
              <div className="contacts-form__field">
                <label>{t.contacts_form_name} *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contacts-form__field">
                <label>{t.contacts_form_phone} *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 (___) ___-__-__"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contacts-form__field">
                <label>{t.contacts_form_message}</label>
                <textarea
                  name="message"
                  placeholder="Ваш вопрос или сообщение..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="contacts-form__btn" disabled={loading}>
                {loading ? t.sending : t.contacts_form_btn}
              </button>
              <p className="contacts-form__note">{t.data_protected}</p>
            </form>
          )}
        </div>

        {/* Карта */}
        <div className="contacts-map-block">
          <h2 className="contacts-map-title">{t.contacts_map_title}</h2>
          <div className="contacts-map">
            <iframe
              title="Карта STEM Academia"
              src="https://maps.google.com/maps?q=Домалак-ана+26,+Астана,+Казахстан&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
