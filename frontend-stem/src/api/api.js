import axios from 'axios'

// Docker/Nginx: VITE_API_URL="" → BASE_URL="" → relative paths → Nginx proxies /api/ to backend
// Local dev:    VITE_API_URL="http://localhost:8000" in .env.local
// Production:   VITE_API_URL="https://yourdomain.com"
//
// IMPORTANT: fallback must be '' (empty), NOT 'http://localhost:8000'
// In Docker the browser cannot reach port 8000 (it's internal only).
// Relative paths like /api/products go through Nginx which proxies to backend.
const BASE_URL =
  import.meta.env.VITE_API_URL_BACKEND ??
  import.meta.env.VITE_API_URL ??
  ''

// Создание экземпляра axios с базовым URL
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// JWT Interceptor для автоматического добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stem_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor для обработки 401 ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Очистить токен при 401 Unauthorized
      localStorage.removeItem('stem_access_token')
      // Диспатчить событие для глобального логаута
      window.dispatchEvent(new CustomEvent('unauthorized'))
    }
    return Promise.reject(error)
  }
)

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
  try {
    const response = await apiClient.get('/api/products', { params: filteredParams })
    return response.data
  } catch (error) {
    throw new Error(`Ошибка загрузки товаров: ${error.response?.status || error.message}`)
  }
}

export async function getProductById(id) {
  try {
    const response = await apiClient.get(`/api/products/${id}`)
    return response.data
  } catch (error) {
    throw new Error(`Товар не найден: ${id}`)
  }
}

export async function getCategories() {
  try {
    const response = await apiClient.get('/api/categories')
    return response.data
  } catch (error) {
    throw new Error(`Ошибка загрузки категорий: ${error.response?.status || error.message}`)
  }
}



export async function createOrder(data) {
  try {
    const response = await apiClient.post('/api/orders', data)
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.statusText || error.message
    throw new Error(errorMessage || `Ошибка отправки заказа: ${error.response?.status}`)
  }
}

export async function createApplication(data) {
  try {
    const response = await apiClient.post('/api/applications', data)
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.statusText || error.message
    throw new Error(errorMessage || `Ошибка отправки заявки: ${error.response?.status}`)
  }
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
  try {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.statusText
    throw new Error(errorMessage || 'Неверный email или пароль')
  }
}

export async function register(email, password, name, phone = '') {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password, phone })
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.statusText
    throw new Error(errorMessage || 'Ошибка регистрации')
  }
}

export async function getCurrentUser(token) {
  try {
    // Создать временный клиент с токеном для этого запроса
    const response = await apiClient.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user')
  }
}

export function logout() {
  localStorage.removeItem('stem_access_token')
}

export async function sendContactMessage(data) {
  try {
    const response = await apiClient.post('/api/applications/contact', data)
    return response.data
  } catch (error) {
    console.error('sendContactMessage error:', error.response?.status, error.response?.data)
    const detail = error.response?.data?.detail
    let errorMessage
    if (Array.isArray(detail)) {
      // Pydantic validation errors
      errorMessage = detail.map(e => e.msg || e.message).join('; ')
    } else {
      errorMessage = detail || error.response?.statusText || error.message
    }
    throw new Error(errorMessage || `Ошибка отправки сообщения: ${error.response?.status}`)
  }
}