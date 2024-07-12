import { ReactWithChild } from '@/interface/app'
import { getAccessTokenFromLS } from '@/utils/storage'
import { createContext, useState } from 'react'

export interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  reset: () => void
}

const initAppContext: AppContextType = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextType>(initAppContext)

const AppContextProvider = ({ children }: ReactWithChild) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initAppContext.isAuthenticated)
  const reset = () => {
    setIsAuthenticated(false)
  }
  return <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, reset }}>{children}</AppContext.Provider>
}

export default AppContextProvider
