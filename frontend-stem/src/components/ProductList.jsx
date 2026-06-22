import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiClient } from '../api/api'
import Icon from './Icons'
import './ProductList.css'

function ApplicationModal({ product, onClose }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    username: '',
    comment: '',
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const validateName = (name) => {
    const cleaned = name.trim().replace(/\s+/g, ' ')
    return /^[A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІіЁё]+(?:[ -][A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІіЁё]+)*$/.test(cleaned)
  }

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '')
    return /^(\d{10}|\d{11}|\d{12})$/.test(digits)
  }

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1)
    }
    if (digits.startsWith('7')) {
      digits = digits.slice(0, 11)
      const p1 = digits.slice(1, 4)
      const p2 = digits.slice(4, 7)
      const p3 = digits.slice(7, 9)
      const p4 = digits.slice(9, 11)
      let formatted = '+7'
      if (p1) formatted += ` (${p1}`
      if (p1.length === 3) formatted += ')'
      if (p2) formatted += ` ${p2}`
      if (p3) formatted += `-${p3}`
      if (p4) formatted += `-${p4}`
      return formatted
    }
    return value
  }

  const handleNameChange = (e) => {
    const filtered = e.target.value.replace(
      /[^A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІіЁё\s-]/g,
      ''
    )
    setForm((prev) => ({ ...prev, name: filtered }))
    setNameError('')
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setForm((prev) => ({ ...prev, phone: formatted }))
    setPhoneError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanName = form.name.trim().replace(/\s+/g, ' ')
    const cleanPhone = form.phone.trim()

    if (!cleanName || cleanName.length < 2) {
      setNameError('Имя должно содержать минимум 2 символа')
      return
    }
    if (!validateName(cleanName)) {
      setNameError('Введите имя только буквами')
      return
    }
    if (!cleanPhone) {
      setPhoneError('Введите номер телефона')
      return
    }
    if (!validatePhone(cleanPhone)) {
      setPhoneError('Введите корректный номер телефона')
      return
    }

    setLoading(true)

    const finalComment = product.selectedColor
      ? `Выбранный цвет: ${product.selectedColor}\n${form.comment.trim()}`
      : form.comment.trim()

    try {
      await apiClient.post('/api/applications/', {
        name: cleanName,
        phone: cleanPhone,
        username: form.username.trim(),
        comment: finalComment,
        product_name: product.title,
        article: product.article,
        product_url: window.location.href,
        products: [{
          name: product.title,
          article: product.article,
          quantity: 1,
          url: window.location.href,
          color: product.selectedColor || null,
        }],
      })
      setSent(true)
    } catch {
      setSent(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button"><Icon.X width="16" height="16" /></button>
        {sent ? (
          <div className="modal-success">
            <strong><Icon.CheckCircle width="16" height="16" style={{display:'inline'}} /> Заявка отправлена!</strong> Менеджер свяжется с вами в ближайшее время.
          </div>
        ) : (
          <>
            <h3 className="modal-title">Оставить заявку</h3>
            <p className="modal-product-name">{product.title}</p>
            {product.selectedColor && (
              <p className="modal-selected-color" style={{ color: '#2f6f55', fontWeight: 'bold', marginBottom: '8px' }}>
                Цвет: {product.selectedColor}
              </p>
            )}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-field">
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Ваше имя"
                  value={form.name}
                  onChange={handleNameChange}
                  required
                />
                {nameError && <span className="modal-error">{nameError}</span>}
              </div>
              <div className="modal-field">
                <input
                  className="modal-input"
                  type="tel"
                  placeholder="+7 (777) 123-45-67"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  required
                />
                {phoneError && <span className="modal-error">{phoneError}</span>}
              </div>
              <div className="modal-field">
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Telegram username (необязательно)"
                  value={form.username}
                  onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="modal-field">
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="Комментарий"
                  value={form.comment}
                  onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-order" disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}


function ImagePlaceholder() {
  return (
    <div className="divan-card__no-img">
      <span className="divan-card__soon-badge">СКОРО</span>
      <span className="divan-card__soon-text">СКОРО</span>
    </div>
  )
}


function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const colors = useMemo(() => product.colors || [], [product.colors])

  const getInitialImg = useCallback(() => {
    if (colors.length > 0 && colors[0].img) return colors[0].img
    if (Array.isArray(product.imgs) && product.imgs.length > 0) return product.imgs[0]
    return product.img || ''
  }, [colors, product.imgs, product.img])

  const [currentImg, setCurrentImg] = useState(getInitialImg())
  const [activeColor, setActiveColor] = useState(colors.length > 0 ? colors[0].name : null)

  useEffect(() => {
    setCurrentImg(getInitialImg())
    setActiveColor(colors.length > 0 ? colors[0].name : null)
    setImgError(false)
  }, [product.id, getInitialImg, colors])

  const size = Array.isArray(product.size) ? product.size.join(', ') : product.size
  const material = Array.isArray(product.material) ? product.material.join(', ') : product.material
  const inFavorite = isFavorite(product.id)
  const showPlaceholder = !currentImg || imgError

  const handleClose = useCallback(() => setShowModal(false), [])

  const handleAddToCart = () => {
    addToCart({
      ...product,
      image: currentImg,
      color: activeColor
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleColorSelect = (color) => {
    setActiveColor(color.name)
    if (color.img) {
      setCurrentImg(color.img)
      setImgError(false)
    }
  }

  
  const handleOrderClick = () => {
    setShowModal(true)
  }

  return (
    <>
      <div className="divan-card">
        <div className="divan-card__gallery">
          {showPlaceholder ? (
            <ImagePlaceholder />
          ) : (
            <img
              src={currentImg}
              alt={product.title}
              className="divan-card__main-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
          {product.in_stock === false && (
            <span className="badge-out">Нет в наличии</span>
          )}
        </div>
        <div className="divan-card__info">
          <h2 className="divan-card__title">{product.title}</h2>
          <p className="divan-card__desc">{product.description_ru || product.description}</p>

          {colors.length > 0 && (
            <div className="divan-card__section color-selection">
              <span className="divan-card__label">
                Цвет: <strong style={{ color: '#2f6f55' }}>{activeColor}</strong>
              </span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {colors.map((color, idx) => (
                  <button
                    key={`${product.id}-color-${idx}`}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`color-circle-btn ${activeColor === color.name ? 'active' : ''}`}
                    style={{
                      backgroundColor: color.hex,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: activeColor === color.name ? '3px solid #2f6f55' : '1px solid #ddd',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s ease',
                      boxShadow: activeColor === color.name ? '0 0 0 2px white inset' : 'none',
                      transform: activeColor === color.name ? 'scale(1.1)' : 'scale(1)'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="divan-card__section">
            <span className="divan-card__label">Характеристики:</span>
            <table className="divan-card__table">
              <tbody>
                {material && (
                  <tr>
                    <td>{t.material || 'Материал'}</td>
                    <td>{material}</td>
                  </tr>
                )}
                {size && (
                  <tr>
                    <td>Размеры</td>
                    <td>{size}</td>
                  </tr>
                )}
                {product.article && (
                  <tr>
                    <td>Артикул</td>
                    <td>{product.article}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="divan-card__actions">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={addedToCart || product.in_stock === false}
              type="button"
            >
              {addedToCart ? <><Icon.Check width="14" height="14" /> Добавлено!</> : <><Icon.ShoppingCart width="16" height="16" /> В корзину</>}
            </button>
            <button
              className={`btn-favorite ${inFavorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
              type="button"
            >
              <Icon.Heart width="16" height="16" /> {inFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>

          <button
            className="btn-order-full"
            onClick={handleOrderClick}
            type="button"
          >
            <Icon.FileText width="16" height="16" /> Оставить заявку
          </button>
        </div>
      </div>
      {showModal && (
        <ApplicationModal
          product={{ ...product, selectedColor: activeColor }}
          onClose={handleClose}
        />
      )}
    </>
  )
}


function hasProductImage(p) {
  if (p.img) return true
  if (Array.isArray(p.imgs) && p.imgs.length > 0) return true
  if (Array.isArray(p.colors) && p.colors.some(c => c.img)) return true
  return false
}

export default function ProductList({ products, title, backPath, backLabel }) {
  const { t } = useLang()

  // Sort: products with images first, without images last.
  // Then ensure a specific product (`ДИВАН 1`) is shown at the very top.
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    const arr = [...products].sort((a, b) => (hasProductImage(b) ? 1 : 0) - (hasProductImage(a) ? 1 : 0))
    // Find index of exact product title 'ДИВАН 1' (case-insensitive)
    const targetIdx = arr.findIndex((p) => {
      if (!p || !p.title) return false
      return p.title.toString().trim().toLowerCase() === 'диван 1'
    })
    if (targetIdx > 0) {
      const [item] = arr.splice(targetIdx, 1)
      arr.unshift(item)
    }
    return arr
  }, [products])

  if (!sortedProducts || sortedProducts.length === 0) {
    return (
      <div className="divany-page">
        <div className="empty-state">
          <h2>Товары не найдены</h2>
          <Link to={backPath || '/'} className="btn-back">
            ← Вернуться назад
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="divany-page">
      <div className="divany-breadcrumb">
        <Link to="/" className="breadcrumb-link">
          {t.home || 'Главная'}
        </Link>
        <span> / </span>
        {backPath && (
          <>
            <Link to={backPath} className="breadcrumb-link">
              {backLabel || 'Каталог'}
            </Link>
            <span> / </span>
          </>
        )}
        <span>{title}</span>
      </div>
      <h1 className="divany-title">
        {title} <span>{sortedProducts.length} товаров</span>
      </h1>
      <div className="divany-list">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id || product.article} product={product} />
        ))}
      </div>
    </div>
  )
}