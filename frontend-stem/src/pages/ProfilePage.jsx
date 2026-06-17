import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import './ProfilePage.css'

export default function ProfilePage() {
  const { cartItems } = useCart()
  const { favorites } = useFavorites()
  const [activeTab, setActiveTab] = useState('cart')

  return (
    <div className="profile-page">

      <div className="profile-header" style={{ justifyContent: 'flex-start', gap: '16px' }}>
        <div className="profile-avatar">★</div>
        <div className="profile-header__info">
          <h1 className="profile-header__name">Мои товары</h1>
          <p className="profile-header__email">Корзина и избранное</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat__num">{cartItems.length}</span>
          <span className="profile-stat__label">В корзине</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__num">{favorites.length}</span>
          <span className="profile-stat__label">В избранном</span>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          🛒 Корзина ({cartItems.length})
        </button>
        <button
          className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤ Избранное ({favorites.length})
        </button>
      </div>

      <div className="profile-content">

        {activeTab === 'cart' && (
          <div className="profile-list">
            {cartItems.length === 0 ? (
              <div className="profile-empty-tab">
                <p>Корзина пуста</p>
                <Link to="/secondpage" className="profile-link-btn">Перейти в каталог</Link>
              </div>
            ) : (
              <>
                {cartItems.map(item => (
                  <div key={item.id} className="profile-item">
                    <img src={item.image || item.img} alt={item.name} className="profile-item__img" />
                    <div className="profile-item__info">
                      <p className="profile-item__name">{item.name}</p>
                      {item.color && <p className="profile-item__color">Цвет: {item.color}</p>}
                      <p className="profile-item__qty">Количество: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

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
