import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { getBlogPosts, getBlogPost } from '../api/api'
import './InfoPage.css'

export default function BlogPostDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const [post, setPost] = useState(null)
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    Promise.all([getBlogPost(id), getBlogPosts()])
      .then(([postData, allData]) => {
        setPost(postData)
        setAllPosts(allData)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="info-page" style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
        ⏳ Загрузка...
      </div>
    )
  }

  if (notFound || !post) {
    return <Navigate to="/blog" replace />
  }

  // Find adjacent posts for navigation
  const currentIndex = allPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  const dateStr = post.created_at
    ? new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / <Link to="/blog">{t.blog_title}</Link> / {post.title}
      </div>

      {/* Hero image */}
      {post.img && (
        <div className="blog-detail-hero" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${post.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '340px',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '48px 40px',
        }}>
          <div style={{ color: '#fff', maxWidth: '800px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', opacity: 0.85 }}>{dateStr}</span>
              {post.category && (
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 10px',
                  borderRadius: '10px',
                  fontWeight: 600,
                }}>{post.category}</span>
              )}
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, lineHeight: 1.3, margin: 0 }}>
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* If no image, show title block */}
      {!post.img && (
        <div className="info-hero">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', justifyContent: 'center' }}>
            <span style={{ fontSize: '13px', color: '#888' }}>{dateStr}</span>
            {post.category && (
              <span style={{
                fontSize: '11px',
                background: '#e8f0eb',
                padding: '2px 10px',
                borderRadius: '10px',
                fontWeight: 600,
                color: '#2d6a4f',
              }}>{post.category}</span>
            )}
          </div>
          <h1>{post.title}</h1>
        </div>
      )}

      {/* Content */}
      <div className="info-body" style={{ maxWidth: '800px' }}>
        <article>
          {post.content && post.content.map((paragraph, i) => (
            <p key={i} style={{
              fontSize: '16px',
              color: '#333',
              lineHeight: 1.8,
              marginBottom: '20px',
            }}>
              {paragraph}
            </p>
          ))}
        </article>

        {/* Post navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '2px solid #e8f0eb',
        }}>
          {prevPost ? (
            <Link to={`/blog/${prevPost.slug || prevPost.id}`} style={{
              textDecoration: 'none',
              color: '#2d6a4f',
              fontSize: '14px',
              fontWeight: 600,
              maxWidth: '45%',
            }}>
              ← {prevPost.title}
            </Link>
          ) : <span />}
          {nextPost ? (
            <Link to={`/blog/${nextPost.slug || nextPost.id}`} style={{
              textDecoration: 'none',
              color: '#2d6a4f',
              fontSize: '14px',
              fontWeight: 600,
              textAlign: 'right',
              maxWidth: '45%',
            }}>
              {nextPost.title} →
            </Link>
          ) : <span />}
        </div>

        {/* CTA */}
        <div className="info-cta-block" style={{ marginTop: '48px' }}>
          <h2>Заинтересовала наша продукция?</h2>
          <p>Свяжитесь с нами для консультации или оформления заказа</p>
          <Link to="/contacts" className="info-cta-btn">Связаться с нами</Link>
        </div>
      </div>
    </div>
  )
}
