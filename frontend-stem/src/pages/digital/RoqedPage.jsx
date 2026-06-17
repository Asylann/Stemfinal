import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import './RoqedPage.css'

export default function RoqedPage() {
  const { t } = useLang()

  return (
    <div className="roqed-page">
      <div className="roqed-breadcrumb">
        <Link to="/">{t.home}</Link> / <Link to="/digital">{t.nav_digital}</Link> / {t.roqed_title}
      </div>

      <div className="roqed-layout">

        {/* ЛЕВАЯ КОЛОНКА — основной контент */}
        <div className="roqed-left">
          <div className="roqed-card">
            <div className="roqed-title-block">
              <h1>{t.roqed_title}</h1>
              <p className="roqed-desc">
                {t.roqed_desc}
              </p>
              <img 
                src="/img/Roqed AI/Map.jpeg" 
                alt="ROQED AI Map" 
                className="roqed-map-image"
              />
            </div>

            {/* Миссия */}
            <div className="roqed-section">
              <h2>{t.roqed_mission_title}</h2>
              <p className="roqed-text">
                {t.roqed_mission_text}
              </p>
            </div>

            {/* Возможности */}
            <div className="roqed-section">
              <h2>{t.roqed_features_title}</h2>
              <ul className="roqed-features-list">
                <li>{t.roqed_feature_homework}</li>
                <li>{t.roqed_feature_presentations}</li>
                <li>{t.roqed_feature_games}</li>
                <li>{t.roqed_feature_lesson_plans}</li>
                <li>{t.roqed_feature_analytics}</li>
                <li>{t.roqed_feature_3d_models}</li>
              </ul>
            </div>

            {/* Преимущества */}
            <div className="roqed-section">
              <h2>{t.roqed_advantages_title}</h2>
              <ul className="roqed-features-list">
                <li>{t.roqed_advantage_time}</li>
                <li>{t.roqed_advantage_engagement}</li>
                <li>{t.roqed_advantage_personalization}</li>
                <li>{t.roqed_advantage_content}</li>
                <li>{t.roqed_advantage_models}</li>
              </ul>
            </div>

            {/* Обучение и поддержка */}
            <div className="roqed-section">
              <h2>{t.roqed_training_title}</h2>
              <p className="roqed-text">
                {t.roqed_training_text}
              </p>
            </div>

            {/* Интерактивные игры */}
            <div className="roqed-section">
              <h2>{t.roqed_games_title}</h2>
              <p className="roqed-text">
                {t.roqed_games_text}
              </p>
              <img 
                src="/img/Roqed AI/Games.jpeg" 
                alt="ROQED AI Games" 
                className="roqed-games-image"
              />
            </div>

            {/* География внедрения */}
            <div className="roqed-section">
              <h2>{t.roqed_geography_title}</h2>
              <p className="roqed-text">
                {t.roqed_geography_text}
              </p>
            </div>

            {/* Кратко в цифрах */}
            <div className="roqed-section roqed-stats">
              <h2>{t.roqed_stats_title}</h2>
              <div className="roqed-stats-grid">
                <div className="roqed-stat-item">
                  <div className="roqed-stat-number">23+</div>
                  <div className="roqed-stat-label">{t.roqed_stat_countries}</div>
                </div>
                <div className="roqed-stat-item">
                  <div className="roqed-stat-number">10</div>
                  <div className="roqed-stat-label">{t.roqed_stat_hours}</div>
                </div>
                <div className="roqed-stat-item">
                  <div className="roqed-stat-number">1000+</div>
                  <div className="roqed-stat-label">{t.roqed_stat_models}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}