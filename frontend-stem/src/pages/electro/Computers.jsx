import { useLang } from '../../i18n/LanguageContext'
import { Link } from 'react-router-dom'
import './Computers.css'

const specs1 = [
  { icon: '🖥', label_ru: 'Серия процессора',          label_kz: 'Процессор сериясы',       value: 'Intel Core i3 10100' },
  { icon: '⊞', label_ru: 'Разрешение дисплея',         label_kz: 'Дисплей ажыратымдылығы',  value: 'FullHD' },
  { icon: '💾', label_ru: 'Объём оперативной памяти',   label_kz: 'Жедел жад көлемі',        value: '8Gb' },
  { icon: '📷', label_ru: 'Встроенная веб-камера',      label_kz: 'Кірістірілген веб-камера', value: '720p' },
  { icon: '💿', label_ru: 'Тип накопителя',             label_kz: 'Жинақтауыш түрі',         value: 'HDD+SSD' },
  { icon: '⊞', label_ru: 'Операционная система',        label_kz: 'Операциялық жүйе',        value: 'Windows 10 pro' },
  { icon: '📐', label_ru: 'Диагональ, дюйм',            label_kz: 'Диагональ, дюйм',         value: '23.8' },
  { icon: '🔧', label_ru: 'Тип оперативной памяти',     label_kz: 'Жедел жад түрі',          value: 'DDR4' },
]

const specs2 = [
  { icon: '🖥', label_ru: 'Серия процессора',          label_kz: 'Процессор сериясы',       value: 'Intel Core i3 10100' },
  { icon: '⊞', label_ru: 'Разрешение дисплея',         label_kz: 'Дисплей ажыратымдылығы',  value: 'FullHD' },
  { icon: '💾', label_ru: 'Объём оперативной памяти',   label_kz: 'Жедел жад көлемі',        value: '8Gb' },
  { icon: '📷', label_ru: 'Встроенная веб-камера',      label_kz: 'Кірістірілген веб-камера', value: '720p' },
  { icon: '💿', label_ru: 'Тип накопителя',             label_kz: 'Жинақтауыш түрі',         value: 'SSD' },
  { icon: '⊞', label_ru: 'Операционная система',        label_kz: 'Операциялық жүйе',        value: 'Windows 11 pro' },
  { icon: '📐', label_ru: 'Диагональ, дюйм',            label_kz: 'Диагональ, дюйм',         value: '14.0' },
  { icon: '🖥', label_ru: 'Тип матрицы экрана',         label_kz: 'Экран матрицасының түрі', value: 'IPS' },
]

export default function Computers() {
  const { t, lang } = useLang()

  const computers = [
    {
      id: 1,
      type: t.pc1_type,
      brand: 'AVTECH PRO',
      description: t.pc1_desc,
      included: t.pc1_included,
      img: '/img/pagethird/computers/item1.png',
      specs: specs1,
      article: 'S.Ee-PC.MB.AVT.Pro',
    },
    {
      id: 2,
      type: t.pc2_type,
      brand: 'AVTECH PRO',
      description: t.pc2_desc,
      ports: t.pc2_ports,
      img: '/img/pagethird/computers/item2.png',
      specs: specs2,
      article: 'S.Ee-PC.NB.AVT.Pro',
    },
  ]

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">{t.home}</Link>
        <span> / </span>
        <Link to="/electro" className="breadcrumb-link">{t.electro}</Link>
        <span> / </span>
        <span>{t.computers_title}</span>
      </div>

      <main className="computers-layout">
        {computers.map((c) => (
          <div key={c.id} className="computer-card">

            <div className="computer-card__top">
              <div className="computer-card__top-left">
                <h2 className="computer-card__type">{c.type}</h2>
                <p className="computer-card__brand">{c.brand}</p>
                <p className="computer-card__desc">{c.description}</p>
                {c.included && (
                  <p className="computer-card__included">
                    <strong>{t.computers_included}:</strong> {c.included}
                  </p>
                )}
                {c.ports && (
                  <p className="computer-card__included">
                    <strong>{t.computers_ports}:</strong> {c.ports}
                  </p>
                )}
              </div>
              <div className="computer-card__img-wrap">
                <img src={c.img} alt={c.type} className="computer-card__img" />
              </div>
            </div>

            <div className="computer-card__specs-section">
              <h3 className="computer-card__specs-title">{t.computers_specs}</h3>
              <div className="computer-card__specs">
                {c.specs.map((s, i) => (
                  <div key={i} className="comp-spec">
                    <div className="comp-spec__icon">{s.icon}</div>
                    <div className="comp-spec__label">{lang === 'kz' ? s.label_kz : s.label_ru}</div>
                    <div className="comp-spec__value">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="computer-card__article">{t.article_label}: {c.article}</p>
          </div>
        ))}
      </main>
    </div>
  )
}