import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLoginPage.css'

export default function AdminLoginPage() {
  const { isAuthenticated, isAdmin, loading, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  // Already logged in as admin → skip login page
  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [loading, isAuthenticated, isAdmin, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const userData = await login(email.trim(), password)
      if (!userData?.is_admin) {
        setError('У этого аккаунта нет прав администратора.')
        return
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      const msg = err?.message || ''
      if (msg.includes('401') || msg.toLowerCase().includes('неверный')) {
        setError('Неверный email или пароль.')
      } else if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Сервер недоступен. Проверьте соединение.')
      } else {
        setError(msg || 'Произошла ошибка. Попробуйте ещё раз.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="alog-wrapper">
        <div className="alog-card">
          <p className="alog-checking">⏳ Проверка сессии...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="alog-wrapper">
      <div className="alog-card">

        {/* Brand mark */}
        <div className="alog-brand">
          <img src="/img/pagefirst/Vector (89).png" alt="STEM Academia" className="alog-brand__img" />
        </div>

        <p className="alog-subtitle">Панель администратора</p>

        <form className="alog-form" onSubmit={handleSubmit} noValidate>

          <div className="alog-field">
            <label htmlFor="alog-email">Email</label>
            <input
              id="alog-email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="alog-field">
            <label htmlFor="alog-password">Пароль</label>
            <div className="alog-pwd-wrap">
              <input
                id="alog-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
              <button
                type="button"
                className="alog-pwd-toggle"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
                aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div className="alog-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="alog-submit"
            disabled={submitting}
          >
            {submitting ? 'Вход...' : 'Войти'}
          </button>

        </form>

        <a href="/" className="alog-back">← Вернуться на сайт</a>

      </div>
    </div>
  )
}
