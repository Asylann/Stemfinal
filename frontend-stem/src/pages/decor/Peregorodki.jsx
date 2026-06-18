import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createApplication } from '../../api/api'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth } from '../../context/AuthContext'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import './Peregorodki.css'


function CardImage({ src, alt }) {
  const handleError = (e) => {
    e.target.style.display = 'none'
    e.target.nextSibling.style.display = 'flex'
  }
  return (
    <>
      <img src={src} alt={alt} className="perego-img-item" onError={handleError} />
      <div className="perego-img-soon" style={{ display: 'none' }}>
        <span className="perego-soon-badge">СКОРО</span>
        <span className="perego-soon-text">СКОРО</span>
      </div>
    </>
  )
}


export default function Peregorodki() {
  const { products, loading } = useCategoryProducts('peregorodki')
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '', productName: '', article: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [addedId, setAddedId] = useState(null)

  
  const handleOpenModal = (product) => {
    setShowModal(true)
    setSubmitSuccess(false)
    setFormData({ name: user?.name || '', phone: user?.phone || '', comment: '', productName: product.title, article: product.article })
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
      img: Array.isArray(product.img) ? product.img[0] : product.img,
      name: product.title,
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createApplication({
        name: formData.name,
        phone: formData.phone,
        comment: formData.comment,
        product_name: formData.productName,
        article: formData.article,
        product_url: window.location.href,
      })
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
      <div className="peregorodki-page">
        <div className="peregorodki-breadcrumb">
          <Link to="/" className="breadcrumb-link">Главная</Link>
          <span> / </span>
          <Link to="/decor" className="breadcrumb-link">Декор</Link>
          <span> / </span>
          <span>Перегородки</span>
        </div>

        <h1 className="peregorodki-title">
          Перегородки <span>{products.length} товара</span>
        </h1>

        <div className="peregorodki-list">
          {products.map((p) => (
            <div key={p.id} className="peregorodki-card">

              <div className="peregorodki-card__gallery">
                {(() => {
                  const imgs = Array.isArray(p.img) ? p.img : (p.img ? [p.img] : [])
                  if (imgs.length > 1) {
                    return (
                      <div className="perego-multi-img">
                        {imgs.map((src, i) => (
                          <CardImage key={i} src={src} alt={p.title} />
                        ))}
                      </div>
                    )
                  }
                  return <CardImage src={imgs[0] || ''} alt={p.title} />
                })()}
              </div>

              <div className="peregorodki-card__info">
                <h2>{p.title}</h2>
                <p className="peregorodki-card__desc-label">Описание:</p>
                <p className="peregorodki-card__desc">{p.description}</p>

                <table className="peregorodki-card__table">
                  <tbody>
                    <tr>
                      <td>Артикул</td>
                      <td>{p.article}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="peregorodki-card__delivery">
                  <span><Icon.Truck width="16" height="16" /> Доставка по Казахстану</span>
                  <span><Icon.MapPin width="16" height="16" /> Самовывоз: г. Астана, ул. Домалак-ана 26</span>
                </div>

                {/* Кнопки В корзину + В избранное */}
                <div className="peregorodki-card__actions">
                  <button
                    className={`perego-btn-cart ${addedId === p.id ? 'added' : ''}`}
                    onClick={() => handleAddToCart(p)}
                    disabled={addedId === p.id}
                    type="button"
                  >
                    {addedId === p.id ? <><Icon.Check width="16" height="16" /> Добавлено!</> : <><Icon.ShoppingCart width="16" height="16" /> В корзину</>}
                  </button>
                  <button
                    className={`perego-btn-fav ${isFavorite(p.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(p)}
                    type="button"
                  >
                    {isFavorite(p.id) ? <><Icon.HeartFilled width="16" height="16" /> В избранном</> : <><Icon.Heart width="16" height="16" /> В избранное</>}
                  </button>
                </div>

                {/*  Заявка через модалку, не тг */}
                <button
                  className="btn-order-full"
                  onClick={() => handleOpenModal(p)}
                  type="button"
                >
                  <Icon.FileText width="16" height="16" /> Оставить заявку
                </button>

                <div className="peregorodki-card__share">
                  <button type="button"><Icon.Share2 width="14" height="14" style={{display:'inline',verticalAlign:'middle',marginRight:4}} />Поделиться</button>
                  <button type="button"><Icon.Scale width="14" height="14" style={{display:'inline',verticalAlign:'middle',marginRight:4}} />Сравнить</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/*  Модальное окно заявки */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} type="button"><Icon.X width="16" height="16" /></button>

            <h2 className="modal-title"><Icon.FileText width="20" height="20" /> Оставить заявку</h2>
            <p className="modal-subtitle">
              Товар: <strong>{formData.productName}</strong>
            </p>

            {submitSuccess ? (
              <div className="success-message">
                <div className="success-icon"><Icon.CheckCircle width="40" height="40" /></div>
                <h3>Заявка отправлена!</h3>
                <p>Наш менеджер свяжется с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="application-form">
                <div className="form-group">
                  <label htmlFor="name">Ваше имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Иван Иванов"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="comment">Комментарий</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Дополнительная информация (необязательно)"
                    rows="3"
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Отправка...' : <><Icon.Send width="16" height="16" /> Отправить заявку</>}
                </button>
                <p className="form-note">
                  <Icon.Lock width="14" height="14" /> Ваши данные защищены. Мы не передаём их третьим лицам.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}