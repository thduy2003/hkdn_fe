import SideBar from '@/components/shared/SideBar'
import { AppContext, AppContextType } from '@/contexts/app.context'
import Login from '@/page/auth/Login'
import Register from '@/page/auth/Register'
import Home from '@/page/Home'
import { useContext } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

export default function useRoutesElements() {
  const { isAuthenticated } = useContext<AppContextType>(AppContext)
  console.log(isAuthenticated)
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? children : <Navigate to='/login' />
  }

  const routeElements = useRoutes([
    { path: '/login', element: isAuthenticated ? <Navigate to='/' /> : <Login /> },
    { path: '/register', element: isAuthenticated ? <Navigate to='/' /> : <Register /> },
    {
      path: '/',
      element: <SideBar />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )
        }
      ]
    },
    { path: '*', element: <h1>404</h1> }
  ])

  return routeElements
}
