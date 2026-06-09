import { useState } from 'react'
import { Link } from 'react-router-dom'
import './VisualizePage.css'

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-stem.onrender.com'

const PRODUCT_OPTIONS = [
  { id: 1, label: '🛋 Диван мягкий' },
  { id: 2, label: '📚 Стеллаж деревянный' },
  { id: 3, label: '💡 Освещение LED' },
  { id: 4, label: '🪑 Парта ученическая' },
  { id: 5, label: '🖥 Интерактивная панель' },
  { id: 6, label: '🗄 Шкаф для документов' },
  { id: 7, label: '🪑 Стул эргономичный' },
  { id: 8, label: '🧪 Лабораторный стол' },
  { id: 9, label: '📐 Стол учительский' },
  { id: 10, label: '🖼 Маркерная доска' },
]

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function VisualizePage() {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Пожалуйста загрузите изображение (JPG, PNG)')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Файл слишком большой. Максимум 5MB')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile({ target: { files: [f] } })
  }

  const toggleProduct = (label) => {
    setSelected(prev =>
      prev.includes(label)
        ? prev.filter(p => p !== label)
        : [...prev, label]
    )
  }

  const handleVisualize = async () => {
    if (!file) { setError('Загрузите фото помещения'); return }
    if (selected.length === 0) { setError('Выберите хотя бы один товар'); return }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const imageBase64 = await toBase64(file)

      const res = await fetch(`${API_BASE}/api/ai/visualize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBase64,
          products: selected.map(s => s.replace(/^[^\s]+\s/, '')), 
        }),
      })

      const data = await res.json()

      if (data.success) {
        setResult(data.image)
        setRetryCount(0)
      } else {
        setError(data.error || 'Ошибка генерации')
        if (data.error?.includes('загружается')) {
          setRetryCount(prev => prev + 1)
        }
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = result
    a.download = 'stem-visualization.jpg'
    a.click()
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setSelected([])
    setResult(null)
    setError(null)
  }

  return (
    <div className="viz-page">
      {/* Breadcrumb */}
      <div className="viz-breadcrumb">
        <Link to="/">Главная</Link>
        <span> / </span>
        <span>AI-Визуализация</span>
      </div>

      {/* Header */}
      <div className="viz-header">
        <h1>✨ AI-Визуализация интерьера</h1>
        <p>Загрузите фото вашего помещения, выберите товары — и AI покажет как это будет выглядеть</p>
      </div>

      <div className="viz-layout">
        {/* Левая колонка */}
        <div className="viz-left">

          {/* Загрузка фото */}
          <div className="viz-section">
            <h2>📸 Шаг 1 — Фото помещения</h2>
            <div
              className={`viz-dropzone ${preview ? 'has-file' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !preview && document.getElementById('viz-file-input').click()}
            >
              {preview ? (
                <div className="viz-preview-wrap">
                  <img src={preview} alt="preview" className="viz-preview-img" />
                  <button
                    className="viz-remove-btn"
                    onClick={(e) => { e.stopPropagation(); handleReset() }}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="viz-dropzone-content">
                  <div className="viz-upload-icon">📁</div>
                  <p>Перетащите фото сюда или нажмите для выбора</p>
                  <span>JPG, PNG до 5MB</span>
                </div>
              )}
            </div>
            <input
              id="viz-file-input"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </div>

          {/* Выбор товаров */}
          <div className="viz-section">
            <h2>🛋 Шаг 2 — Выберите товары</h2>
            <p className="viz-section-hint">Выбрано: {selected.length}</p>
            <div className="viz-products-grid">
              {PRODUCT_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`viz-product-chip ${selected.includes(p.label) ? 'active' : ''}`}
                  onClick={() => toggleProduct(p.label)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка */}
          <button
            className="viz-btn-generate"
            onClick={handleVisualize}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <span className="viz-loading-text">
                <span className="viz-spinner" />
                Генерация... (~20 сек)
              </span>
            ) : '✨ Визуализировать'}
          </button>

          {error && (
            <div className="viz-error">
              ⚠️ {error}
              {retryCount > 0 && (
                <button className="viz-retry-btn" onClick={handleVisualize} type="button">
                  🔄 Попробовать снова
                </button>
              )}
            </div>
          )}
        </div>

        {/* Правая колонка — результат */}
        <div className="viz-right">
          <div className="viz-section">
            <h2>🎨 Шаг 3 — Результат</h2>

            {!result && !loading && (
              <div className="viz-result-placeholder">
                <div className="viz-placeholder-icon">🏫</div>
                <p>Здесь появится визуализация вашего интерьера</p>
                <span>Загрузите фото и выберите товары</span>
              </div>
            )}

            {loading && (
              <div className="viz-result-placeholder">
                <div className="viz-generating-animation">
                  <div className="viz-pulse" />
                </div>
                <p>AI генерирует визуализацию...</p>
                <span>Обычно занимает 15-30 секунд</span>
              </div>
            )}

            {result && (
              <div className="viz-result-wrap">
                <div className="viz-compare">
                  <div className="viz-compare-item">
                    <span className="viz-compare-label">До</span>
                    <img src={preview} alt="до" />
                  </div>
                  <div className="viz-compare-arrow">→</div>
                  <div className="viz-compare-item">
                    <span className="viz-compare-label">После</span>
                    <img src={result} alt="после" />
                  </div>
                </div>

                <div className="viz-result-actions">
                  <button className="viz-btn-download" onClick={handleDownload} type="button">
                    💾 Скачать
                  </button>
                  <button className="viz-btn-new" onClick={handleReset} type="button">
                    🔄 Новая визуализация
                  </button>
                </div>

                <div className="viz-result-note">
                  💡 Нравится результат? Оставьте заявку и наши менеджеры помогут с оформлением
                </div>

                <Link to="/catalog" className="viz-btn-catalog">
                  📦 Перейти в каталог
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Инфо-блок */}
      <div className="viz-info-block">
        <div className="viz-info-item">
          <span>⚡</span>
          <p>Результат за 15-30 секунд</p>
        </div>
        <div className="viz-info-item">
          <span>🆓</span>
          <p>Полностью бесплатно</p>
        </div>
        <div className="viz-info-item">
          <span>🎯</span>
          <p>Подбор под ваше помещение</p>
        </div>
        <div className="viz-info-item">
          <span>📱</span>
          <p>Работает на телефоне</p>
        </div>
      </div>
    </div>
  )
}