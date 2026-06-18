import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import Icon from './Icons'
import './Navbar.css'

function CallbackModal({ onClose }) {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  return (
    <div className="callback-overlay" onClick={onClose}>
      <div className="callback-modal" onClick={e => e.stopPropagation()}>
        <button className="callback-close" onClick={onClose}><Icon.X width="16" height="16" /></button>
        {sent ? (
          <div className="callback-success">
            <div className="callback-success-icon"><Icon.Check width="32" height="32" /></div>
            <h3>{t.callback_success}</h3>
          </div>
        ) : (
          <>
            <h2 className="callback-title">{t.callback_title}</h2>
            <p className="callback-desc">{t.callback_desc}</p>
            <form className="callback-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={t.name_placeholder}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder={t.phone_placeholder}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? t.sending : t.nav_callback}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState(
    () => localStorage.getItem('stem_city') || 'astana'
  )
  const { lang, setLang, t } = useLang()
  const navigate = useNavigate()
  const catalogRef = useRef(null)
  const cityRef = useRef(null)

  const { isOpen, setIsOpen, totalCount } = useCart()
  const { favorites } = useFavorites()
  const { user, isAuthenticated, openModal, logout } = useAuth()

  const cities = [
    { key: 'astana', label: t.city_astana },
    { key: 'almaty', label: t.city_almaty },
  ]

  function handleCityChange(key) {
    setSelectedCity(key)
    localStorage.setItem('stem_city', key)
    setCityOpen(false)
  }

  const catalogCategories = [
    { label: t.nav_design,    path: '/' },
    { label: t.nav_furniture, path: '/secondpage' },
    { label: t.nav_electro,   path: '/electro' },
    { label: t.nav_decor,     path: '/decor' },
    { label: t.nav_equipment, path: '/equipment' },
    { label: t.nav_digital,   path: '/digital' },
  ]

  const mainNav = [
    { label: t.nav_about,        path: '/about' },
    { label: t.nav_cooperation,  path: '/cooperation' },
    { label: t.nav_works,        path: '/works' },
    { label: t.nav_instructions, path: '/instructions' },
    { label: t.nav_blog,         path: '/blog' },
    { label: t.nav_how_to_order, path: '/how-to-order' },
    { label: t.nav_contacts,     path: '/contacts' },
  ]

  useEffect(() => {
    function handleClick(e) {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) {
        setCatalogOpen(false)
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setMobileOpen(false)
    }
  }

  return (
    <>
      <header className="navbar-wrapper">
        {/* TOP BAR */}
        <div className="navbar-topbar">
          <div className="topbar-city-wrap" ref={cityRef}>
            <button
              className="topbar-city"
              onClick={() => setCityOpen(!cityOpen)}
              type="button"
            >
              <Icon.MapPin width="14" height="14" style={{display:'inline'}} /> {selectedCity === 'almaty' ? t.city_almaty : t.city_astana} <span className="city-arrow">{cityOpen ? '▲' : '▼'}</span>
            </button>
            {cityOpen && (
              <div className="city-dropdown">
                {cities.map(c => (
                  <button
                    key={c.key}
                    className={`city-dropdown-item ${selectedCity === c.key ? 'active' : ''}`}
                    onClick={() => handleCityChange(c.key)}
                    type="button"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="topbar-right">
            <span className="topbar-phone"><Icon.Phone width="14" height="14" /> {t.phone}</span>
            <button
              className="topbar-callback-btn"
              onClick={() => setCallbackOpen(true)}
              type="button"
            >
              {t.nav_callback}
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="topbar-auth-logged">
                <Link to="/profile" className="topbar-profile-btn" title="Профиль">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="topbar-user-name" title={user?.phone}>
                    {user?.name || user?.phone}
                  </span>
                </Link>
                <button className="topbar-logout-btn" onClick={logout} type="button">
                  Выйти
                </button>
              </div>
            ) : (
              <div className="topbar-auth-buttons">
                <button className="topbar-auth-btn" onClick={openModal} type="button">
                  Войти
                </button>
                <button className="topbar-auth-btn topbar-auth-btn--signup" onClick={() => { openModal() }} type="button">
                  Регистрация
                </button>
              </div>
            )}

            <span
              className={`topbar-lang ${lang === 'ru' ? 'active' : ''}`}
              onClick={() => setLang('ru')}
            >Рус</span>
            <span
              className={`topbar-lang ${lang === 'kz' ? 'active' : ''}`}
              onClick={() => setLang('kz')}
            >Қаз</span>
          </div>
        </div>

        {/* MAIN NAV */}
        <div className="navbar-main">
          <Link to="/" className="navbar-logo">
            <img src="/img/pagefirst/Vector (89).png" alt="STEM Academia" className="navbar-logo-img" />
          </Link>

          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit"><Icon.Search width="16" height="16" /></button>
          </form>

          <div className="navbar-icons">
            <Link to="/favorites" className="nav-icon-btn" title={t.favorite}>
              <div className="cart-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favorites.length > 0 && <span className="cart-badge">{favorites.length}</span>}
              </div>
              <span>{t.favorite}</span>
            </Link>

            <button
              className="nav-icon-btn nav-cart"
              title="Корзина"
              onClick={() => setIsOpen(!isOpen)}
              type="button"
            >
              <div className="cart-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
              </div>
              <span>Корзина</span>
            </button>


            {/* Мобильное меню */}
            <button
              className="nav-icon-btn nav-burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              aria-label="Меню"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* CATEGORY BAR */}
        <nav className="navbar-categories">
          {/* Каталог с dropdown */}
          <div className="cat-dropdown-wrap" ref={catalogRef}>
            <button
              className="cat-link cat-link--catalog"
              onClick={() => setCatalogOpen(!catalogOpen)}
              type="button"
            >
              {t.catalog} <span className="cat-arrow">{catalogOpen ? '▲' : '▼'}</span>
            </button>
            {catalogOpen && (
              <div className="cat-dropdown">
                {catalogCategories.map(cat => (
                  <Link
                    key={cat.path}
                    to={cat.path}
                    className="cat-dropdown-item"
                    onClick={() => setCatalogOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mainNav.map(nav => (
            <Link key={nav.path} to={nav.path} className="cat-link">
              {nav.label}
            </Link>
          ))}
        </nav>

        {/* МОБИЛЬНОЕ МЕНЮ */}
        {mobileOpen && (
          <div className="mobile-menu">
            <form className="mobile-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={t.search}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit"><Icon.Search width="16" height="16" /></button>
            </form>
            <div className="mobile-nav-links">
              <span className="mobile-nav-section">{t.catalog}</span>
              {catalogCategories.map(cat => (
                <Link key={cat.path} to={cat.path} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                  {cat.label}
                </Link>
              ))}
              <span className="mobile-nav-section">Разделы</span>
              {mainNav.map(nav => (
                <Link key={nav.path} to={nav.path} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                  {nav.label}
                </Link>
              ))}
              <button
                className="mobile-callback-btn"
                onClick={() => { setCallbackOpen(true); setMobileOpen(false) }}
                type="button"
              >
                {t.nav_callback}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* МОДАЛЬНОЕ ОКНО ОБРАТНОГО ЗВОНКА */}
      {callbackOpen && <CallbackModal onClose={() => setCallbackOpen(false)} />}
    </>
  )
}
