import { createContext, useContext } from 'react'

export const LocationContext = createContext(null)

export function useUserLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useUserLocation must be used within LocationProvider')
  }
  return context
}
