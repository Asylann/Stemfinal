import { useMemo, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { LocationContext } from './locationContext'

const STORAGE_KEY = 'stem_city'
const DEFAULT_CITY = 'astana'

const CITY_DATA = {
  astana: {
    mapQuery: 'Domalak-ana 26, Astana, Kazakhstan',
    ru: {
      name: 'Астана',
      address: 'г. Астана, ул. Домалак-ана 26',
      pickup: 'Самовывоз: г. Астана, ул. Домалак-ана 26',
      pickupShort: 'Самовывоз: Астана, Домалак-ана 26',
      dispatchText: 'Отправляем товар со склада в Астане. Доставка по Казахстану.',
      deliveryText: 'Доставка по всему Казахстану. Самовывоз из Астаны: ул. Домалак-ана 26. Срок доставки согласуется индивидуально.',
      workTimeText: 'Пн-Пт: 9:00 - 18:00 по времени Астаны',
    },
    kz: {
      name: 'Астана',
      address: 'Астана қ., Домалақ-ана к-сі 26',
      pickup: 'Өзі алу: Астана қ., Домалақ-ана к-сі 26',
      pickupShort: 'Өзі алу: Астана, Домалақ-ана к-сі 26',
      dispatchText: 'Тауарды Астанадағы қоймадан жолдаймыз. Қазақстан бойынша жеткізу.',
      deliveryText: 'Қазақстан бойынша жеткізу. Астанадан өзі алу: Домалақ-ана к-сі 26. Жеткізу мерзімі жеке келісіледі.',
      workTimeText: 'Дс-Жм: 9:00 - 18:00 Астана уақыты бойынша',
    },
  },
  almaty: {
    mapQuery: 'Al-Farabi 77/2, Almaty, Kazakhstan',
    ru: {
      name: 'Алматы',
      address: 'г. Алматы, пр. Аль-Фараби 77/2',
      pickup: 'Самовывоз: г. Алматы, пр. Аль-Фараби 77/2',
      pickupShort: 'Самовывоз: Алматы, пр. Аль-Фараби 77/2',
      dispatchText: 'Отправляем товар со склада в Алматы. Доставка по Казахстану.',
      deliveryText: 'Доставка по всему Казахстану. Самовывоз из Алматы: пр. Аль-Фараби 77/2. Срок доставки согласуется индивидуально.',
      workTimeText: 'Пн-Пт: 9:00 - 18:00 по времени Алматы',
    },
    kz: {
      name: 'Алматы',
      address: 'Алматы қ., Әл-Фараби д. 77/2',
      pickup: 'Өзі алу: Алматы қ., Әл-Фараби д. 77/2',
      pickupShort: 'Өзі алу: Алматы, Әл-Фараби д. 77/2',
      dispatchText: 'Тауарды Алматыдағы қоймадан жолдаймыз. Қазақстан бойынша жеткізу.',
      deliveryText: 'Қазақстан бойынша жеткізу. Алматыдан өзі алу: Әл-Фараби д. 77/2. Жеткізу мерзімі жеке келісіледі.',
      workTimeText: 'Дс-Жм: 9:00 - 18:00 Алматы уақыты бойынша',
    },
  },
}

function getInitialCity() {
  if (typeof window === 'undefined') return DEFAULT_CITY
  const savedCity = window.localStorage.getItem(STORAGE_KEY)
  return CITY_DATA[savedCity] ? savedCity : DEFAULT_CITY
}

export function LocationProvider({ children }) {
  const { lang } = useLang()
  const [cityKey, setCityKey] = useState(getInitialCity)

  const cities = useMemo(
    () => Object.entries(CITY_DATA).map(([key, value]) => ({
      key,
      label: value[lang]?.name || value.ru.name,
    })),
    [lang]
  )

  const selectedCity = useMemo(() => {
    const city = CITY_DATA[cityKey] || CITY_DATA[DEFAULT_CITY]
    const localized = city[lang] || city.ru
    return {
      key: cityKey,
      ...localized,
      mapSrc: `https://maps.google.com/maps?q=${encodeURIComponent(city.mapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
    }
  }, [cityKey, lang])

  function setSelectedCity(key) {
    const nextCity = CITY_DATA[key] ? key : DEFAULT_CITY
    setCityKey(nextCity)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextCity)
    }
  }

  return (
    <LocationContext.Provider value={{ cityKey, cities, selectedCity, setSelectedCity }}>
      {children}
    </LocationContext.Provider>
  )
}
