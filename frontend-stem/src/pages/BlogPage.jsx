import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { getBlogPosts } from '../api/api'
import './InfoPage.css'

export default function BlogPage() {
  const { t } = useLang()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.blog_title}
      </div>

      <div className="info-hero">
        <h1>{t.blog_title}</h1>
        <p>{t.blog_intro}</p>
      </div>

      <div className="info-body">
        <section className="info-section">
          <h2>{t.blog_all_posts}</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
              ⏳ {t.blog_loading}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
              {t.blog_no_posts}
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug || post.id}`} className="blog-card">
                  <div className="blog-card__img">
                    {post.img && (
                      <img src={post.img} alt={post.title} />
                    )}
                  </div>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span className="blog-card__date">
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                          : ''}
                      </span>
                      {post.category && (
                        <span className="blog-card__category">{post.category}</span>
                      )}
                    </div>
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <span className="blog-card__link">{t.blog_read_more} →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="info-cta-block">
          <h2>{t.blog_subscribe_title}</h2>
          <p>{t.blog_subscribe_text}</p>
          <Link to="/contacts" className="info-cta-btn">{t.blog_subscribe_btn}</Link>
        </div>
      </div>
    </div>
  )
}
