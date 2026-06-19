import { Link } from 'react-router-dom'
import './RoqedAiPage.css'

const FEATURES = [
  {
    title: 'Генерация домашних заданий',
    items: [
      'Тесты с одним правильным ответом (MCQ)',
      'Тесты с несколькими правильными ответами (MSQ)',
      'True / False',
      'Сопоставление',
      'Короткий ответ',
      'Числовой ответ',
      'Заполнение пропусков',
    ],
  },
  {
    title: 'Генерация презентаций для уроков',
    items: [
      '3D-моделей',
      'Интерактивных симуляций',
      'Образовательных игр',
      'Материалов, соответствующих учебной программе',
    ],
  },
  {
    title: 'Генерация образовательных игр',
    items: [
      'Соответствие',
      'Анаграммы',
      'Кроссворды',
      'Поиск слов',
      'Гонка на вычитание',
      'Лопни шарик',
      'Змейка со словами',
    ],
  },
  {
    title: 'Генерация плана урока',
    items: [
      'Целей урока',
      'Этапов проведения',
      'Действий учителя',
      'Действий учащихся',
      'Ресурсов урока',
      'Критериев оценивания',
    ],
  },
]

const HOW_IT_WORKS = [
  'Учитель выбирает предмет и тему урока.',
  'Указывает цели обучения.',
  'При необходимости выбирает учебник и образовательный стандарт.',
  'Система генерирует необходимый контент.',
  'Материалы можно редактировать, назначать ученикам и анализировать результаты.',
]

export default function RoqedAiPage() {
  return (
    <div className="roqed-page">
      <div className="roqed-breadcrumb">
        <Link to="/">Главная</Link> / <Link to="/digital">Цифровые продукты</Link> / ROQED AI
      </div>

      <div className="roqedai-hero">
        <div className="roqedai-hero__text">
          <div className="roqedai-badge">Виртуальный ассистент учителя</div>
          <h1>ROQED AI</h1>
          <p>
            ROQED AI — виртуальный ассистент учителя на базе искусственного интеллекта,
            предназначенный для автоматизации подготовки учебных материалов, создания
            интерактивного контента и повышения вовлечённости учащихся. Решение помогает
            сократить время на рутинные задачи до <strong>10 часов в неделю</strong> и
            позволяет сосредоточиться на образовательном процессе.
          </p>
        </div>
        <div className="roqedai-hero__logo">
          <img src="/img/pagedigital/roqed-ai-logo.png" alt="ROQED AI" />
        </div>
      </div>

      {/* FEATURES */}
      <section className="roqedai-section">
        <h2 className="roqedai-section__title">Основные возможности</h2>
        <div className="roqedai-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="roqedai-feature-card">
              <h3>{f.title}</h3>
              <ul>
                {f.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3D MODELS + BENEFITS */}
      <section className="roqedai-section">
        <div className="roqedai-models-benefits-layout">
          <div className="roqedai-models-column">
            <h2 className="roqedai-section__title">Интерактивные 3D-модели</h2>
            <div className="roqedai-models-block">
              <div className="roqedai-models-text">
                <p>
                  Встроенная библиотека содержит более <strong>1000 интерактивных моделей</strong> по предметам:
                  физика, химия, биология, география, математика и цифровая грамотность.
                </p>
                <ul className="roqedai-models-benefits">
                  <li>Тактильное изучение объектов</li>
                  <li>Сборка и разборка моделей</li>
                  <li>Наглядное объяснение сложных тем</li>
                  <li>Повышение вовлечённости учащихся</li>
                </ul>
              </div>
              <div className="roqedai-subjects">
                {['Физика', 'Химия', 'Биология', 'География', 'Математика', 'Цифровая грамотность'].map((s, i) => (
                  <span key={i} className="roqedai-subject-tag">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="roqedai-benefits-column">
            <h2 className="roqedai-section__title">Преимущества</h2>
            <div className="roqedai-benefits-stack">
              <div className="roqedai-benefit-row roqedai-benefit--orange">
                <div className="roqedai-benefit-icon">⏱</div>
                <div>
                  <h3>Экономия времени</h3>
                  <p>ROQED AI автоматически генерирует образовательный контент и сокращает объём рутинной работы преподавателя.</p>
                </div>
              </div>
              <div className="roqedai-benefit-row roqedai-benefit--purple">
                <div className="roqedai-benefit-icon">🎮</div>
                <div>
                  <h3>Повышение вовлечённости</h3>
                  <p>Использование интерактивных 3D-моделей и игровых механик делает обучение более интересным.</p>
                </div>
              </div>
              <div className="roqedai-benefit-row roqedai-benefit--blue">
                <div className="roqedai-benefit-icon">📊</div>
                <div>
                  <h3>Аналитика обучения</h3>
                  <p>Система помогает выявлять учащихся группы риска и своевременно корректировать процесс.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
