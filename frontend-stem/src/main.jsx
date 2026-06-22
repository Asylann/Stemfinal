import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'

import App from './App.jsx'

import { LanguageProvider } from './i18n/LanguageContext'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { UserEmailProvider } from './context/UserEmailContext'
import { AuthProvider } from './context/AuthContext'
import { LocationProvider } from './context/LocationProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <LocationProvider>
          <UserEmailProvider>
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  <App />
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </UserEmailProvider>
        </LocationProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
)
