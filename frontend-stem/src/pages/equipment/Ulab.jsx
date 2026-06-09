import './EquipmentDetail.css'

export default function Ulab() {
  return (
    <div className="page">
      <div className="breadcrumb">ОБОРУДОВАНИЕ | ULABS</div>

      <main className="detail-layout">

        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="detail-left">

          <div className="detail-info-block">
            <h2 className="detail-title">НАБОР ULABS</h2>
            <p className="detail-desc">
              Набор ULABS «Лабораторный комплект» предназначен для обучения по программе К-12.
              Используется учителем во время демонстрационных, лабораторных и практических работ
              по биологии. Позволяет ознакомить учеников с морфологическим и анатомическим
              строением растений, животных, особенностями биохимических и физиологических
              процессов живых организмов. Элементы набора используются в работах с
              цифровыми измерительными комплексами.
            </p>

            <p className="detail-order">
              <strong>pcb-ulabs-01 Приказ №70, номер - 1628</strong><br />
              Набор посуды и принадлежностей для демонстрационных опытов и лабораторных работ
            </p>
          </div>

          <div className="detail-chars">
            <h3 className="detail-chars__title">Характеристики</h3>
            <div className="detail-chars__grid">
              <div className="char-card">
                <span className="char-card__icon">🖥️</span>
                <span className="char-card__label">Серия процессора</span>
                <span className="char-card__value">Intel Core i3 GEN6</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🖼️</span>
                <span className="char-card__label">Разрешение дисплея</span>
                <span className="char-card__value">FullHD</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">💾</span>
                <span className="char-card__label">Объём оперативной памяти</span>
                <span className="char-card__value">8Gb</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">⚡</span>
                <span className="char-card__label">Тип оперативной памяти</span>
                <span className="char-card__value">DDR3</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">💿</span>
                <span className="char-card__label">Тип накопителя</span>
                <span className="char-card__value">SSD 128Gb</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">🪟</span>
                <span className="char-card__label">Операционная система</span>
                <span className="char-card__value">Windows 10</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">📐</span>
                <span className="char-card__label">Диагональ</span>
                <span className="char-card__value">49"</span>
              </div>
              <div className="char-card">
                <span className="char-card__icon">👆</span>
                <span className="char-card__label">Количество касаний</span>
                <span className="char-card__value">10 касаний</span>
              </div>
            </div>
          </div>

          <p className="detail-article">Артикул: S.Ee-INK.DD5.K</p>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="detail-right">
          <img src="/img/equipment/ulab.png" alt="ULABS" className="detail-img" />
        </div>

      </main>
    </div>
  )
}
