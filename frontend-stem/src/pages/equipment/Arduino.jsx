import { Link } from 'react-router-dom'
import Icon from '../../components/Icons'
import './EquipmentDetail.css'

export default function Arduino() {
  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Главная</Link>
        {' / '}
        <Link to="/equipment" style={{ color: '#888', textDecoration: 'none' }}>Оборудование</Link>
        {' / ARDUINO'}
      </div>

      <main className="detail-layout">

        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="detail-left">

          <div className="detail-info-block">
            <h2 className="detail-title">ARDUINO UNO</h2>
            <p className="detail-desc">
              Arduino Uno — микроконтроллерная плата, предназначенная для обучения основам
              электроники, программирования и робототехники в учебных кабинетах и STEM-лабораториях.
              Платформа позволяет ученикам создавать интерактивные проекты: от простых светодиодных
              схем до сложных робототехнических комплексов с датчиками и моторами.
            </p>
            <p className="detail-desc">
              Arduino Uno — идеальный инструмент для изучения основ физики, информатики и инженерии.
              Плата совместима с тысячами датчиков, модулей и библиотек, что делает её универсальной
              платформой для проектной деятельности в школе и колледже.
            </p>

            <p className="detail-order">
              <strong>pcb-arduino-01</strong><br />
              Микроконтроллерная плата Arduino Uno R3 для STEM-лабораторий
            </p>
          </div>

          <div className="detail-chars">
            <h3 className="detail-chars__title">Характеристики</h3>
            <div className="detail-chars__grid">
              <div className="char-card">
                <span className="char-card__icon"><Icon.Cpu width="18" height="18" /></span>
                <span className="char-card__label">Микроконтроллер</span>
                <span className="char-card__value">ATmega328P</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon"><Icon.Zap width="18" height="18" /></span>
                <span className="char-card__label">Напряжение питания</span>
                <span className="char-card__value">7–12 В</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon"><Icon.Zap width="18" height="18" /></span>
                <span className="char-card__label">Цифровые входы/выходы</span>
                <span className="char-card__value">14 шт.</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon"><Icon.Battery width="18" height="18" /></span>
                <span className="char-card__label">Аналоговые входы</span>
                <span className="char-card__value">6 шт.</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon"><Icon.Folder width="18" height="18" /></span>
                <span className="char-card__label">Flash-память</span>
                <span className="char-card__value">32 КБ</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon"><Icon.Clock width="18" height="18" /></span>
                <span className="char-card__label">Тактовая частота</span>
                <span className="char-card__value">16 МГц</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon"><Icon.Link2 width="18" height="18" /></span>
                <span className="char-card__label">Интерфейс</span>
                <span className="char-card__value">USB Type-B</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon"><Icon.Ruler width="18" height="18" /></span>
                <span className="char-card__label">Размеры</span>
                <span className="char-card__value">68,6 × 53,4 мм</span>
              </div>
            </div>
          </div>

          <p className="detail-article">Артикул: S.Eq-ARD.UnoR3</p>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="detail-right">
          <img src="/img/equipment/arduino.png" alt="ARDUINO" className="detail-img" />
        </div>

      </main>
    </div>
  )
}
