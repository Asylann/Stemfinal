import { Link } from 'react-router-dom'
import './Kuhnya.css'

const features = [
  { icon: '🪵', label: 'Материалы отделки', sub: 'ЛДСП / МДФ / Дерево / Стекло / Металл' },
  { icon: '💡', label: 'Освещение' },
  { icon: '🔧', label: 'Вытяжки' },
  { icon: '💧', label: 'Фильтры для воды' },
  { icon: '📦', label: 'Микроволновые печи' },
  { icon: '❄️', label: 'Холодильники' },
  { icon: '🔥', label: 'Печи' },
  { icon: '☕', label: 'Электрочайники' },
]

export default function Kuhnya() {
  return (
    <div className="kuhnya-page">
      <div className="kuhnya-breadcrumb">
        <Link to="/">Главная</Link> / <Link to="/secondpage">Мебель</Link> / Кухня
      </div>

      <h1 className="kuhnya-heading">Мебель | Кухня</h1>

      <div className="kuhnya-layout">

        <div className="kuhnya-left">
          <div className="kuhnya-card">
            <h2>МЕБЕЛЬ ДЛЯ КУХНИ ПОД ВАШ ЗАКАЗ</h2>
            <p className="kuhnya-intro">
              Наша компания предлагает кухонные гарнитуры, разработанные специально для школ и других
              учебных заведений. Мы учитываем все особенности и требования к школьной мебели, обеспечивая
              максимум комфорта, безопасности и функциональности.
            </p>

            <h3>ПРЕИМУЩЕСТВА НАШИХ КУХОННЫХ ГАРНИТУРОВ:</h3>

            <ol className="kuhnya-advantages">
              <li>
                Разнообразие дизайна: мы предлагаем различные варианты стилей и цветовых решений, чтобы вы
                могли найти подходящий вариант в соответствии со своими пожеланиями заказчика.
              </li>
              <li>
                Индивидуальный подход: мы учитываем все пожелания и потребности заказчика, создавая
                уникальный кухонный гарнитур, который идеально вписается в интерьер учебного заведения.
              </li>
              <li>
                Профессиональный монтаж: наши специалисты осуществляют качественный и быстрый монтаж мебели,
                обеспечивая надёжность и долговечность конструкции. Также дополнительные материалы кухонного
                гарнитура могут варьироваться в зависимости от предпочтения заказчика.
              </li>
            </ol>

            <h3 className="kuhnya-what-title">ЧТО МЫ ПРЕДЛАГАЕМ</h3>
            <div className="kuhnya-features">
              {features.map((f, i) => (
                <div className="kuhnya-feature" key={i}>
                  <span className="kuhnya-feature__icon">{f.icon}</span>
                  <span className="kuhnya-feature__label">{f.label}</span>
                  {f.sub && <span className="kuhnya-feature__sub">{f.sub}</span>}
                </div>
              ))}
            </div>

            <div className="kuhnya-article">Артикул: L.Me-KUHN.2500</div>
          </div>
        </div>

        <div className="kuhnya-right">
          <img
            src="/img/pagesecond/kuhnya/item1.jpg"
            alt="Кухонный гарнитур"
            className="kuhnya-img"
            loading="lazy"
          />
        </div>

      </div>
    </div>
  )
}