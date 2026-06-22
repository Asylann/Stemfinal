import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

const CART_KEY = 'stem_cart'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    const normalizedProduct = {
      ...product,
      name: product.name || product.title,
      img: product.image || product.img || product.photo,
    }
    const cartKey = `${normalizedProduct.id}__${normalizedProduct.color || ''}`
    setCartItems(prev => {
      const existing = prev.find(item => `${item.id}__${item.color || ''}` === cartKey)
      if (existing) {
        return prev.map(item =>
          `${item.id}__${item.color || ''}` === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...normalizedProduct, quantity: 1, _cartKey: cartKey }]
    })
  }

  const getItemKey = (item) => item._cartKey || `${item.id}__${item.color || ''}`

  const removeFromCart = (cartKey) => setCartItems(prev => prev.filter(item => getItemKey(item) !== cartKey))

  const increaseQty = (cartKey) => {
    setCartItems(prev =>
      prev.map(item =>
        getItemKey(item) === cartKey ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQty = (cartKey) => {
    setCartItems(prev =>
      prev.map(item =>
        getItemKey(item) === cartKey ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem(CART_KEY)
  }

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
      isOpen,
      setIsOpen,
      totalCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
