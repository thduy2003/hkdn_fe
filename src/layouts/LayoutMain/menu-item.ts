import { UserRole } from '@/interface/user'
import { RouteInfo } from './sidebar.metadata'

export const routes: RouteInfo[] = [
  {
    path: '/admin',
    title: 'Dashboard',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Student, UserRole.Teacher, UserRole.Employee]
  },
  {
    path: '/admin/students',
    title: 'Student',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Employee]
  },
  {
    path: '/admin/class-enrollment',
    title: 'Class Enrollment',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Employee]
  },
  {
    path: '/admin/class-exam-result',
    title: 'Class Exam Result',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Teacher]
  },
  {
    path: '/admin/teachers',
    title: 'Teacher',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Teacher]
  }
]
