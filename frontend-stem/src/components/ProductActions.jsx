/**
 * Reusable ProductActions component
 * Provides: Add-to-Cart, Favorites, Leave-Application modal
 * Drop into any product page with: <ProductActions product={{ id, title, article, img }} />
 */
import { useState } from 'react'
import { createApplication } from '../api/api'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import { useUserLocation } from '../context/locationContext'
import Icon from './Icons'
import './ProductActions.css'

export default function ProductActions({ product }) {
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { selectedCity } = useUserLocation()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const productId = product.id || product.article || product.title
  const productColor = product.color || null
  const inFavorite = isFavorite(productId)

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      title: product.title,
      article: product.article || '',
      img: product.img || '',
      name: product.title,
      color: productColor,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleOpenModal = () => {
    setShowModal(true)
    setSubmitSuccess(false)
    setFormData({ name: user?.name || '', phone: user?.phone || '', comment: '' })
  }

  const handleCloseModal = () => setShowModal(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createApplication({
        name: formData.name,
        phone: formData.phone,
        comment: productColor ? `Выбранный цвет: ${productColor}\n${formData.comment}`.trim() : formData.comment,
        product_name: product.title,
        article: product.article || '',
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
      <div className="product-actions">
        <div className="product-actions__row">
          <button
            className={`product-actions__btn product-actions__btn--cart ${addedToCart ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={addedToCart}
            type="button"
          >
            {addedToCart
              ? <><Icon.Check width="16" height="16" /> Добавлено!</>
              : <><Icon.ShoppingCart width="16" height="16" /> В корзину</>}
          </button>
          <button
            className={`product-actions__btn product-actions__btn--fav ${inFavorite ? 'active' : ''}`}
            onClick={() => toggleFavorite({ id: productId, title: product.title, article: product.article, img: product.img })}
            type="button"
          >
            {inFavorite
              ? <><Icon.HeartFilled width="16" height="16" /> В избранном</>
              : <><Icon.Heart width="16" height="16" /> В избранное</>}
          </button>
        </div>
        <button
          className="product-actions__btn product-actions__btn--order"
          onClick={handleOpenModal}
          type="button"
        >
          <Icon.FileText width="16" height="16" /> Оставить заявку
        </button>
        <div className="product-actions__delivery">
          <span><Icon.Truck width="14" height="14" /> Доставка по Казахстану</span>
          <span><Icon.MapPin width="14" height="14" /> {selectedCity.pickup}</span>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} type="button"><Icon.X width="16" height="16" /></button>
            <h3 className="modal-title"><Icon.FileText width="20" height="20" /> Оставить заявку</h3>
            <p className="modal-product-name">Товар: <strong>{product.title}</strong></p>

            {submitSuccess ? (
              <div className="modal-success">
                <span className="modal-success__icon"><Icon.CheckCircle width="40" height="40" /></span>
                <h4>Заявка отправлена!</h4>
                <p>Наш менеджер свяжется с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="modal-field">
                  <label htmlFor="pa-name">Ваше имя *</label>
                  <input
                    type="text" id="pa-name" name="name"
                    value={formData.name} onChange={handleInputChange}
                    required placeholder="Иван Иванов" className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="pa-phone">Телефон *</label>
                  <input
                    type="tel" id="pa-phone" name="phone"
                    value={formData.phone} onChange={handleInputChange}
                    required placeholder="+7 (___) ___-__-__" className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="pa-comment">Комментарий</label>
                  <textarea
                    id="pa-comment" name="comment"
                    value={formData.comment} onChange={handleInputChange}
                    placeholder="Дополнительная информация (необязательно)"
                    rows="3" className="modal-input modal-textarea"
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
