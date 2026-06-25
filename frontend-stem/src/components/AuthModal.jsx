import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Icon from './Icons'
import './AuthModal.css'

export default function AuthModal() {
  const { showModal, login, register, closeModal } = useAuth()

  const [mode, setMode] = useState('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && showModal) closeModal()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeModal, showModal])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showModal])

  if (!showModal) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (mode === 'register' && !agreePrivacy) {
      setError('Пожалуйста, примите политику конфиденциальности')
      return
    }
    if (mode === 'register' && !agreeTerms) {
      setError('Пожалуйста, примите пользовательское соглашение')
      return
    }
    
    setLoading(true)
    try {
      if (mode === 'register') {
        await register(phone, password)
      } else {
        await login(phone, password)
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
  }

  return (
    <div className="auth-backdrop" onClick={closeModal}>
      <div className="auth-box" onClick={e => e.stopPropagation()}>

        <div className="auth-box__logo">
          <img src="/img/pagefirst/Vector (89).png" alt="STEM Academia" className="auth-logo-img" />
        </div>

        <div className="auth-box__tabs">
          <button
            className={`auth-box__tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
            type="button"
          >Войти</button>
          <button
            className={`auth-box__tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
            type="button"
          >Регистрация</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-box__form">
          <div className="auth-box__field">
            <label>Номер телефона</label>
            <input
              type="tel"
              placeholder="+7 (777) 000-00-00"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-box__field">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {error && <div className="auth-box__error">{error}</div>}

          {mode === 'register' && (
            <div className="auth-box__checkbox">
              <input
                type="checkbox"
                id="privacy-agree"
                checked={agreePrivacy}
                onChange={e => setAgreePrivacy(e.target.checked)}
                required
              />
              <label htmlFor="privacy-agree">
                Я принимаю{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  политику конфиденциальности
                </a>
              </label>
            </div>
          )}
          {mode === 'register' && (
            <div className="auth-box__checkbox">
              <input
                type="checkbox"
                id="terms-agree"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms-agree">
                Я принимаю{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  пользовательское соглашение
                </a>
              </label>
            </div>
          )}

          <button type="submit" className="auth-box__submit" disabled={loading}>
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="auth-box__switch">
          {mode === 'login' ? (
            <>Нет аккаунта? <button type="button" onClick={() => switchMode('register')} className="link-btn">Зарегистрироваться</button></>
          ) : (
            <>Уже есть аккаунт? <button type="button" onClick={() => switchMode('login')} className="link-btn">Войти</button></>
          )}
        </p>

        <button
          className="auth-box__close"
          onClick={(e) => { e.stopPropagation(); closeModal() }}
          type="button"
          aria-label="Закрыть"
          style={{
            position: 'absolute', top: '15px', right: '15px',
            background: 'none', border: 'none', fontSize: '28px',
            cursor: 'pointer', zIndex: 100, width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0', color: '#666', transition: 'color 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.color = '#000'}
          onMouseOut={e => e.currentTarget.style.color = '#666'}
        ><Icon.X width="16" height="16" /></button>

      </div>
    </div>
  )
}