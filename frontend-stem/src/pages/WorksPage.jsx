import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './WorksPage.css'

const WORKS = [
  { id: 1, video: '/videos/main_video.MP4' },
  { id: 2, video: '/videos/second%20main.MP4' },
  { id: 3, video: '/videos/second.MP4' },
  { id: 4, video: '/videos/third.MP4' },
]

function LazyVideo({ src, className }) {
  const videoRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        } else if (shouldLoad) {
          el.pause()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  useEffect(() => {
    const v = videoRef.current
    if (shouldLoad && v) {
      v.src = src
      v.load()
      v.play().catch(() => {})
    }
  }, [shouldLoad, src])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload={shouldLoad ? 'auto' : 'none'}
    />
  )
}

export default function WorksPage() {
  const { t } = useLang()

  return (
    <div className="works-page">
      <div className="works-hero">
        <div className="works-hero__particles" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="particle" />
          ))}
        </div>
        <div className="works-hero__content">
          <h1>{t.works_title}</h1>
          <p>{t.works_subtitle}</p>
        </div>
      </div>

      <div className="works-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.works_title}
      </div>

      <div className="works-body">
        <div className="works-intro">
          <h2>{t.works_section_title}</h2>
          <p>{t.works_section_desc}</p>
        </div>

        <div className="works-grid">
          <div className="work-card work-card--large">
            <LazyVideo src={WORKS[0].video} className="work-video" />
          </div>

          <div className="work-row">
            <div className="work-card work-card--medium">
              <LazyVideo src={WORKS[1].video} className="work-video" />
            </div>
            <div className="work-card work-card--medium">
              <LazyVideo src={WORKS[2].video} className="work-video" />
            </div>
          </div>

          <div className="work-card work-card--large">
            <LazyVideo src={WORKS[3].video} className="work-video" />
          </div>
        </div>

        <div className="works-cta">
          <h2>{t.works_cta_title}</h2>
          <p>{t.works_cta_desc}</p>
          <Link to="/contacts" className="works-cta-btn">
            {t.works_cta_btn}
          </Link>
        </div>
      </div>
    </div>
  )
}
