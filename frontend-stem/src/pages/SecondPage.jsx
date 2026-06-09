import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './SecondPage.css'

export default function SecondPage() {
  const { t } = useLang()

  const categories = [
    { title: t.furniture_divany,   img: '/img/pagesecond/a1a32584672.png',   path: '/secondpage/divany' },
    { title: t.furniture_kreslo,   img: '/img/pagesecond/738d1eff.png',      path: '/secondpage/kreslo' },
    { title: t.furniture_kuhnya,   img: '/img/pagesecond/4a950c62bed144.jpg', path: '/secondpage/kuhnya' },
    { title: t.furniture_pufy,     img: '/img/pagesecond/a41bcac159.png',    path: '/secondpage/pufy' },
    { title: t.furniture_stellazhi,img: '/img/pagesecond/e0f5951d3c3.png',   path: '/secondpage/stellazhi' },
    { title: t.furniture_stoly,    img: '/img/pagesecond/bb20aa.png',        path: '/secondpage/stoly' },
    { title: t.furniture_stulya,   img: '/img/pagesecond/983793aa0.png',     path: '/secondpage/stulya' },
    { title: t.furniture_tumby,    img: '/img/pagesecond/4d735992.png',      path: '/secondpage/tumby' },
    { title: t.furniture_shkafy,   img: '/img/pagesecond/ce38f5332a.png',    path: '/secondpage/shkafy' },
  ]

  return (
    <div className="second-page">
      <nav className="second-breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <span>{t.furniture}</span>
      </nav>

      <div className="second-content">
        <div className="second-content__header">
          <h1 className="second-content__title">{t.furniture}</h1>
          <span className="second-content__count">{t.found} {categories.length} {t.found_categories}</span>
        </div>

        <main className="second-grid">
          {categories.map((cat, i) => (
            <Link key={i} to={cat.path} className="second-card">
              <img src={cat.img} alt={cat.title} className="second-card__img" />
              <span className="second-card__title">{cat.title}</span>
            </Link>
          ))}
        </main>
      </div>
    </div>
  )
}