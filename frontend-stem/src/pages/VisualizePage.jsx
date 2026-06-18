import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import Icon from '../components/Icons'
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
  const { isAuthenticated, openModal } = useAuth()
  const { lang } = useLang()
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [productsLoading, setProductsLoading] = useState(true)
  const [remaining, setRemaining] = useState(null)
  const [dailyLimit, setDailyLimit] = useState(2)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCats, setExpandedCats] = useState({})

  // Fetch remaining visualizations for today
  useEffect(() => {
    if (!isAuthenticated) return
    apiClient.get('/api/ai/visualize/status')
      .then(res => {
        setRemaining(res.data.remaining)
        setDailyLimit(res.data.daily_limit)
      })
      .catch(() => {})
  }, [isAuthenticated])

  // Load categories and products
  useEffect(() => {
    Promise.all([
      apiClient.get('/api/categories').then(res => res.data || []),
      apiClient.get('/api/products').then(res => res.data || []),
    ])
      .then(([cats, prods]) => {
        setCategories(cats)
        setAllProducts(prods.map(p => ({
          id: p.id,
          label: p.title,
          article: p.article || '',
          img: p.img || '',
          category_slug: p.category_slug || '',
          category_title: p.category?.title_ru || '',
        })))
      })
      .catch(() => {
        setCategories([])
        setAllProducts([])
      })
      .finally(() => setProductsLoading(false))
  }, [])

  // Group products by category
  const productsByCategory = useMemo(() => {
    const groups = {}
    allProducts.forEach(p => {
      const slug = p.category_slug || '_uncategorized'
      if (!groups[slug]) groups[slug] = []
      groups[slug].push(p)
    })
    return groups
  }, [allProducts])

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return null // null = no filter
    const q = searchQuery.toLowerCase()
    return allProducts.filter(p =>
      p.label.toLowerCase().includes(q) ||
      p.article.toLowerCase().includes(q) ||
      p.category_title.toLowerCase().includes(q)
    )
  }, [allProducts, searchQuery])

  const toggleCategory = (slug) => {
    setExpandedCats(prev => ({ ...prev, [slug]: !prev[slug] }))
  }

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

  const toggleProduct = (product) => {
    setSelected(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev.filter(p => p.id !== product.id)
      return [...prev, product]
    })
  }

  const removeSelected = (id) => {
    setSelected(prev => prev.filter(p => p.id !== id))
  }

  const handleVisualize = async () => {
    if (!isAuthenticated) { openModal(); return }
    if (!file) { setError('Загрузите фото помещения'); return }
    if (selected.length === 0) { setError('Выберите хотя бы один товар'); return }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const imageBase64 = await toBase64(file)
      const productDescriptions = selected.map(s => {
        let desc = s.label
        if (s.article) desc += ` (${s.article})`
        return desc
      })
      const baseUrl = window.location.origin
      const absoluteUrls = selected
        .map(s => {
          if (!s.img) return null
          if (s.img.startsWith('http')) return s.img
          return `${baseUrl}${s.img.startsWith('/') ? '' : '/'}${s.img}`
        })
        .filter(Boolean)

      const res = await apiClient.post('/api/ai/visualize', {
        image: imageBase64,
        products: productDescriptions,
        product_images: absoluteUrls,
      })

      const data = res.data
      if (data.success) {
        setResult(data.image)
        setRetryCount(0)
        if (data.remaining !== undefined) setRemaining(data.remaining)
      } else {
        setError(data.error || 'Ошибка генерации')
        if (data.error?.includes('загружается')) setRetryCount(prev => prev + 1)
      }
    } catch (err) {
      setError('Ошибка соединения с сервером: ' + (err.response?.data?.detail || err.message))
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

  // Build sorted category list: match categories from API, then uncategorized
  const sortedCategories = useMemo(() => {
    const apiSlugs = new Set(categories.map(c => c.slug))
    const result = categories.map(c => ({
      slug: c.slug,
      title: lang === 'kz' ? c.title_kz : c.title_ru,
      img: c.img,
      path: c.path,
      count: (productsByCategory[c.slug] || []).length,
    }))
    // Add uncategorized if exists
    if (productsByCategory['_uncategorized']) {
      result.push({
        slug: '_uncategorized',
        title: lang === 'kz' ? 'Басқа' : 'Другое',
        img: null,
        path: null,
        count: productsByCategory['_uncategorized'].length,
      })
    }
    return result.filter(c => c.count > 0)
  }, [categories, productsByCategory, lang])

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="viz-page">
        <div className="viz-auth-gate">
          <div className="viz-auth-icon"><Icon.Lock width="32" height="32" /></div>
          <h2>Требуется авторизация</h2>
          <p>Для использования AI-визуализации необходимо войти в аккаунт</p>
          <button className="viz-auth-btn" onClick={openModal}>
            Войти / Регистрация
          </button>
        </div>
      </div>
    )
  }

  const isSearching = filteredProducts !== null

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
        <h1><Icon.Sparkles width="24" height="24" /> AI-Визуализация интерьера</h1>
        <p>Загрузите фото вашего помещения, выберите товары — и AI покажет как это будет выглядеть</p>
        {remaining !== null && (
          <div className="viz-counter">
            Осталось визуализаций сегодня: <strong>{remaining}</strong> из {dailyLimit}
          </div>
        )}
      </div>

      <div className="viz-layout">
        {/* Левая колонка */}
        <div className="viz-left">

          {/* Загрузка фото */}
          <div className="viz-section">
            <h2><Icon.Camera width="20" height="20" /> Шаг 1 — Фото помещения</h2>
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
                    <Icon.X width="14" height="14" />
                  </button>
                </div>
              ) : (
                <div className="viz-dropzone-content">
                  <div className="viz-upload-icon"><Icon.Upload width="32" height="32" /></div>
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
            <h2><Icon.Sofa width="20" height="20" /> Шаг 2 — Выберите товары</h2>

            {/* Search bar */}
            <div className="viz-search-bar">
              <span className="viz-search-icon"><Icon.Search width="16" height="16" /></span>
              <input
                type="text"
                placeholder="Поиск по названию, артикулу или категории..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="viz-search-input"
              />
              {searchQuery && (
                <button className="viz-search-clear" onClick={() => setSearchQuery('')} type="button"><Icon.X width="14" height="14" /></button>
              )}
              <span className="viz-selected-badge">{selected.length} выбрано</span>
            </div>

            {/* Selected products pills */}
            {selected.length > 0 && (
              <div className="viz-selected-list">
                {selected.map(s => (
                  <span key={s.id} className="viz-selected-pill">
                    {s.label}
                    <button type="button" onClick={() => removeSelected(s.id)}><Icon.X width="12" height="12" /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Product browser */}
            {productsLoading ? (
              <div className="viz-loading-products"><Icon.Clock width="16" height="16" /> Загрузка товаров...</div>
            ) : isSearching ? (
              /* Search results - flat list */
              <div className="viz-search-results">
                {filteredProducts.length === 0 ? (
                  <div className="viz-no-results">Ничего не найдено по запросу «{searchQuery}»</div>
                ) : (
                  filteredProducts.map((p) => {
                    const isSelected = selected.some(s => s.id === p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`viz-product-card ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleProduct(p)}
                      >
                        {p.img && (
                          <img
                            src={p.img}
                            alt={p.label}
                            className="viz-product-card-img"
                            onError={e => { e.target.style.display = 'none' }}
                          />
                        )}
                        <div className="viz-product-card-info">
                          <span className="viz-product-card-title">{p.label}</span>
                          {p.article && <span className="viz-product-card-article">Арт. {p.article}</span>}
                        </div>
                        <span className={`viz-product-card-check ${isSelected ? 'checked' : ''}`}>
                          {isSelected ? <Icon.Check width="14" height="14" /> : ''}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            ) : (
              /* Category accordion */
              <div className="viz-categories">
                {sortedCategories.map((cat) => {
                  const isExpanded = expandedCats[cat.slug]
                  const products = productsByCategory[cat.slug] || []
                  return (
                    <div key={cat.slug} className={`viz-category ${isExpanded ? 'expanded' : ''}`}>
                      <button
                        type="button"
                        className="viz-category-header"
                        onClick={() => toggleCategory(cat.slug)}
                      >
                        <span className="viz-category-arrow">{isExpanded ? '▼' : '▶'}</span>
                        <span className="viz-category-title">{cat.title}</span>
                        <span className="viz-category-count">{products.length}</span>
                      </button>
                      {isExpanded && (
                        <div className="viz-category-products">
                          {products.map((p) => {
                            const isSelected = selected.some(s => s.id === p.id)
                            return (
                              <button
                                key={p.id}
                                type="button"
                                className={`viz-product-card ${isSelected ? 'active' : ''}`}
                                onClick={() => toggleProduct(p)}
                              >
                                {p.img && (
                                  <img
                                    src={p.img}
                                    alt={p.label}
                                    className="viz-product-card-img"
                                    onError={e => { e.target.style.display = 'none' }}
                                  />
                                )}
                                <div className="viz-product-card-info">
                                  <span className="viz-product-card-title">{p.label}</span>
                                  {p.article && <span className="viz-product-card-article">Арт. {p.article}</span>}
                                </div>
                                <span className={`viz-product-card-check ${isSelected ? 'checked' : ''}`}>
                                  {isSelected ? <Icon.Check width="14" height="14" /> : ''}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
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
                Генерация... (~30 сек)
              </span>
            ) : <><Icon.Sparkles width="16" height="16" /> Визуализировать</>}
          </button>

          {error && (
            <div className="viz-error">
              <Icon.AlertTriangle width="16" height="16" /> {error}
              {retryCount > 0 && (
                <button className="viz-retry-btn" onClick={handleVisualize} type="button">
                  <Icon.RefreshCw width="16" height="16" /> Попробовать снова
                </button>
              )}
            </div>
          )}
        </div>

        {/* Правая колонка — результат */}
        <div className="viz-right">
          <div className="viz-section">
            <h2><Icon.Palette width="20" height="20" /> Шаг 3 — Результат</h2>

            {!result && !loading && (
              <div className="viz-result-placeholder">
                <div className="viz-placeholder-icon"><Icon.School width="40" height="40" /></div>
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
                <span>Обычно занимает 60 секунд</span>
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
                    <Icon.ArrowRight width="16" height="16" /> Скачать
                  </button>
                  <button className="viz-btn-new" onClick={handleReset} type="button">
                    <Icon.RefreshCw width="16" height="16" /> Новая визуализация
                  </button>
                </div>

                <div className="viz-result-note">
                  <Icon.Lightbulb width="16" height="16" /> Нравится результат? Оставьте заявку и наши менеджеры помогут с оформлением
                </div>

                <Link to="/catalog" className="viz-btn-catalog">
                  <Icon.Package width="16" height="16" /> Перейти в каталог
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Инфо-блок */}
      <div className="viz-info-block">
        <div className="viz-info-item">
          <span><Icon.Zap width="20" height="20" /></span>
          <p>Результат за  секунд</p>
        </div>
        <div className="viz-info-item">
          <span><Icon.CheckCircle width="20" height="20" /></span>
          <p>Полностью бесплатно</p>
        </div>
        <div className="viz-info-item">
          <span><Icon.Target width="20" height="20" /></span>
          <p>Подбор под ваше помещение</p>
        </div>
        <div className="viz-info-item">
          <span><Icon.Smartphone width="20" height="20" /></span>
          <p>Работает на телефоне</p>
        </div>
      </div>
    </div>
  )
}
