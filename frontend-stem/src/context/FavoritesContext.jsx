import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

const FAV_KEY = 'stem_favorites'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAV_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        return prev.filter(item => item.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const isFavorite = (id) => favorites.some(item => item.id === id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
