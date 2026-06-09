import { createContext, useContext, useState } from 'react'

const UserEmailContext = createContext()

export function UserEmailProvider({ children }) {
  const [userEmail, setUserEmail] = useState(null)
  return (
    <UserEmailContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserEmailContext.Provider>
  )
}

export const useUserEmail = () => useContext(UserEmailContext)