// Docker/Nginx:  VITE_API_URL=""  → BASE_URL=""  → relative paths → Nginx proxies /api/ to backend
// Local dev:     VITE_API_URL not set → undefined ?? fallback → 'http://localhost:8000'
// Production:    VITE_API_URL="https://yourdomain.com" → direct URL
const BASE_URL =
  import.meta.env.VITE_API_URL_BACKEND ??
  import.meta.env.VITE_API_URL ??
  'http://localhost:8000'


export function getImageUrl(img) {
  if (!img || img === 'null' || img === 'undefined') return '/img/placeholder.png'
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  if (img.startsWith('/')) return img
  if (img.startsWith('img/')) return `/${img}`
  return `/img/${img}`
}



export async function getProducts(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
  )
  const query = new URLSearchParams(filteredParams).toString()
  const url = `${BASE_URL}/api/products${query ? '?' + query : ''}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Ошибка загрузки товаров: ${res.status}`)
  return res.json()
}

export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`)
  if (!res.ok) throw new Error(`Товар не найден: ${id}`)
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/api/categories`)
  if (!res.ok) throw new Error(`Ошибка загрузки категорий: ${res.status}`)
  return res.json()
}



export async function createOrder(data) {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `Ошибка отправки заказа: ${res.status}`)
  }
  return res.json()
}

export async function createApplication(data) {
  const res = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `Ошибка отправки заявки: ${res.status}`)
  }
  return res.json()
}

export async function chatWithGrok(message, messages = []) {
  const res = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      messages,
    })
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `Ошибка Grok AI: ${res.status}`)
  }

  return res.json()
}



export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Неверный email или пароль')
  }
  return res.json()
}

export async function register(email, password, name, phone = '') {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка регистрации')
  }
  return res.json()
}

export async function getCurrentUser(token) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

export function logout() {
  localStorage.removeItem('stem_access_token')
}