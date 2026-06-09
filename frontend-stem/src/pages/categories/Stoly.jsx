import { Link } from 'react-router-dom'
import './Stoly.css'

const categories = [
  {
    title: 'ПАРТЫ',
    img: '/img/pagesecond/stoly/spezstoly.jpg',
    path: '/secondpage/stoly/party'
  },
  {
    title: 'РАБОЧИЕ СТОЛЫ',
    img: null,
    path: '/secondpage/stoly/rabochie'
  },
  {
    title: 'РЕСЕПШЕН',
    img: '/img/pagesecond/stoly/reception.png',
    path: '/secondpage/stoly/reception'
  },
  {
    title: 'КОНФЕРЕНЦ СТОЛ',
    img: '/img/pagesecond/stoly/confstol.png',
    path: '/secondpage/stoly/konferents'
  },
  {
    title: 'СПЕЦ СТОЛЫ',
    img: null,
    path: '/secondpage/stoly/spets'
  },
  {
    title: 'СПЕЦ СТОЛЫ для преподавателя',
    img: '/img/pagesecond/stoly/party.png',
    path: '/secondpage/stoly/spets-teacher'
  }
]

export default function Stoly() {
  return (
    <div className="stoly-page">
      <div className="stoly-breadcrumb">
        <Link to="/">Главная</Link> / <Link to="/secondpage">Мебель</Link> / Столы
      </div>

      <h1 className="stoly-heading">
        Мебель | Столы <span className="stoly-count">Найдено {categories.length} категорий</span>
      </h1>

      <div className="stoly-grid">
        {categories.map((cat) => (
          <Link to={cat.path} key={cat.title} className="stoly-card">
            <span className="stoly-card__title">{cat.title}</span>
            <div className="stoly-card__img-wrap">
              {cat.img ? (
                <img src={cat.img} alt={cat.title} />
              ) : (
                <div className="stoly-card__soon">
                  <span className="stoly-card__soon-badge">СКОРО</span>
                  <span className="stoly-card__soon-text">СКОРО</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}