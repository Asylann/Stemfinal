import { Link } from 'react-router-dom'
import './Category.css'
import './Stulya.css'

const subcategories = [
  { title: 'ШКОЛЬНЫЕ СТУЛЬЯ', img: '/img/pagesecond/stulya/shkolnye.png', path: '/secondpage/stulya/shkolnye' },
  { title: 'ТАБУРЕТЫ',        img: '/img/pagesecond/stulya/taburety.png', path: '/secondpage/stulya/taburety' },
  { title: 'МЯГКИЕ СТУЛЬЯ',  img: '/img/pagesecond/stulya/myagkie.png',  path: '/secondpage/stulya/myagkie' },
  { title: 'БАРНЫЕ СТУЛЬЯ',  img: '/img/pagesecond/stulya/barnye.png',   path: '/secondpage/stulya/barnye' },
]

export default function Stulya() {
  return (
    <div className="page">
      <div className="breadcrumb">МЕБЕЛЬ / СТУЛЬЯ</div>
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