import { Link } from 'react-router-dom'
import './EquipmentDetail.css'

export default function LegoSpike() {
  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Главная</Link>
        {' / '}
        <Link to="/equipment" style={{ color: '#888', textDecoration: 'none' }}>Оборудование</Link>
        {' / LEGO SPIKE'}
      </div>

      <main className="detail-layout">

        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="detail-left">

          <div className="detail-info-block">
            <h2 className="detail-title">LEGO EDUCATION SPIKE PRIME</h2>
            <p className="detail-desc">
              LEGO Education SPIKE Prime — образовательный робототехнический набор, разработанный
              для учащихся средних классов. Набор объединяет конструктор LEGO, программируемый хаб,
              моторы и датчики, позволяя ученикам изучать основы программирования, инженерии и
              естественных наук через практические проекты.
            </p>
            <p className="detail-desc">
              SPIKE Prime включает приложение с пошаговыми инструкциями, готовые учебные планы
              для учителей и совместим с языками программирования Scratch и Python. Набор идеально
              подходит для проведения уроков информатики, физики и технологии, а также для
              подготовки к робототехническим соревнованиям FIRST LEGO League.
            </p>

            <p className="detail-order">
              <strong>pcb-lego-spike-01</strong><br />
              Набор LEGO Education SPIKE Prime Expansion Set для STEM-лабораторий
            </p>
          </div>

          <div className="detail-chars">
            <h3 className="detail-chars__title">Характеристики</h3>
            <div className="detail-chars__grid">
              <div className="char-card">
                <span className="char-card__icon">🧱</span>
                <span className="char-card__label">Количество деталей</span>
                <span className="char-card__value">528 элементов</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🖥️</span>
                <span className="char-card__label">Программируемый хаб</span>
                <span className="char-card__value">6 портов ввода/вывода</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">⚡</span>
                <span className="char-card__label">Моторы</span>
                <span className="char-card__value">4 шт. (2 больших, 2 средних)</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">📡</span>
                <span className="char-card__label">Датчики</span>
                <span className="char-card__value">Цвет, расстояние, усилие</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🔋</span>
                <span className="char-card__label">Аккумулятор</span>
                <span className="char-card__value">Li-Ion, перезаряжаемый</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🔗</span>
                <span className="char-card__label">Подключение</span>
                <span className="char-card__value">Bluetooth + USB</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">💻</span>
                <span className="char-card__label">Совместимость</span>
                <span className="char-card__value">Scratch, Python</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">📱</span>
                <span className="char-card__label">Платформы</span>
                <span className="char-card__value">Win, Mac, iOS, Android</span>
              </div>
            </div>
          </div>

          <p className="detail-article">Артикул: S.Eq-LEGO.SpikePrime</p>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="detail-right">
          <img src="/img/equipment/legospike.png" alt="LEGO SPIKE" className="detail-img" />
        </div>

      </main>
    </div>
  )
}
