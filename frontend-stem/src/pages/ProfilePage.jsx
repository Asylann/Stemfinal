import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import { getMyApplications } from '../api/api'
import './ProfilePage.css'
const STATUS_MAP = {
  new:           { label: 'Новая',       class: 'status--blue' },
  processing:    { label: 'В обработке', class: 'status--yellow' },
  in_progress:   { label: 'В работе',    class: 'status--orange' },
  completed:     { label: 'Завершена',   class: 'status--green' },
  delivered:     { label: 'Доставлена',  class: 'status--darkgreen' },
  cancelled:     { label: 'Отменена',    class: 'status--red' },
  rejected:      { label: 'Отклонена',   class: 'status--gray' },
}

function getStatus(status, bitrixName) {
  if (bitrixName) return { label: bitrixName, class: 'status--purple' }
  const s = (status || '').toLowerCase()
  return STATUS_MAP[s] || { label: status || 'Новая', class: 'status--blue' }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr.replace(' ', 'T'))
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

export default function ProfilePage() {
  const { cartItems } = useCart()
  const { favorites } = useFavorites()
  const { user, isAuthenticated, logout, openModal, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savingName, setSavingName] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    setLoadingOrders(true)
    getMyApplications()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [isAuthenticated])

  function handleStartEditName() {
    setNameInput(user?.name || '')
    setEditingName(true)
  }

  async function handleSaveName() {
    setSavingName(true)
    try {
      await updateUser({ name: nameInput.trim() })
      setEditingName(false)
    } catch (e) {
      // silently fail
    } finally {
      setSavingName(false)
    }
  }

  function handleCancelEditName() {
    setEditingName(false)
    setNameInput('')
  }

  // Not logged in — show auth prompt
  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <span>🔒</span>
          <h2>Требуется авторизация</h2>
          <p>Войдите или зарегистрируйтесь, чтобы видеть профиль и историю заказов</p>
          <button className="profile-login-btn" onClick={openModal}>Войти / Регистрация</button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">

      {/* ── User Details Card ─────────────────────────────────────── */}
      <div className="profile-header">
        <div className="profile-avatar">{(user?.name || user?.phone || '?')[0].toUpperCase()}</div>
        <div className="profile-header__info">
          {editingName ? (
            <div className="profile-name-edit">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ваше имя"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName()
                  if (e.key === 'Escape') handleCancelEditName()
                }}
              />
              <button className="profile-name-save" onClick={handleSaveName} disabled={savingName}>
                {savingName ? '...' : '✓'}
              </button>
              <button className="profile-name-cancel" onClick={handleCancelEditName}>✕</button>
            </div>
          ) : (
            <h1 className="profile-header__name">
              {user?.name || 'Пользователь'}
              <button className="profile-edit-icon" onClick={handleStartEditName} title="Изменить имя">✎</button>
            </h1>
          )}
          {user?.phone && <p className="profile-header__contact">📞 {user.phone}</p>}
          {user?.email && <p className="profile-header__contact">✉ {user.email}</p>}
        </div>
        <button className="profile-logout" onClick={logout}>Выйти</button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat__num">{cartItems.length}</span>
          <span className="profile-stat__label">В корзине</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__num">{favorites.length}</span>
          <span className="profile-stat__label">В избранном</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__num">{orders.length}</span>
          <span className="profile-stat__label">Заказов</span>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <div className="profile-tabs">
        <button className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          📦 Мои заказы ({orders.length})
        </button>
        <button className={`profile-tab ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
          🛒 Корзина ({cartItems.length})
        </button>
        <button className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
          ❤ Избранное ({favorites.length})
        </button>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────── */}
      <div className="profile-content">

        {/* ── Orders Tab ──────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="profile-list">
            {loadingOrders ? (
              <div className="profile-spinner">⏳ Загрузка заказов...</div>
            ) : orders.length === 0 ? (
              <div className="profile-empty-tab">
                <p>📭 Вы ещё не оставляли заявок</p>
                <Link to="/secondpage" className="profile-link-btn">Перейти в каталог</Link>
              </div>
            ) : (
              orders.map((app) => {
                const st = getStatus(app.status, app.bitrix_stage_name)
                return (
                  <div key={app.id} className="profile-order-card">
                    <div className="profile-order-card__top">
                      <div className="profile-order-card__id">#{app.id}</div>
                      <span className={`profile-order-card__status ${st.class}`}>{st.label}</span>
                    </div>
                    <div className="profile-order-card__body">
                      <div className="profile-order-card__row">
                        <span className="profile-order-card__label">📦 Товар</span>
                        <span className="profile-order-card__value">{app.product_name || '—'}</span>
                      </div>
                      <div className="profile-order-card__row">
                        <span className="profile-order-card__label">📅 Дата</span>
                        <span className="profile-order-card__value">{formatDate(app.created_at)}</span>
                      </div>
                      {app.comment && (
                        <div className="profile-order-card__row">
                          <span className="profile-order-card__label">💬 Комментарий</span>
                          <span className="profile-order-card__value">{app.comment}</span>
                        </div>
                      )}
                      <div className="profile-order-card__row">
                        <span className="profile-order-card__label">📞 Телефон</span>
                        <span className="profile-order-card__value">{app.phone}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── Cart Tab ────────────────────────────────────────────── */}
        {activeTab === 'cart' && (
          <div className="profile-list">
            {cartItems.length === 0 ? (
              <div className="profile-empty-tab">
                <p>Корзина пуста</p>
                <Link to="/secondpage" className="profile-link-btn">Перейти в каталог</Link>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="profile-item">
                  <img src={item.image || item.img} alt={item.name} className="profile-item__img" />
                  <div className="profile-item__info">
                    <p className="profile-item__name">{item.name}</p>
                    {item.color && <p className="profile-item__color">Цвет: {item.color}</p>}
                    <p className="profile-item__qty">Количество: {item.quantity}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Favorites Tab ───────────────────────────────────────── */}
        {activeTab === 'favorites' && (
          <div className="profile-list">
            {favorites.length === 0 ? (
              <div className="profile-empty-tab">
                <p>Список избранного пуст</p>
                <Link to="/secondpage" className="profile-link-btn">Перейти в каталог</Link>
              </div>
            ) : (
              favorites.map(item => (
                <div key={item.id} className="profile-item">
                  <img src={item.image || item.img} alt={item.name} className="profile-item__img" />
                  <div className="profile-item__info">
                    <p className="profile-item__name">{item.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}
