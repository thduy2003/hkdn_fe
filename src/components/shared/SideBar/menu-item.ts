import { UserRole } from '@/interface/user'
import { RouteInfo } from './sidebar.metadata'

export const routes: RouteInfo[] = [
  {
    path: '/',
    title: 'Student',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Student]
  },
  {
    path: '/teachers',
    title: 'Teacher',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Teacher]
  }
]
