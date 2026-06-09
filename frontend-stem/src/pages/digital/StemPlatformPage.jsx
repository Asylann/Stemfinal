import { Link } from 'react-router-dom'
import './StemPlatformPage.css'

export default function StemPlatformPage() {
  return (
    <div className="stemplatform-page">
      <div className="stemplatform-breadcrumb">
        <Link to="/">Главная</Link> / <Link to="/digital">Цифровые продукты</Link> / STEM Platform
      </div>

      <div className="stemplatform-layout">

        {/* ЛЕВАЯ КОЛОНКА — только текст */}
        <div className="stemplatform-left">
          <div className="stemplatform-card">
            <h1>STEM PLATFORM</h1>
            <p className="stemplatform-desc">
              STEM PLATFORM — платформа для учебных проектов и цифрового управления классом. Она объединяет инструменты для интерактивного обучения, контроля прогресса и организации STEM-мероприятий.
            </p>
            <div className="stemplatform-article">Артикул: S.Ee-PC.MB.AVT.Pro</div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА — только картинка */}
        <div className="stemplatform-right">
          <img
            src="/img/pagethird/computers/item2.png"
            alt="STEM Platform"
            className="stemplatform-img"
          />
        </div>

      </div>
    </div>
  )
}