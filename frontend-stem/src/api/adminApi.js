/**
 * Admin API client
 *
 * BASE_URL resolution:
 *  - Docker production: VITE_API_URL="" (baked in at build time)
 *    → all paths become relative (e.g. "/admin/products")
 *    → Nginx proxies /admin/* → backend:8000/admin/*
 *  - Local dev (npm run dev): VITE_API_URL="http://localhost:8000"
 *    → absolute URL, Vite proxy also covers /admin
 *  - External deploy: VITE_API_URL="https://your-backend.com"
 *    → absolute URL used directly
 */

const BASE_URL =
  import.meta.env.VITE_API_URL_BACKEND ??
  import.meta.env.VITE_API_URL ??
  ''

function getToken() {
  return localStorage.getItem('stem_access_token')
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Core fetch wrapper for all admin requests.
 * - Detects HTML responses (Nginx SPA fallback) and throws a clear error
 * - Handles 204 No Content correctly
 * - Throws Error with the backend's detail message on non-2xx
 */
async function adminFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`

  let res
  try {
    res = await fetch(url, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
    })
  } catch (networkErr) {
    throw new Error('Сервер недоступен. Проверьте соединение.')
  }

  // 204 No Content — DELETE responses
  if (res.status === 204) return null

  const text = await res.text()

  // Detect HTML response — means the request hit Nginx SPA fallback,
  // not the backend. This is the cause of "e.map is not a function".
  if (text.trimStart().startsWith('<!')) {
    throw new Error(
      `Admin API request "${path}" returned HTML instead of JSON. ` +
      `Check that nginx.conf proxies /admin/ to the backend.`
    )
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Неожиданный ответ сервера: ${text.slice(0, 120)}`)
  }

  if (!res.ok) {
    throw new Error(data?.detail || `Ошибка ${res.status}`)
  }

  return data
}

/**
 * Ensure a value is an array before returning it.
 * Prevents "e.map is not a function" if the backend ever changes shape.
 */
function toArray(value, label) {
  if (Array.isArray(value)) return value
  // Some endpoints wrap arrays: { items: [...] } or { data: [...] }
  if (value && Array.isArray(value.items)) return value.items
  if (value && Array.isArray(value.data))  return value.data
  console.warn(`adminApi: expected array for "${label}", got:`, typeof value, value)
  return []
}

// ── Products ──────────────────────────────────────────────────────────────────

export function adminGetProducts() {
  return adminFetch('/admin/products').then(d => toArray(d, 'products'))
}

export function adminCreateProduct(data) {
  return adminFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateProduct(id, data) {
  return adminFetch(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function adminDeleteProduct(id) {
  return adminFetch(`/admin/products/${id}`, { method: 'DELETE' })
}

// ── Categories ────────────────────────────────────────────────────────────────

export function adminGetCategories() {
  return adminFetch('/admin/categories').then(d => toArray(d, 'categories'))
}

export function adminCreateCategory(data) {
  return adminFetch('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateCategory(id, data) {
  return adminFetch(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function adminDeleteCategory(id) {
  return adminFetch(`/admin/categories/${id}`, { method: 'DELETE' })
}

// ── Applications ──────────────────────────────────────────────────────────────

export function adminGetApplications() {
  return adminFetch('/admin/applications').then(d => toArray(d, 'applications'))
}

export function adminDeleteApplication(id) {
  return adminFetch(`/admin/applications/${id}`, { method: 'DELETE' })
}

/**
 * Update application status and/or manager.
 * @param {number} id - Application ID
 * @param {object} data - { status, manager_name, manager_id }
 */
export function adminUpdateApplicationStatus(id, data) {
  return adminFetch(`/admin/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ── Bitrix24 Sync ──────────────────────────────────────────────────────────────

/**
 * Fetch the current Bitrix24 deal status for a single application.
 * Returns { id, status, bitrix_id, bitrix_stage_id, label_ru, manager_name }
 */
export function adminGetBitrixStatus(appId) {
  return adminFetch(`/admin/applications/${appId}/bitrix-status`)
}

/**
 * Bulk sync all applications with bitrix_id from Bitrix24.
 * Returns { synced, errors, total, results[] }
 */
export function adminSyncBitrix() {
  return adminFetch('/admin/bitrix/sync', { method: 'POST' })
}

/**
 * Get the list of all valid status codes and their Russian labels.
 */
export function adminGetStatusLabels() {
  return adminFetch('/admin/bitrix/statuses')
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function adminGetUsers() {
  return adminFetch('/admin/users').then(d => toArray(d, 'users'))
}

// ── Image Upload ───────────────────────────────────────────────────────────────

/**
 * Upload a product image file (multipart/form-data).
 * Returns { url: '/uploads/<uuid>.ext' }
 */
export async function adminUploadImage(file) {
  const url = `${BASE_URL}/api/uploads/image`
  const token = getToken()

  const formData = new FormData()
  formData.append('file', file)

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      // Do NOT set Content-Type — the browser sets it with the boundary
    })
  } catch {
    throw new Error('Сервер недоступен. Проверьте соединение.')
  }

  const text = await res.text()

  if (text.trimStart().startsWith('<!')) {
    throw new Error('Эндпоинт загрузки недоступен (получен HTML). Проверьте nginx.conf.')
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Неожиданный ответ сервера: ${text.slice(0, 120)}`)
  }

  if (!res.ok) {
    throw new Error(data?.detail || `Ошибка загрузки ${res.status}`)
  }

  return data // { url: '/uploads/<uuid>.ext' }
}

// ── Blog Posts ─────────────────────────────────────────────────────────────

export function adminGetBlogPosts() {
  return adminFetch('/admin/blog').then(d => toArray(d, 'blog posts'))
}

export function adminCreateBlogPost(data) {
  return adminFetch('/admin/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateBlogPost(id, data) {
  return adminFetch(`/admin/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function adminDeleteBlogPost(id) {
  return adminFetch(`/admin/blog/${id}`, { method: 'DELETE' })
}
