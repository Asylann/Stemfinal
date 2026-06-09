import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { createApplication } from '../api/api'
import './CartDrawer.css'

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    clearCart
  } = useCart()

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleClose = () => setIsOpen(false)

  const normalizeNumber = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '')
      const parsed = Number(cleaned)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return 0
  }

  const safeTotalPrice = Number.isFinite(Number(totalPrice))
    ? Number(totalPrice)
    : cartItems.reduce((sum, item) => {
        const price = normalizeNumber(item.price)
        const qty = normalizeNumber(item.quantity) || 1
        return sum + price * qty
      }, 0)

  if (!isOpen) return null

  const handleOpenModal = () => {
    setShowModal(true)
    setSubmitSuccess(false)
    setFormData({ name: '', phone: '', comment: '' })
  }

  const handleCloseModal = () => setShowModal(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const products = cartItems.map((item) => ({
        name: item.name || item.title || 'Товар',
        article: item.article || null,
        price: normalizeNumber(item.price),
        quantity: normalizeNumber(item.quantity) || 1,
        url: item.url || window.location.href
      }))

      const applicationData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        comment: formData.comment.trim(),
        product_name: cartItems
          .map((i) => i.name || i.title)
          .filter(Boolean)
          .join(', '),
        article: cartItems
          .map((i) => i.article)
          .filter(Boolean)
          .join(', '),
        product_url: window.location.href,
        products
      }

      await createApplication(applicationData)

      setSubmitSuccess(true)

      setTimeout(() => {
        setShowModal(false)
        clearCart()
        handleClose()
      }, 2000)
    } catch (err) {
      console.error('Ошибка отправки заявки:', err)
      alert('❌ Ошибка при отправке. Попробуйте снова.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="cart-overlay" onClick={handleClose} />

      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2>Корзина</h2>
          <button
            className="cart-drawer__close"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            type="button"
            aria-label="Закрыть корзину"
          >
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-drawer__empty">
            <span>🛒</span>
            <p>Ваша корзина пуста</p>
            <button
              className="cart-drawer__checkout"
              onClick={handleClose}
              type="button"
            >
              Продолжить покупки
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {cartItems.map((item) => {
                const itemPrice = normalizeNumber(item.price)
                const itemQty = normalizeNumber(item.quantity) || 1
                const itemTotal = itemPrice * itemQty

                return (
                  <div key={item.id} className="cart-item">
                    <img
                      className="cart-item__img"
                      src={item.img}
                      alt={item.name || 'Товар'}
                    />

                    <div className="cart-item__info">
                      <p className="cart-item__name">{item.name || item.title || 'Товар'}</p>
                      <p className="cart-item__article">
                        Арт: {item.article || '—'}
                      </p>
                      <p className="cart-item__price">
                        {itemTotal.toLocaleString('ru-KZ')} ₸
                      </p>

                      <div className="cart-item__qty">
                        <button onClick={() => decreaseQty(item.id)} type="button">
                          −
                        </button>
                        <span>{itemQty}</span>
                        <button onClick={() => increaseQty(item.id)} type="button">
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.id)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Итого:</span>
                <strong>{safeTotalPrice.toLocaleString('ru-KZ')} ₸</strong>
              </div>

              <button
                className="cart-drawer__checkout"
                onClick={handleOpenModal}
                type="button"
              >
                📝 Оформить заявку
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={handleCloseModal}
              type="button"
            >
              ×
            </button>

            <h2>📝 Оформить заявку</h2>

            <div className="modal-product-info">
              <p>
                Товары:{' '}
                <strong>
                  {cartItems
                    .map((i) => i.name || i.title)
                    .filter(Boolean)
                    .join(', ')}
                </strong>
              </p>
              <p>
                Итого: <strong>{safeTotalPrice.toLocaleString('ru-KZ')} ₸</strong>
              </p>
            </div>

            {submitSuccess ? (
              <div className="modal-success">
                <span>✅</span>
                <h3>Заявка отправлена!</h3>
                <p>Наш менеджер свяжется с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="cart-name">Ваше имя *</label>
                  <input
                    type="text"
                    id="cart-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cart-phone">Телефон *</label>
                  <input
                    type="tel"
                    id="cart-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cart-comment">Комментарий</label>
                  <textarea
                    id="cart-comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Дополнительная информация (необязательно)"
                    rows="3"
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Отправка...' : 'Отправить заявку'}
                </button>

                <p className="form-note">🔒 Ваши данные защищены.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}