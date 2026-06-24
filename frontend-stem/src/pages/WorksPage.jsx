import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './WorksPage.css'

const WORKS = [
  { id: 1, video: '/videos/work-01.mp4' },
  { id: 2, video: '/videos/work-02.mp4' },
  { id: 3, video: '/videos/work-03.mp4' },
  { id: 4, video: '/videos/work-04.mp4' },
  { id: 5, video: '/videos/work-05.mp4' },
  { id: 6, video: '/videos/work-06.mp4' },
  { id: 7, video: '/videos/work-07.mp4' },
  { id: 8, video: '/videos/work-08.mp4' },
  { id: 9, video: '/videos/work-09.mp4' },
  { id: 10, video: '/videos/work-10.mp4' },
  { id: 11, video: '/videos/work-11.mp4' },
  { id: 12, video: '/videos/work-12.mp4' },
  { id: 13, video: '/videos/work-13.mp4' },
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

  const heroVideo = WORKS[0]
  const gridVideos = WORKS.slice(1)

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

        <div className="works-featured">
          <div className="work-card work-card--featured">
            <LazyVideo src={heroVideo.video} className="work-video" />
          </div>
        </div>

        <div className="works-grid">
          {gridVideos.map((work) => (
            <div key={work.id} className="work-card">
              <LazyVideo src={work.video} className="work-video" />
            </div>
          ))}
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
