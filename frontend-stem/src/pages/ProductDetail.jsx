import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useCart } from '../context/CartContext'
import { createApplication } from '../api/api'
import './ProductDetail.css'

const API_BASE_URL = 
  import.meta.env.VITE_API_URL_BACKEND || 
  import.meta.env.VITE_API_URL || 
  'http://localhost:8000'


function formatPrice(price) {
  if (price === null || price === undefined || price === '') {
    return '0 ₸'
  }
  const num = Number(price)
  if (isNaN(num)) {
    return '0 ₸'
  }
  return num.toLocaleString('ru-KZ') + ' ₸'
}


function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 11 || digits.length === 12
}


function validateName(name) {
  const cleaned = name.trim()
  if (cleaned.length < 2 || cleaned.length > 50) return false
  return /^[A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІіЁё\s\-]+$/.test(cleaned)
}

export default function ProductDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = `${API_BASE_URL}/api/products/${id}`
        const response = await fetch(url)
        if (!response.ok) {
          if (response.status === 404) throw new Error('Товар не найден')
          throw new Error(`Ошибка сервера: ${response.status}`)
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadProduct()
  }, [id])

  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        name: product.title,
      })
    }
  }

  const handleOpenModal = () => {
    setShowModal(true)
    setSubmitSuccess(false)
    setFormData({ name: '', phone: '', comment: '' })
  }

  const handleCloseModal = () => setShowModal(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    
    if (!validateName(formData.name)) {
      alert('❌ Введите корректное имя (2-50 букв, без цифр и спецсимволов)')
      return
    }
    
   
    if (!validatePhone(formData.phone)) {
      alert('❌ Введите корректный номер телефона (11 цифр, например: +7 700 123 45 67)')
      return
    }
    
    setSubmitting(true)
    try {
      const applicationData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        comment: formData.comment?.trim() || '',
        product_name: product.title,
        article: product.article,
        product_url: window.location.href
      }
      await createApplication(applicationData)
      setSubmitSuccess(true)
      setTimeout(() => setShowModal(false), 2000)
    } catch (err) {
      console.error('Ошибка отправки заявки:', err)
      
      if (err.response?.status === 400) {
        alert('❌ Проверьте правильность заполнения формы')
      } else if (err.response?.status === 500) {
        alert('⚠️ Сервер временно недоступен. Попробуйте позже')
      } else {
        alert('❌ Не удалось отправить заявку. Проверьте соединение')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getCategoryName = (cat) => {
    if (!cat) return null
    if (typeof cat === 'string') return cat
    if (typeof cat === 'object') {
      return cat.title_ru || cat.title_kz || cat.name || cat.title || 'Категория'
    }
    return String(cat)
  }

  const categoryName = getCategoryName(product?.category)

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner">Загрузка товара...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-error">
        <h2>⚠️ Не удалось загрузить товар</h2>
        <p className="error-message">{error}</p>
        <Link to="/search" className="btn-back">← К поиску</Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>😔 Товар не найден</h2>
        <Link to="/search" className="btn-back">← Вернуться к поиску</Link>
      </div>
    )
  }

  return (
    <>
      <div className="product-detail-page">
        <nav className="product-breadcrumb">
          <Link to="/" className="breadcrumb-link">{t.home}</Link>
          <span className="separator"> / </span>
          <Link to="/secondpage" className="breadcrumb-link">Мебель</Link>
          {categoryName && (
            <>
              <span className="separator"> / </span>
              <span className="current">{categoryName}</span>
            </>
          )}
        </nav>

        <div className="product-container">
          <div className="product-gallery">
            <div className="product-main-image">
              <img
                src={product.img}
                alt={product.title}
                className="main-image"
                onError={(e) => { e.target.src = '/img/placeholder.png' }}
              />
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>

            {product.description && (
              <p className="product-description">{product.description}</p>
            )}

            {product.article && (
              <div className="product-article">
                <span>Артикул:</span> <strong>{product.article}</strong>
              </div>
            )}

            {/*  Безопасное отображение цены */}
            {(product.price !== null && product.price !== undefined) && (
              <div className="product-price">
                <span className="price-current">
                  {formatPrice(product.price)}
                </span>
                {product.old_price && (
                  <span className="price-old">
                    {formatPrice(product.old_price)}
                  </span>
                )}
              </div>
            )}

            <div className="product-delivery">
              <div className="delivery-item">🚚 Доставка по Казахстану</div>
              <div className="delivery-item">📍 Самовывоз: Астана, Домалак-ана 26</div>
            </div>

            <div className="product-actions">
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                🛒 В корзину
              </button>
            </div>

            <button className="btn-application" onClick={handleOpenModal}>
              📝 Оставить заявку
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>

            <h2 className="modal-title">📝 Оставить заявку</h2>
            <p className="modal-subtitle">
              Товар: <strong>{product.title}</strong><br />
              Артикул: {product.article}
            </p>

            {submitSuccess ? (
              <div className="success-message">
                <div className="success-icon">✅</div>
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
                    pattern="[A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІіЁё\s\-]{2,50}"
                    title="Только буквы, 2-50 символов"
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
                    onInput={(e) => {
                      
                      let value = e.target.value.replace(/[^\d+]/g, '')
                      if (value.startsWith('8')) {
                        value = '+7' + value.slice(1)
                      } else if (value.length > 0 && !value.startsWith('+')) {
                        value = '+' + value
                      }
                      
                      if (value.length > 12) {
                        value = value.slice(0, 12)
                      }
                      e.target.value = value
                      handleInputChange(e)
                    }}
                    required
                    placeholder="+7 (___) ___-__-__"
                    pattern="^\+7\d{10}$"
                    title="Введите номер в формате: +7 700 123 45 67"
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
                    maxLength={500}
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? '⏳ Отправка...' : '📤 Отправить заявку'}
                </button>

                <p className="form-note">
                  🔒 Ваши данные защищены. Мы не передаём их третьим лицам
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}