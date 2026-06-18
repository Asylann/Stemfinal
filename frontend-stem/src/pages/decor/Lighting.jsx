import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createApplication } from '../../api/api'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth } from '../../context/AuthContext'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import Icon from '../../components/Icons'
import './Lighting.css'



export default function Lighting() {
  const { products, loading } = useCategoryProducts('lighting')
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
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
      <div className="lighting-page">
        <nav className="lighting-breadcrumb">
          <Link to="/">Главная</Link>
          <span className="separator"> / </span>
          <Link to="/decor">Декор</Link>
          <span className="separator"> / </span>
          <span className="current">Освещение</span>
        </nav>

        <h1 className="lighting-title">
          Освещение <span className="product-count">{products.length} товаров</span>
        </h1>

        <div className="lighting-list">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-image">
                <img src={p.img} alt={p.title} />
              </div>

              <div className="product-info">
                <h2 className="product-title">{p.title}</h2>

                <div className="product-characteristics">
                  <h3 className="characteristics-title">Характеристики:</h3>
                  <table className="characteristics-table">
                    <tbody>
                      <tr>
                        <td className="char-label">Размеры</td>
                        <td className="char-value">{p.size}</td>
                      </tr>
                      <tr>
                        <td className="char-label">Артикул</td>
                        <td className="char-value">{p.article}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="product-actions">
                  <button className="btn-cart" onClick={() => handleAddToCart(p)}>
                    <Icon.ShoppingCart width="16" height="16" /> В корзину
                  </button>
                  <button className="btn-favorite" onClick={() => toggleFavorite(p)}>
                    {isFavorite(p.id) ? <><Icon.HeartFilled width="16" height="16" /> В избранном</> : <><Icon.Heart width="16" height="16" /> В избранное</>}
                  </button>
                </div>

                <button className="btn-application" onClick={() => handleOpenModal(p.title)}>
                  <Icon.FileText width="16" height="16" /> Оставить заявку
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}><Icon.X width="16" height="16" /></button>

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