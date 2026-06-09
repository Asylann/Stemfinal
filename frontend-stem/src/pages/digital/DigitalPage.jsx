import { Link } from 'react-router-dom'
import './DigitalPage.css'

const row1 = [
  { title: 'ROQED SCIENCE',  img: '/img/pagedigital/roqed.jpg',         path: '/digital/roqed' },
  { title: 'STEM PLATFORM',  img: '/img/pagedigital/stem-platform.jpg', path: '/digital/stemplatform' },
]

const row2 = [
  {
    title: 'ИНФО СТЕНДЫ',
    img: '/img/pagedigital/infostend.png',
    path: '/digital/infostend',
    description: 'Инфо-стенды для образовательных пространств с современным дизайном и удобной подачей материалов для учеников и преподавателей.',
  },
  {
    title: 'STEAM BOOK',
    img: '/img/pagedigital/steambook.png',
    path: '/digital/steambook',
    description: 'STEAM BOOK — интерактивный образовательный формат с цифровыми ресурсами, практическими заданиями и учебными материалами для STEM-программ.',
  },
]

const allItems = [...row1, ...row2]

export default function DigitalPage() {
  return (
    <div className="digital-page">

      <div className="digital-breadcrumb">
        <Link to="/" className="breadcrumb-link">Главная</Link>
        <span> / </span>
        <span>Цифровые продукты</span>
      </div>

      <div className="digital-header">
        <h1 className="digital-header__title">Цифровые продукты</h1>
        <span className="digital-header__count">Найдено {allItems.length} категории</span>
      </div>

      <main className="digital-main">

        <div className="digital-row digital-row--2">
          {row1.map((item, i) => (
            <Link key={i} to={item.path} className="digital-card digital-card--img">
              <span className="digital-card__title">{item.title}</span>
              <div className="digital-card__img-wrap">
                <img src={item.img} alt={item.title} className="digital-card__img" />
              </div>
            </Link>
          ))}
        </div>

        <div className="digital-row digital-row--2">
          {row2.map((item, i) => (
            <Link key={i} to={item.path} className="digital-card digital-card--text">
              <div className="digital-card__content">
                <span className="digital-card__title">{item.title}</span>
                <p className="digital-card__desc">{item.description}</p>
              </div>
              <div className="digital-card__img-wrap">
                <img src={item.img} alt={item.title} className="digital-card__img" />
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  )
}