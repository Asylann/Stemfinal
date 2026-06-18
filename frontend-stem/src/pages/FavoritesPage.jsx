import { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import Icon from '../components/Icons'
import './FavoritesPage.css'


const FavCard = memo(function FavCard({ item }) {
  const { toggleFavorite } = useFavorites()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const id = item.id || item.article || item.sku || Math.random()
  const name = item.name || item.title || item.product_name || 'Без названия'
  const article = item.article || item.sku || ''

  const imageSrc = imgError
    ? '/placeholder-product.svg'
    : (item.imgs?.[0] || item.image || item.img || '/placeholder-product.svg')

  const telegramMsg = `Здравствуйте! Интересует товар: ${name}`
  const telegramLink = `https://t.me/stemacademia?text=${encodeURIComponent(telegramMsg)}`

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      image: imageSrc,
      article,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleRemove = () => {
    toggleFavorite(item)
  }

  return (
    <article className="fav-card">
      <button
        className="fav-card__remove"
        onClick={handleRemove}
        title="Убрать из избранного"
        aria-label={`Убрать ${name} из избранного`}
        type="button"
      >
        <Icon.X width="16" height="16" />
      </button>

      <div className="fav-card__image-wrapper">
        <img
          src={imageSrc}
          alt={name}
          className="fav-card__img"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {imgError && (
          <div style={{ color: '#999', textAlign: 'center', position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '40px' }}><Icon.Package width="40" height="40" /></span>
            <p>Нет фото</p>
          </div>
        )}
      </div>

      <div className="fav-card__info">
        <h3 className="fav-card__name">{name}</h3>
        {article && <p className="fav-card__article">Арт. {article}</p>}

        <div className="fav-card__actions">
          <button
            className={`fav-btn-cart ${added ? 'fav-btn-cart--added' : ''}`}
            onClick={handleAddToCart}
            disabled={added}
            type="button"
          >
            {added ? <><Icon.Check width="16" height="16" /> Добавлено!</> : <><Icon.ShoppingCart width="16" height="16" /> В корзину</>}
          </button>

          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer noopener"
            className="fav-btn-order"
          >
            <Icon.FileText width="16" height="16" /> Оставить заявку
          </a>
        </div>
      </div>
    </article>
  )
})


export default function FavoritesPage() {
  const { favorites } = useFavorites()

  if (!favorites || favorites.length === 0) {
    return (
      <div className="fav-empty">
        <span style={{ display: 'block', marginBottom: '10px' }}><Icon.Heart width="50" height="50" /></span>
        <h2>Список пуст</h2>
        <p>Нажмите <Icon.Heart width="16" height="16" style={{display:'inline',verticalAlign:'middle'}} /> на товаре, чтобы добавить его сюда</p>
        <Link to="/catalog" className="fav-login-btn">Перейти в каталог</Link>
      </div>
    )
  }

  return (
    <main className="fav-page">
      <div className="fav-breadcrumb">
        <Link to="/">Главная</Link> / <span>Избранное</span>
      </div>

      <h1 className="fav-title">
        Избранное <span>{favorites.length} товаров</span>
      </h1>

      <div className="fav-grid">
        {favorites.map((item, index) => (
          <FavCard
            key={item.id || item.article || `fav-${index}`}
            item={item}
          />
        ))}
      </div>
    </main>
  )
}