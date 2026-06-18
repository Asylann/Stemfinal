import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createApplication } from '../../api/api'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../i18n/LanguageContext'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import './Stanki.css'

export default function Stanki() {
  const { products, loading } = useCategoryProducts('stanki')
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { lang } = useLang()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '', productName: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)


  const handleOpenModal = (productName) => {
    setShowModal(true)
    setSubmitSuccess(false)
    setFormData({ name: user?.name || '', phone: user?.phone || '', comment: '', productName })
  }

  const handleCloseModal = () => setShowModal(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      title: product.title,
      article: product.article,
      img: product.img,
      name: product.title,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const applicationData = {
        name: formData.name,
        phone: formData.phone,
        comment: formData.comment,
        product_name: formData.productName,
        article: '',
        product_url: window.location.href
      }
      await createApplication(applicationData)
      setSubmitSuccess(true)
      setTimeout(() => setShowModal(false), 2000)
    } catch (err) {
      console.error('Ошибка отправки заявки:', err)
      if (err.response?.status === 400) {
        alert('Проверьте правильность заполнения формы')
      } else if (err.response?.status === 500) {
        alert('Сервер временно недоступен. Попробуйте позже')
      } else {
        alert('Не удалось отправить заявку. Проверьте соединение')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="stanki-page">
        <div className="stanki-breadcrumb">
          <Link to="/">Главная</Link> / <Link to="/electro">Электротехника</Link> / <span>Станки</span>
        </div>

        <h1 className="stanki-title">Станки <span>{products.length} товара</span></h1>

        {products.map((p) => (
          <div key={p.id} className="stanki-card">
            <div className="stanki-card__img-wrap">
              <img src={p.img} alt={p.title} className="stanki-card__img" loading="lazy" />
            </div>
            <div className="stanki-card__info">
              <span className="stanki-card__tag">{p.tag}</span>
              <h2 className="stanki-card__title">{p.title}</h2>

              <p className="stanki-card__desc-label">Описание:</p>
              {Array.isArray(p.description)
                ? p.description.map((d, i) => (
                    <p key={i} className="stanki-card__desc">{d}</p>
                  ))
                : <p className="stanki-card__desc">{lang === 'kz' ? p.description_kz : p.description_ru}</p>
              }

              <table className="stanki-card__table">
                <tbody>
                  <tr>
                    <td>Артикул</td>
                    <td>{p.article}</td>
                  </tr>
                </tbody>
              </table>

              <div className="stanki-card__delivery">
                <p><Icon.Truck width="16" height="16" /> Доставка по Казахстану</p>
                <p><Icon.MapPin width="16" height="16" /> Самовывоз: г. Астана, ул. Домалак-ана 26</p>
              </div>

              <div className="stanki-card__actions">
                <button className="btn-cart" onClick={() => handleAddToCart(p)} type="button">
                  <Icon.ShoppingCart width="16" height="16" /> В корзину
                </button>
                <button className="btn-order" onClick={() => handleOpenModal(p.title)} type="button">
                  <Icon.FileText width="16" height="16" /> Оставить заявку
                </button>
                <button
                  className={`btn-favorite ${isFavorite(p.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(p)}
                  type="button"
                >
                  {isFavorite(p.id) ? <><Icon.HeartFilled width="16" height="16" /> В избранном</> : <><Icon.Heart width="16" height="16" /> В избранное</>}
                </button>
              </div>

              <div className="stanki-card__links">
                <span>↗ Поделиться</span>
                <span>Сравнить</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} type="button"><Icon.X width="16" height="16" /></button>
            <h3 className="modal-title"><Icon.FileText width="20" height="20" /> Оставить заявку</h3>
            <p className="modal-product-name">Товар: <strong>{formData.productName}</strong></p>

            {submitSuccess ? (
              <div className="modal-success">
                <span style={{ fontSize: '40px' }}><Icon.CheckCircle width="40" height="40" /></span>
                <h4>Заявка отправлена!</h4>
                <p>Наш менеджер свяжется с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="modal-field">
                  <label htmlFor="name">Ваше имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Иван Иванов"
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+7 (___) ___-__-__"
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="comment">Комментарий</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Дополнительная информация (необязательно)"
                    rows="3"
                    className="modal-input modal-textarea"
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Отправка...' : <><Icon.Send width="16" height="16" /> Отправить заявку</>}
                </button>
                <p className="form-note"><Icon.Lock width="14" height="14" /> Ваши данные защищены. Мы не передаём их третьим лицам.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}