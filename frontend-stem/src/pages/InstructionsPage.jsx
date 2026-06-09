import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './InfoPage.css'

const INSTRUCTIONS = [
  {
    icon: '📋',
    title: 'Руководство по выбору мебели для учебных кабинетов',
    desc: 'Как правильно подобрать мебель с учётом возраста учеников, площади помещения и норм СанПиН',
    tag: 'Мебель',
    path: '/instructions',
  },
  {
    icon: '🖥️',
    title: 'Подключение и настройка интерактивных панелей',
    desc: 'Пошаговая инструкция по установке интерактивной панели, подключению компьютера и настройке ПО',
    tag: 'Электроника',
    path: '/instructions',
  },
  {
    icon: '🧪',
    title: 'Оснащение STEM-лаборатории с нуля',
    desc: 'Полный гайд по комплектации STEM-лаборатории: мебель, оборудование, программное обеспечение',
    tag: 'Оборудование',
    path: '/instructions',
  },
  {
    icon: '🔧',
    title: 'Сборка и монтаж учебной мебели',
    desc: 'Инструкции по самостоятельной сборке столов, стульев, стеллажей и другой мебели STEM Academia',
    tag: 'Мебель',
    path: '/instructions',
  },
  {
    icon: '💻',
    title: 'Работа с программой Roqed Science',
    desc: 'Руководство пользователя для учителей: как создавать уроки, назначать задания и отслеживать прогресс',
    tag: 'Цифровые продукты',
    path: '/instructions',
  },
  {
    icon: '📐',
    title: 'Планировка учебного кабинета',
    desc: 'Принципы эргономичного расположения мебели в учебном пространстве, требования к освещению',
    tag: 'Дизайн',
    path: '/instructions',
  },
  {
    icon: '🖨️',
    title: 'Запуск и обслуживание 3D-принтера',
    desc: 'Первый запуск, калибровка, замена нити, решение типичных проблем при печати',
    tag: 'Оборудование',
    path: '/instructions',
  },
  {
    icon: '📺',
    title: 'Использование информационного киоска',
    desc: 'Администрирование, загрузка контента, обновление ПО и техническое обслуживание инфокиосков',
    tag: 'Электроника',
    path: '/instructions',
  },
  {
    icon: '🏫',
    title: 'Нормы и стандарты для учебных помещений',
    desc: 'Требования СанПиН, ГОСТ и образовательных стандартов к учебным помещениям и оборудованию',
    tag: 'Нормативы',
    path: '/instructions',
  },
]

export default function InstructionsPage() {
  const { t } = useLang()

  return (
    <div className="info-page">
      <div className="info-breadcrumb">
        <Link to="/">{t.home}</Link> / {t.instructions_title}
      </div>

      <div className="info-hero">
        <h1>{t.instructions_title}</h1>
        <p>{t.instructions_intro}</p>
      </div>

      <div className="info-body">
        <section className="info-section">
          <h2>Все материалы</h2>
          <div className="instructions-grid">
            {INSTRUCTIONS.map((instr, i) => (
              <Link key={i} to={instr.path} className="instruction-card">
                <div className="instruction-card__icon">{instr.icon}</div>
                <div className="instruction-card__title">{instr.title}</div>
                <p className="instruction-card__desc">{instr.desc}</p>
                <span className="instruction-tag">{instr.tag}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="info-cta-block">
          <h2>Нужна консультация?</h2>
          <p>Наши специалисты помогут подобрать оптимальное решение для вашего учебного заведения</p>
          <Link to="/contacts" className="info-cta-btn">Задать вопрос</Link>
        </div>
      </div>
    </div>
  )
}
