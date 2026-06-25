import { useState, useEffect } from 'react'
import { apiClient } from '../api/api'
import './TermsPage.css'

const TermsPage = () => {
  const [termsData, setTermsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await apiClient.get('/api/terms')
        setTermsData(res.data)
      } catch (err) {
        setError('Не удалось загрузить пользовательское соглашение')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTerms()
  }, [])

  const renderContent = (item) => {
    switch (item.type) {
      case 'heading':
        return <h2 className="terms-heading">{item.text}</h2>
      case 'paragraph':
        return <p className="terms-paragraph">{item.text}</p>
      case 'list':
        return (
          <ul className="terms-list">
            {item.items.map((listItem, idx) => (
              <li key={idx} className="terms-list-item">{listItem}</li>
            ))}
          </ul>
        )
      case 'contact':
        return (
          <div className="terms-contact">
            {item.company && <p><strong>Наименование:</strong> {item.company}</p>}
            {item.address && <p><strong>Адрес:</strong> {item.address}</p>}
            {item.email && <p><strong>E-mail:</strong> <a href={`mailto:${item.email}`}>{item.email}</a></p>}
            {item.website && <p><strong>Сайт:</strong> <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer">{item.website}</a></p>}
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="terms-page">
        <div className="terms-loading">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="terms-page">
        <div className="terms-error">{error}</div>
      </div>
    )
  }

  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1 className="terms-title">{termsData.title}</h1>
        {termsData.last_updated && (
          <p className="terms-updated">Редакция от {new Date(termsData.last_updated).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).split('.').reverse().join('.')}</p>
        )}
        <div className="terms-content">
          {termsData.content.map((item, idx) => (
            <div key={idx} className="terms-section">
              {renderContent(item)}
            </div>
          ))}
        </div>
        <div className="terms-back">
          <a href="/" className="terms-back-link">← Вернуться на главную</a>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
