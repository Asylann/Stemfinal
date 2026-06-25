import { useState, useEffect } from 'react'
import { apiClient } from '../api/api'
import './PrivacyPage.css'

export default function PrivacyPage() {
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiClient.get('/api/privacy')
      .then(res => {
        setPolicy(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load privacy policy:', err)
        setError('Не удалось загрузить политику конфиденциальности')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="privacy-page">
        <div className="privacy-loading">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="privacy-page">
        <div className="privacy-error">{error}</div>
      </div>
    )
  }

  if (!policy) return null

  const renderContent = (item) => {
    switch (item.type) {
      case 'heading':
        return <h2 className="privacy-heading">{item.text}</h2>
      
      case 'paragraph':
        return <p className="privacy-paragraph">{item.text}</p>
      
      case 'list':
        return (
          <ul className="privacy-list">
            {item.items.map((listItem, idx) => (
              <li key={idx} className="privacy-list-item">{listItem}</li>
            ))}
          </ul>
        )
      
      case 'contact':
        return (
          <div className="privacy-contact">
            {item.phone && (
              <p className="privacy-contact-item">
                <strong>Телефон:</strong>{' '}
                <a href={`tel:${item.phone}`}>{item.phone}</a>
              </p>
            )}
            {item.email && (
              <p className="privacy-contact-item">
                <strong>Email:</strong>{' '}
                <a href={`mailto:${item.email}`}>{item.email}</a>
              </p>
            )}
            {item.address && (
              <p className="privacy-contact-item">
                <strong>Адрес:</strong> {item.address}
              </p>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1 className="privacy-title">{policy.title}</h1>
        
        {policy.last_updated && (
          <p className="privacy-updated">
            Дата последнего обновления: {new Date(policy.last_updated).toLocaleDateString('ru-RU')}
          </p>
        )}

        <div className="privacy-content">
          {policy.content.map((item, idx) => (
            <div key={idx} className="privacy-section">
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
