import SideBar from '@/layouts/LayoutMain'
import { routes } from '@/layouts/LayoutMain/menu-item'
import NotFound from '@/components/shared/NotFound'
import NotPermitted from '@/components/shared/NotPermitted'
import { AppContext, AppContextType } from '@/contexts/app.context'
import Login from '@/page/auth/Login'
import Register from '@/page/auth/Register'
import Home from '@/page/Home'
import { useContext } from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
import Student from '@/page/student'
import Teacher from '@/page/teacher'
import ClassEnrollment from '@/page/class-enrollment'
import ClassExamResult from '@/page/class-exam-result'
import StudentExamResult from '@/page/student-exam-result'

export default function useRoutesElements() {
  const { isAuthenticated, profile } = useContext<AppContextType>(AppContext)
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <RoleBaseRoute>{children}</RoleBaseRoute> : <Navigate to='/login' />
  }
  const RoleBaseRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation()
    const route = routes.find((route) => route.path === location.pathname)
    const check = route ? route.allowedGroups?.indexOf(profile?.role as string) !== -1 : false
    if (check) {
      return children
    }
    return <NotPermitted />
  }

  const routeElements = useRoutes([
    { path: '/login', element: isAuthenticated ? <Navigate to='/admin' /> : <Login /> },
    { path: '/register', element: isAuthenticated ? <Navigate to='/admin' /> : <Register /> },
    {
      path: '/admin',
      element: <SideBar />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )
        },
        {
          path: 'students',
          element: (
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          )
        },
        {
          path: 'class-enrollment',
          element: (
            <ProtectedRoute>
              <ClassEnrollment />
            </ProtectedRoute>
          )
        },
        {
          path: 'class-exam-result',
          element: (
            <ProtectedRoute>
              <ClassExamResult />
            </ProtectedRoute>
          )
        },
        {
          path: 'teachers',
          element: (
            <ProtectedRoute>
              <Teacher />
            </ProtectedRoute>
          )
        },
        {
          path: 'student-exam-result',
          element: (
            <ProtectedRoute>
              <StudentExamResult />
            </ProtectedRoute>
          )
        }
      ]
    },
    { path: '*', element: <NotFound /> }
  ])

  return routeElements
}
