import { Link } from 'react-router-dom'
import './Category.css'
import './Stulya.css'

const subcategories = [
  { title: 'ВСТРОЕННЫЕ ШКАФЫ',   img: '/img/pagesecond/shkafy/vstroenye.png',   path: '/secondpage/shkafy/vstroenye' },
  { title: 'СТАНДАРТНЫЕ ШКАФЫ',  img: '/img/pagesecond/shkafy/shkaf1_standart.png', path: '/secondpage/shkafy/shkaf1_standart' },
]

export default function Shkafy() {
  return (
    <div className="page">
      <div className="breadcrumb">МЕБЕЛЬ / ШКАФЫ</div>
      <main className="stulya-grid">
        {subcategories.map((cat, i) => (
          <Link key={i} to={cat.path} className="stulya-card">
            {cat.img ? (
              <img
                src={cat.img}
                alt={cat.title}
                className="stulya-card__img"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className="stulya-card__soon"
              style={{ display: cat.img ? 'none' : 'flex' }}
            >
              <span className="stulya-card__soon-badge">СКОРО</span>
              <span className="stulya-card__soon-text">СКОРО</span>
            </div>
            <span className="stulya-card__title">{cat.title}</span>
          </Link>
        ))}
      </main>
    </div>
  )
}