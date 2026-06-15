import { Link } from 'react-router-dom'
import './StemPlatformPage.css'

export default function SteamBookPage() {
  return (
    <div className="stemplatform-page">
      <div className="stemplatform-breadcrumb">
        <Link to="/">Главная</Link> / <Link to="/digital">Цифровые продукты</Link> / STEAM BOOK
      </div>

      <div className="stemplatform-layout">

        {/* ЛЕВАЯ КОЛОНКА — описание */}
        <div className="stemplatform-left">
          <div className="stemplatform-card">
            <h1>STEAM BOOK</h1>
            <p className="stemplatform-desc">
              STEAM BOOK — интерактивный образовательный формат с цифровыми ресурсами,
              практическими заданиями и учебными материалами для STEM-программ. Формат объединяет
              теоретический материал с интерактивными упражнениями, позволяя ученикам осваивать
              естественнонаучные дисциплины в увлекательной форме.
            </p>
            <p className="stemplatform-desc">
              STEAM BOOK включает готовые сценарии уроков, задания для проектной деятельности,
              тесты для контроля знаний и рекомендации для учителей. Материалы адаптированы под
              школьную программу Казахстана и доступны на русском и казахском языках.
            </p>
            <div className="stemplatform-article">Артикул: S.Dg-SteamBook.01</div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="stemplatform-right">
          <div style={{ background: '#f0f7f4', borderRadius: 16, padding: '48px 32px', textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a4731' }}>STEAM BOOK</div>
            <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>Интерактивный образовательный формат</div>
          </div>
        </div>

      </div>
    </div>
  )
}
