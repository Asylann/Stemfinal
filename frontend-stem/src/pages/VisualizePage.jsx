import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { apiClient } from '../api/api'
import './VisualizePage.css'

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function VisualizePage() {
  const { t } = useLang()
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [productOptions, setProductOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [productsLoading, setProductsLoading] = useState(true)

  // Load real products from API
  useEffect(() => {
    apiClient.get('/api/products')
      .then(res => {
        const products = (res.data || []).map(p => ({
          id: p.id,
          label: p.title,
          article: p.article || '',
          img: p.img || '',
        }))
        setProductOptions(products)
      })
      .catch(() => {
        // Fallback if API fails
        setProductOptions([
          { id: 1, label: '🛋 Диван мягкий' },
          { id: 2, label: '📚 Стеллаж деревянный' },
          { id: 3, label: '💡 Освещение LED' },
        ])
      })
      .finally(() => setProductsLoading(false))
  }, [])

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError(t.visualize_error_upload || 'Пожалуйста загрузите изображение (JPG, PNG)')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError(t.visualize_error_upload || 'Файл слишком большой. Максимум 5MB')
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

  const toggleProduct = (product) => {
    setSelected(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev.filter(p => p.id !== product.id)
      return [...prev, product]
    })
  }

  const handleVisualize = async () => {
    if (!file) { setError(t.visualize_error_no_file); return }
    if (selected.length === 0) { setError(t.visualize_error_no_product); return }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const imageBase64 = await toBase64(file)

      // Build product descriptions for the AI prompt
      const productDescriptions = selected.map(s => {
        let desc = s.label
        if (s.article) desc += ` (${s.article})`
        return desc
      })

      // Collect product image URLs for visual reference
      const productImageUrls = selected
        .map(s => s.img)
        .filter(url => url && url.startsWith('http'))

      // If product images are relative paths (e.g. /uploads/...), make them absolute
      const baseUrl = window.location.origin
      const absoluteUrls = selected
        .map(s => {
          if (!s.img) return null
          if (s.img.startsWith('http')) return s.img
          return `${baseUrl}${s.img.startsWith('/') ? '' : '/'}${s.img}`
        })
        .filter(Boolean)

      console.log('Sending product images:', absoluteUrls)

      const res = await apiClient.post('/api/ai/visualize', {
        image: imageBase64,
        products: productDescriptions,
        product_images: absoluteUrls,
      })

      const data = res.data

      if (data.success) {
        setResult(data.image)
        setRetryCount(0)
      } else {
        setError(data.error || t.visualize_error_generate || 'Ошибка генерации')
        if (data.error?.includes('загружается')) {
          setRetryCount(prev => prev + 1)
        }
      }
    } catch (err) {
      setError(t.visualize_error_generate + ': ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = result
    a.download = 'stem-visualization.png'
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
        <Link to="/">{t.home}</Link>
        <span> / </span>
        <span>{t.visualize_title}</span>
      </div>

      {/* Header */}
      <div className="viz-header">
        <h1>✨ {t.visualize_title}</h1>
        <p>{t.visualize_upload_desc}</p>
      </div>

      <div className="viz-layout">
        {/* Левая колонка */}
        <div className="viz-left">

          {/* Загрузка фото */}
          <div className="viz-section">
            <h2>📸 {t.visualize_upload_title}</h2>
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
                  <p>{t.visualize_upload_desc}</p>
                  <span>{t.visualize_upload_formats}</span>
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
            <h2>🛋 {t.visualize_products_title}</h2>
            <p className="viz-section-hint">{t.visualize_products_selected}: {selected.length}</p>
            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>⏳ {t.loading}...</div>
            ) : (
              <div className="viz-products-grid">
                {productOptions.map((p) => {
                  const isSelected = selected.some(s => s.id === p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`viz-product-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleProduct(p)}
                      title={p.article ? `Артикул: ${p.article}` : ''}
                    >
                      {p.img && (
                        <img
                          src={p.img}
                          alt={p.label}
                          style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4, marginRight: 6 }}
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      )}
                      <span style={{ flex: 1, textAlign: 'left', fontSize: 13 }}>{p.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
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
                {t.visualize_generating} (~30 {t.visualize_generating.includes('сек') ? '' : 'сек'})
              </span>
            ) : '✨ ' + t.visualize_generate_btn}
          </button>

          {error && (
            <div className="viz-error">
              ⚠️ {error}
              {retryCount > 0 && (
                <button className="viz-retry-btn" onClick={handleVisualize} type="button">
                  🔄 {t.visualize_try_again_btn}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Правая колонка — результат */}
        <div className="viz-right">
          <div className="viz-section">
            <h2>🎨 {t.visualize_result_title}</h2>

            {!result && !loading && (
              <div className="viz-result-placeholder">
                <div className="viz-placeholder-icon">🏫</div>
                <p>{t.visualize_result_title}</p>
                <span>{t.visualize_upload_title}</span>
              </div>
            )}

            {loading && (
              <div className="viz-result-placeholder">
                <div className="viz-generating-animation">
                  <div className="viz-pulse" />
                </div>
                <p>{t.visualize_generating}</p>
                <span>20-40 {t.visualize_generating.includes('сек') ? '' : 'сек'}</span>
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
                    💾 {t.visualize_download_btn}
                  </button>
                  <button className="viz-btn-new" onClick={handleReset} type="button">
                    🔄 {t.visualize_try_again_btn}
                  </button>
                </div>

                <div className="viz-result-note">
                  💡 {t.visualize_result_note || 'Нравится результат? Оставьте заявку и наши менеджеры помогут с оформлением'}
                </div>

                <Link to="/catalog" className="viz-btn-catalog">
                  📦 {t.visualize_go_catalog || 'Перейти в каталог'}
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
          <p>{t.visualize_info_time || 'Результат за 20-40 секунд'}</p>
        </div>
        <div className="viz-info-item">
          <span>🆓</span>
          <p>{t.visualize_info_free || 'Полностью бесплатно'}</p>
        </div>
        <div className="viz-info-item">
          <span>🎯</span>
          <p>{t.visualize_info_custom || 'Подбор под ваше помещение'}</p>
        </div>
        <div className="viz-info-item">
          <span>📱</span>
          <p>{t.visualize_info_mobile || 'Работает на телефоне'}</p>
        </div>
      </div>
    </div>
  )
}
