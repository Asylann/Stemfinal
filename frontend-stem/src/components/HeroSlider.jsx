import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './HeroSlider.css'

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const { t } = useLang()

  const slides = [
    { id: 1, title: t.slider_1_title, subtitle: t.slider_1_subtitle, btnText: t.slider_1_btn, btnLink: '/secondpage', bg: '#1a4731', accent: '#52b788', img: '/img/pagefirst/room.png' },
    { id: 2, title: t.slider_2_title, subtitle: t.slider_2_subtitle, btnText: t.slider_2_btn, btnLink: '/equipment', bg: '#1d3557', accent: '#457b9d', img: '/img/equipment/arduino.png' },
    { id: 3, title: t.slider_3_title, subtitle: t.slider_3_subtitle, btnText: t.slider_3_btn, btnLink: '/', bg: '#3d405b', accent: '#81b29a', img: '/img/pagefirst/plant.png' },
    { id: 4, title: t.slider_4_title, subtitle: t.slider_4_subtitle, btnText: t.slider_4_btn, btnLink: '/electro', bg: '#2d4739', accent: '#74c69d', img: '/img/pagethird/computers/item2.png' },
  ]

  const total = slides.length

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total)
    }, 5000)
    return () => clearInterval(timer)
  }, [total])

  const prev = () => setCurrent((current - 1 + total) % total)
  const next = () => setCurrent((current + 1) % total)
  const slide = slides[current]

  return (
    <div className="hero-slider" style={{ background: slide.bg }}>
      <div className="hero-img">
        <img src={slide.img} alt={slide.title} />
      </div>
      <div className="hero-content">
        <h1 className="hero-title" style={{ color: slide.accent }}>{slide.title}</h1>
        <p className="hero-subtitle">{slide.subtitle}</p>
        <Link to={slide.btnLink} className="hero-btn">{slide.btnText}</Link>
      </div>
      <button className="hero-arrow hero-arrow-left" onClick={prev}>‹</button>
      <button className="hero-arrow hero-arrow-right" onClick={next}>›</button>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  )
}