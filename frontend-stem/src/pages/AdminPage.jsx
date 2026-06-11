import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetApplications,
  adminDeleteApplication,
  adminGetUsers,
  adminGetCategories,
} from '../api/adminApi'
import './AdminPage.css'

// ─── Small reusable components ────────────────────────────────────────────────

function Spinner() {
  return <div className="admin-loading">⏳ Загрузка...</div>
}

function ErrorBox({ message }) {
  if (!message) return null
  return <div className="admin-error">⚠️ {message}</div>
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product
  const [form, setForm] = useState({
    title: product?.title ?? '',
    img: product?.img ?? '',
    description_ru: product?.description_ru ?? '',
    description_kz: product?.description_kz ?? '',
    material_ru: product?.material_ru ?? '',
    material_kz: product?.material_kz ?? '',
    size: product?.size ?? '',
    article: product?.article ?? '',
    in_stock: product?.in_stock ?? true,
    category_slug: product?.category_slug ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Название товара обязательно')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        img: form.img || null,
        description_ru: form.description_ru || null,
        description_kz: form.description_kz || null,
        material_ru: form.material_ru || null,
        material_kz: form.material_kz || null,
        size: form.size || null,
        article: form.article || null,
        category_slug: form.category_slug || null,
      }
      if (isEdit) {
        await adminUpdateProduct(product.id, payload)
      } else {
        await adminCreateProduct(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-modal__title">
          {isEdit ? `Редактировать: ${product.title}` : 'Добавить товар'}
        </h3>
        <ErrorBox message={error} />
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__field">
            <label>Название *</label>
            <input value={form.title} onChange={set('title')} required />
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label>Артикул</label>
              <input value={form.article} onChange={set('article')} />
            </div>
            <div className="admin-form__field">
              <label>Категория</label>
              <select value={form.category_slug} onChange={set('category_slug')}>
                <option value="">— Без категории —</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title_ru} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form__field">
            <label>URL изображения</label>
            <input value={form.img} onChange={set('img')} placeholder="/img/..." />
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label>Описание (RU)</label>
              <textarea rows={3} value={form.description_ru} onChange={set('description_ru')} />
            </div>
            <div className="admin-form__field">
              <label>Описание (KZ)</label>
              <textarea rows={3} value={form.description_kz} onChange={set('description_kz')} />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label>Материал (RU)</label>
              <input value={form.material_ru} onChange={set('material_ru')} />
            </div>
            <div className="admin-form__field">
              <label>Материал (KZ)</label>
              <input value={form.material_kz} onChange={set('material_kz')} />
            </div>
          </div>

          <div className="admin-form__field">
            <label>Размер</label>
            <input value={form.size} onChange={set('size')} placeholder="180x80x85 см" />
          </div>

          <div className="admin-form__check-row">
            <input
              type="checkbox"
              id="in_stock"
              checked={form.in_stock}
              onChange={set('in_stock')}
            />
            <label htmlFor="in_stock" style={{ textTransform: 'none', fontSize: '14px', cursor: 'pointer' }}>
              В наличии
            </label>
          </div>

          <div className="admin-form__actions">
            <button type="button" className="admin-btn admin-btn--secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-modal__title">Подтверждение</h3>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 22 }}>{message}</p>
        <div className="admin-form__actions">
          <button className="admin-btn admin-btn--secondary" onClick={onCancel}>
            Отмена
          </button>
          <button className="admin-btn admin-btn--danger" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | product object (edit)
  const [confirmDelete, setConfirmDelete] = useState(null) // null | { id, title }

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [prods, cats] = await Promise.all([adminGetProducts(), adminGetCategories()])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete(id) {
    try {
      await adminDeleteProduct(id)
      setConfirmDelete(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Товары ({products.length})</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal('create')}>
          + Добавить товар
        </button>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="admin-empty">Товаров пока нет. Добавьте первый!</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Фото</th>
                <th>Название</th>
                <th>Артикул</th>
                <th>Категория</th>
                <th>Наличие</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={p.title}
                        className="admin-table__img"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span style={{ color: '#ccc', fontSize: 11 }}>—</span>
                    )}
                  </td>
                  <td style={{ maxWidth: 220, fontWeight: 500 }}>{p.title}</td>
                  <td style={{ color: '#888', fontSize: 12 }}>{p.article || '—'}</td>
                  <td style={{ fontSize: 12 }}>{p.category_slug || '—'}</td>
                  <td>
                    <span className={`badge ${p.in_stock ? 'badge--green' : 'badge--red'}`}>
                      {p.in_stock ? 'Есть' : 'Нет'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                        onClick={() => setModal(p)}
                      >
                        ✏️ Изменить
                      </button>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => setConfirmDelete({ id: p.id, title: p.title })}
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Вы уверены, что хотите удалить товар "${confirmDelete.title}"? Это действие нельзя отменить.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}

// ─── Applications Tab ─────────────────────────────────────────────────────────

function ApplicationsTab() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminGetApplications()
      setApplications(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete(id) {
    try {
      await adminDeleteApplication(id)
      setConfirmDelete(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Заявки ({applications.length})</h2>
        <button className="admin-btn admin-btn--secondary" onClick={load}>
          🔄 Обновить
        </button>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <div className="admin-empty">Заявок пока нет.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Товар</th>
                <th>Комментарий</th>
                <th>Статус</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                    {a.created_at || '—'}
                  </td>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td style={{ fontSize: 12 }}>{a.phone}</td>
                  <td style={{ maxWidth: 180, fontSize: 13 }}>{a.product_name || '—'}</td>
                  <td style={{ maxWidth: 200, fontSize: 12, color: '#666' }}>
                    {a.comment || '—'}
                  </td>
                  <td>
                    <span className="badge badge--blue">{a.status || 'new'}</span>
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => setConfirmDelete({ id: a.id, name: a.name })}
                    >
                      🗑️ Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Удалить заявку от "${confirmDelete.name}"? Это действие нельзя отменить.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminGetUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Пользователи ({users.length})</h2>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <Spinner />
      ) : users.length === 0 ? (
        <div className="admin-empty">Пользователей нет.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ fontSize: 13, color: '#888' }}>{u.phone || '—'}</td>
                  <td>
                    <span className={`badge ${u.is_admin ? 'badge--blue' : 'badge--green'}`}>
                      {u.is_admin ? '👑 Администратор' : 'Пользователь'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'products',     label: '📦 Товары' },
  { id: 'applications', label: '📋 Заявки' },
  { id: 'users',        label: '👤 Пользователи' },
]

export default function AdminPage() {
  const { user, isAdmin, isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')

  // Wait for AuthContext to finish loading before making access decision
  if (loading) {
    return <div className="admin-denied"><div className="admin-loading">⏳ Проверка доступа...</div></div>
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="admin-denied">
        <div className="admin-denied__code">401</div>
        <p className="admin-denied__msg">Для доступа необходимо войти в аккаунт.</p>
        <button className="admin-btn admin-btn--primary" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    )
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="admin-denied">
        <div className="admin-denied__code">403</div>
        <p className="admin-denied__msg">У вас нет прав администратора.</p>
        <button className="admin-btn admin-btn--primary" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {/* ── Header ── */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <span>STEM</span>Academia — Панель администратора
        </div>
        <div className="admin-header__meta">
          <span>👤 {user.name}</span>
          <button
            className="admin-header__logout"
            onClick={() => { logout(); navigate('/') }}
          >
            Выйти
          </button>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="admin-content">
        {activeTab === 'products'     && <ProductsTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'users'        && <UsersTab />}
      </div>
    </div>
  )
}
