import './EquipmentDetail.css'

export default function Labdisc() {
  return (
    <div className="page">
      <div className="breadcrumb">ОБОРУДОВАНИЕ | LABDISC</div>

      <main className="detail-layout">

        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="detail-left">

          <div className="detail-info-block">
            <h2 className="detail-title">ЦИФРОВАЯ ЛАБОРАТОРИЯ LABDISC</h2>
            <p className="detail-desc">
              Регистратор данных ЛабДиск специально разработан для изучения Физики в начальной
              и средней школе. Благодаря своей универсальности и портативности, а также наличию
              встроенных датчиков, использовать устройства довольно просто и удобно.
            </p>
            <p className="detail-desc">
              Для проведения регистрации данных в полевых условиях ЛабДиск имеет аккумулятор на
              150 часов работы, графический дисплей, кнопочную клавиатуру. В классе ЛабДиск может
              взаимодействовать с компьютером через USB-кабель или беспроводное соединение Bluetooth.
              Регистратор может использоваться в широком диапазоне научных экспериментов, обеспечивая
              12-битное разрешение измерений.
            </p>
          </div>

          <div className="detail-chars">
            <h3 className="detail-chars__title">Характеристики</h3>
            <div className="detail-chars__grid">
              <div className="char-card">
                <span className="char-card__icon">🔋</span>
                <span className="char-card__label">Внутренний аккумулятор</span>
                <span className="char-card__value">LiPO 3.6B</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🖥️</span>
                <span className="char-card__label">Экран Графический жк 64 x 128 пикселей</span>
                <span className="char-card__value">Экран</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">💧</span>
                <span className="char-card__label">Датчик pH</span>
                <span className="char-card__value">От 0 до 14 pH</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🔌</span>
                <span className="char-card__label">Интерфейс</span>
                <span className="char-card__value">USB V2.0</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🌡️</span>
                <span className="char-card__label">Работает при температуре</span>
                <span className="char-card__value">От -10 до 50 °C</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">⚡</span>
                <span className="char-card__label">Максимальная скорость измерения</span>
                <span className="char-card__value">1000/сек</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🔋</span>
                <span className="char-card__label">Максимальный срок службы аккумулятора</span>
                <span className="char-card__value">150 часов</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">📶</span>
                <span className="char-card__label">Беспроводное соединение</span>
                <span className="char-card__value">Bluetooth V2.0</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">☁️</span>
                <span className="char-card__label">Датчик кислорода</span>
                <span className="char-card__value">От 0 до 14 Мг/л (от 0 до 25 %)</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">💡</span>
                <span className="char-card__label">Диапазон светового датчика, люкс</span>
                <span className="char-card__value">От 0 до 55 000</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🖥️</span>
                <span className="char-card__label">Поддерживаемые платформы</span>
                <span className="char-card__value">PC, MAC, Chromebook, iPad Linux, Android</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">💾</span>
                <span className="char-card__label">Внутренняя память сохранения данных</span>
                <span className="char-card__value">128,000 измерений</span>
              </div>
            </div>
          </div>

          <p className="detail-article">Артикул: S.Ee-INK.DDS.K</p>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="detail-right">
          <img src="/img/equipment/labdisc.png" alt="LABDISC" className="detail-img" />
        </div>

      </main>
    </div>
  )
}
