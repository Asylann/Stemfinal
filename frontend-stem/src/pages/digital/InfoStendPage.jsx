import { Link } from 'react-router-dom'
import './StemPlatformPage.css'

export default function InfoStendPage() {
  return (
    <div className="stemplatform-page">
      <div className="stemplatform-breadcrumb">
        <Link to="/">Главная</Link> / <Link to="/digital">Цифровые продукты</Link> / Инфо стенды
      </div>

      <div className="stemplatform-layout">

        {/* ЛЕВАЯ КОЛОНКА — описание */}
        <div className="stemplatform-left">
          <div className="stemplatform-card">
            <h1>ИНФО СТЕНДЫ</h1>
            <p className="stemplatform-desc">
              Инфо-стенды для образовательных пространств с современным дизайном и удобной
              подачей материалов для учеников и преподавателей. Стенды включают QR-коды для
              быстрого доступа к цифровым ресурсам, наглядные инфографики и учебные плакаты,
              адаптированные под школьную программу.
            </p>
            <p className="stemplatform-desc">
              Размещение информационных стендов в учебных кабинетах, коридорах и рекреациях
              позволяет создать образовательную среду, стимулирующую интерес к знаниям.
              Контент обновляется и дополняется в зависимости от учебного плана и возрастной
              группы учащихся.
            </p>
            <div className="stemplatform-article">Артикул: S.Dg-InfoStend.01</div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА — картинка */}
        <div className="stemplatform-right">
          <img
            src="/img/pagedigital/infostend.png"
            alt="Инфо стенды"
            className="stemplatform-img"
          />
        </div>

      </div>
    </div>
  )
}
