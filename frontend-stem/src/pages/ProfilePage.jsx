import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import { getMyApplications } from '../api/api'
import './ProfilePage.css'

/* ── Icon components ────────────────────────────────────────────────────── */
const Icon = {
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Edit: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  Package: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
  Cart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  ),
  LogOut: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  ),
  Calendar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
    </svg>
  ),
  Comment: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Inbox: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  ),
}

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

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <Icon.Lock width="48" height="48" className="profile-empty__icon" />
          <h2>Требуется авторизация</h2>
          <p>Войдите или зарегистрируйтесь, чтобы видеть профиль и историю заказов</p>
          <button className="profile-login-btn" onClick={openModal}>Войти / Регистрация</button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">

      {/* User Details Card */}
      <div className="profile-header">
        <div className="profile-avatar">
          <Icon.User width="28" height="28" />
        </div>
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
              <button className="profile-name-save" onClick={handleSaveName} disabled={savingName} title="Сохранить">
                {savingName ? '...' : <Icon.Check width="16" height="16" />}
              </button>
              <button className="profile-name-cancel" onClick={handleCancelEditName} title="Отмена">
                <Icon.X width="14" height="14" />
              </button>
            </div>
          ) : (
            <h1 className="profile-header__name">
              {user?.name || 'Пользователь'}
              <button className="profile-edit-icon" onClick={handleStartEditName} title="Изменить имя">
                <Icon.Edit width="14" height="14" />
              </button>
            </h1>
          )}
          <div className="profile-header__contacts">
            {user?.phone && (
              <span className="profile-header__contact">
                <Icon.Phone width="14" height="14" />
                {user.phone}
              </span>
            )}
            {user?.email && (
              <span className="profile-header__contact">
                <Icon.Mail width="14" height="14" />
                {user.email}
              </span>
            )}
          </div>
        </div>
        <button className="profile-logout" onClick={logout}>
          <Icon.LogOut width="16" height="16" />
          <span>Выйти</span>
        </button>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat">
          <Icon.Cart width="20" height="20" className="profile-stat__icon" />
          <span className="profile-stat__num">{cartItems.length}</span>
          <span className="profile-stat__label">В корзине</span>
        </div>
        <div className="profile-stat">
          <Icon.Heart width="20" height="20" className="profile-stat__icon" />
          <span className="profile-stat__num">{favorites.length}</span>
          <span className="profile-stat__label">В избранном</span>
        </div>
        <div className="profile-stat">
          <Icon.Package width="20" height="20" className="profile-stat__icon" />
          <span className="profile-stat__num">{orders.length}</span>
          <span className="profile-stat__label">Заказов</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <Icon.Package width="15" height="15" />
          <span>Мои заказы</span>
          <span className="profile-tab__count">{orders.length}</span>
        </button>
        <button className={`profile-tab ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
          <Icon.Cart width="15" height="15" />
          <span>Корзина</span>
          <span className="profile-tab__count">{cartItems.length}</span>
        </button>
        <button className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
          <Icon.Heart width="15" height="15" />
          <span>Избранное</span>
          <span className="profile-tab__count">{favorites.length}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="profile-list">
            {loadingOrders ? (
              <div className="profile-spinner">Загрузка заказов...</div>
            ) : orders.length === 0 ? (
              <div className="profile-empty-tab">
                <Icon.Inbox width="40" height="40" className="profile-empty-tab__icon" />
                <p>Вы ещё не оставляли заявок</p>
                <Link to="/secondpage" className="profile-link-btn">
                  Перейти в каталог
                  <Icon.ArrowRight width="14" height="14" />
                </Link>
              </div>
            ) : (
              orders.map((app) => {
                const st = getStatus(app.status, app.bitrix_stage_name)
                return (
                  <div key={app.id} className="profile-order-card">
                    <div className="profile-order-card__top">
                      <div className="profile-order-card__id">Заказ #{app.id}</div>
                      <span className={`profile-order-card__status ${st.class}`}>{st.label}</span>
                    </div>
                    <div className="profile-order-card__body">
                      <div className="profile-order-card__row">
                        <span className="profile-order-card__label">
                          <Icon.Package width="14" height="14" /> Товар
                        </span>
                        <span className="profile-order-card__value">{app.product_name || '—'}</span>
                      </div>
                      <div className="profile-order-card__row">
                        <span className="profile-order-card__label">
                          <Icon.Calendar width="14" height="14" /> Дата
                        </span>
                        <span className="profile-order-card__value">{formatDate(app.created_at)}</span>
                      </div>
                      {app.comment && (
                        <div className="profile-order-card__row">
                          <span className="profile-order-card__label">
                            <Icon.Comment width="14" height="14" /> Комментарий
                          </span>
                          <span className="profile-order-card__value">{app.comment}</span>
                        </div>
                      )}
                      <div className="profile-order-card__row">
                        <span className="profile-order-card__label">
                          <Icon.Phone width="14" height="14" /> Телефон
                        </span>
                        <span className="profile-order-card__value">{app.phone}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="profile-list">
            {cartItems.length === 0 ? (
              <div className="profile-empty-tab">
                <Icon.Cart width="40" height="40" className="profile-empty-tab__icon" />
                <p>Корзина пуста</p>
                <Link to="/secondpage" className="profile-link-btn">
                  Перейти в каталог
                  <Icon.ArrowRight width="14" height="14" />
                </Link>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="profile-item">
                  <img src={item.image || item.img} alt={item.title || item.name} className="profile-item__img" />
                  <div className="profile-item__info">
                    <p className="profile-item__name">{item.title || item.name}</p>
                    {item.color && <p className="profile-item__color">Цвет: {item.color}</p>}
                    <p className="profile-item__qty">Количество: {item.quantity}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="profile-list">
            {favorites.length === 0 ? (
              <div className="profile-empty-tab">
                <Icon.Heart width="40" height="40" className="profile-empty-tab__icon" />
                <p>Список избранного пуст</p>
                <Link to="/secondpage" className="profile-link-btn">
                  Перейти в каталог
                  <Icon.ArrowRight width="14" height="14" />
                </Link>
              </div>
            ) : (
              favorites.map(item => (
                <Link key={item.id} to={`/product/${item.id}`} className="profile-item profile-item--link">
                  <img src={item.image || item.img} alt={item.title || item.name} className="profile-item__img" />
                  <div className="profile-item__info">
                    <p className="profile-item__name">{item.title || item.name}</p>
                    {(item.description_ru || item.description) && (
                      <p className="profile-item__desc">{item.description_ru || item.description}</p>
                    )}
                    {item.article && <p className="profile-item__article">Арт: {item.article}</p>}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}
