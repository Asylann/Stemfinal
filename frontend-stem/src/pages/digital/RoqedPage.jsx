import { Link } from 'react-router-dom'
import './RoqedPage.css'

export default function RoqedPage() {
  return (
    <div className="roqed-page">
      <div className="roqed-breadcrumb">
        <Link to="/">Главная</Link> / <Link to="/digital">Цифровые продукты</Link> / ROQED Science
      </div>

      <div className="roqed-layout">

        {/* ЛЕВАЯ КОЛОНКА — описание и лицензии */}
        <div className="roqed-left">
          <div className="roqed-card">
            <div className="roqed-title-block">
              <h1>ROQED SINCE</h1>
              <p className="roqed-desc">
                ROQED — глобальная EdTech-компания, которая создает захватывающую среду для увлекательного
                преподавания физики, химии, биологии и наук о Земле на более чем 18 языках. Интерактивное,
                простое в использовании образовательное программное обеспечение для изучения сотен подробных
                3D-моделей и анимаций по естественным наукам.
              </p>
            </div>

            <div className="roqed-licenses">
              <h2>ТИПЫ ЛИЦЕНЗИЙ</h2>
              <div className="roqed-licenses-grid">

                {/* Студентам */}
                <div className="roqed-license-col">
                  <h3>Студентам</h3>
                  <ul>
                    <li className="no">Автономный доступ</li>
                    <li className="yes">Максимальное разрешение экрана 1280 * 720</li>
                    <li className="yes">Доступно только на Android</li>
                    <li className="yes">Доступ ко всем курсам и моделям</li>
                    <li className="yes">Стандартная подписка сроком на 1 год</li>
                    <li className="no">в режиме "Слайды" для планирования уроков</li>
                    <li className="no">Совместима с flat panel</li>
                  </ul>
                </div>

                {/* Учителям */}
                <div className="roqed-license-col">
                  <h3>Учителям</h3>
                  <ul>
                    <li className="yes">Автономный доступ</li>
                    <li className="yes">Максимальное разрешение экрана не ограничено</li>
                    <li className="yes">Доступно на Windows и Android</li>
                    <li className="yes">Доступ ко всем курсам и моделям</li>
                    <li className="yes">Стандартная подписка сроком на 1 год</li>
                    <li className="yes">в режиме "Слайды" для планирования уроков</li>
                    <li className="yes">Совместима с flat panel</li>
                  </ul>
                </div>

              </div>
            </div>

            <div className="roqed-article">Артикул: S.Ee-PC.MB.AVT.Pro</div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА — технические требования */}
        <div className="roqed-right">
          <h2 className="roqed-tech-title">ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</h2>
          <div className="roqed-tech-grid">

            <div className="roqed-tech-card roqed-tech-windows">
              <div className="roqed-tech-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
              </div>
              <h3>For Windows</h3>
              <p className="roqed-tech-label">Minimum</p>
              <ul>
                <li>Intel Core i3 6700</li>
                <li>Intel HD Graphics 530</li>
                <li>4 Gb RAM</li>
                <li>Windows 10 64-bit</li>
                <li>128 Gb HDD</li>
              </ul>
            </div>

            <div className="roqed-tech-card roqed-tech-android">
              <div className="roqed-tech-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                  <path d="M17.523 15.341a.88.88 0 0 1-.88.88.88.88 0 0 1-.88-.88.88.88 0 0 1 .88-.88.88.88 0 0 1 .88.88m-9.285 0a.88.88 0 0 1-.88.88.88.88 0 0 1-.88-.88.88.88 0 0 1 .88-.88.88.88 0 0 1 .88.88M17.79 9.144l1.664-2.882a.346.346 0 0 0-.127-.473.347.347 0 0 0-.473.128L17.18 8.85a10.617 10.617 0 0 0-4.68-1.08c-1.68 0-3.27.39-4.68 1.08L6.157 5.917a.347.347 0 0 0-.473-.128.347.347 0 0 0-.127.473l1.663 2.882C4.56 10.495 2.82 13.074 2.82 16.05h18.36c0-2.976-1.74-5.555-3.39-6.906"/>
                </svg>
              </div>
              <h3>For Android</h3>
              <p className="roqed-tech-label">Minimum</p>
              <ul>
                <li>Snapdragon 636</li>
                <li>Adreno 630</li>
                <li>3 Gb RAM</li>
                <li>Android 8</li>
                <li>3 Gb HDD</li>
                <li>64 bit capacity</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}