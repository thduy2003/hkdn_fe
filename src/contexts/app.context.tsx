import { ReactWithChild } from '@/interface/app'
import { User } from '@/interface/user'
import { getAccessTokenFromLS, getProfileFromLS } from '@/utils/storage'
import { createContext, useState } from 'react'

export interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  reset: () => void
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const initAppContext: AppContextType = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  reset: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null
}

export const AppContext = createContext<AppContextType>(initAppContext)

const AppContextProvider = ({ children }: ReactWithChild) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initAppContext.profile)

  const reset = () => {
    setIsAuthenticated(false)
  }
  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, reset }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
