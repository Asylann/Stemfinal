import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
  {
    label: 'дизайн интерьера',
    links: [
      { text: 'пакеты дизайна',       path: '/' },
      { text: 'индивидуальный проект', path: '/' },
    ]
  },
  {
    label: 'мебель',
    links: [
      { text: 'диваны',   path: '/secondpage/divany' },
      { text: 'кресло',   path: '/secondpage/kreslo' },
      { text: 'кухня',    path: '/secondpage' },
      { text: 'пуфы',     path: '/secondpage/pufy' },
      { text: 'стеллажи', path: '/secondpage/stellazhi' },
      { text: 'столы',    path: '/secondpage' },
      { text: 'стулья',   path: '/secondpage/stulya' },
      { text: 'тумбы',    path: '/secondpage/tumby' },
      { text: 'шкафы',    path: '/secondpage/shkafy' },
    ]
  },
  {
    label: 'электротехника',
    links: [
      { text: 'интерактивные панели', path: '/electro/interactive' },
      { text: 'компьютеры',          path: '/electro/computers' },
      { text: 'инфо-киоск',          path: '/electro/infokiosk' },
      { text: 'станки',              path: '/electro/stanki' },
      { text: 'бытовая техника',     path: '/electro/bytovaya' },
      { text: '3D принтеры',         path: '/electro/printers3d' },
    ]
  },
  {
    label: 'декор',
    links: [
      { text: 'гос. символика', path: '/decor/gos' },
      { text: '3D панели',      path: '/decor/3dpanels' },
      { text: 'освещение',      path: '/decor/lighting' },
      { text: 'перегородки',    path: '/decor/peregorodki' },
      { text: 'шторы',          path: '/decor/shtory' },
      { text: 'растения',       path: '/decor/rasteniya' },
      { text: 'доски',          path: '/decor/doski' },
    ]
  },
  {
    label: 'цифровые продукты',
    links: [
      { text: 'Roqed Science', path: '#' },
      { text: 'STEM Platform', path: '#' },
      { text: 'пособия',       path: '#' },
      { text: 'инфо. стенды',  path: '#' },
    ]
  },
  {
    label: 'оборудование',
    links: [
      { text: 'ULabs',      path: '/equipment/ulab' },
      { text: 'LabDisc',    path: '/equipment/labdisc' },
      { text: 'Lego Spike', path: '#' },
      { text: 'Arduino',    path: '#' },
    ]
  },
  {
    label: 'канаты',
    links: []
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(null)
  const location = useLocation()

  const toggle = (i) => {
    if (menuItems[i].links.length === 0) return
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

      <nav className={`menu-sidebar ${isOpen ? 'active' : ''}`}>
        <button className="menu-close" onClick={onClose}>✕</button>
        <h2 className="menu-title">МЕНЮ</h2>

        <div className="accordion">
          {menuItems.map((item, i) => (
            <div key={i} className={`accordion-item ${openIndex === i ? 'open' : ''}`}>
              <div
                className="accordion-header"
                onClick={() => toggle(i)}
              >
                <span>{item.label}</span>
                {item.links.length > 0 && (
                  <span className="accordion-arrow">V</span>
                )}
              </div>

              {item.links.length > 0 && (
                <div className="accordion-body">
                  <ul>
                    {item.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          to={link.path}
                          className={`accordion-link ${location.pathname === link.path ? 'accordion-link--active' : ''}`}
                          onClick={onClose}
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}