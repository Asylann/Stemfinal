import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './CategoryGrid.css'

export default function CategoryGrid() {
  const { t } = useLang()

  const categories = [
    { title: t.nav_design,    path: '/',           img: '/img/pagefirst/room.png' },
    { title: t.nav_furniture, path: '/secondpage', img: '/img/pagefirst/F5.png' },
    { title: t.nav_electro,   path: '/electro',    img: '/img/pagethird/comp.png' },
    { title: t.nav_decor,     path: '/decor',      img: '/img/pagefirst/plant.png' },
    { title: t.nav_equipment, path: '/equipment',  img: '/img/equipment/arduino.png' },
    { title: t.nav_digital,   path: '/digital',    img: '/img/pagefirst/Слой1.png' },
  ]

  return (
    <section className="cat-grid-section">
      <h2 className="cat-grid-title">{t.catalog}</h2>
      <div className="cat-grid">
        {categories.map((cat) => (
          <Link to={cat.path} key={cat.path} className="cat-grid-card">
            <div className="cat-grid-img">
              <img src={cat.img} alt={cat.title} />
            </div>
            <span className="cat-grid-label">{cat.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}