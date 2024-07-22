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
  // {
  //   path: '/admin/class/${id}',
  //   title: 'Class Detail',
  //   icon: 'zmdi zmdi-view-dashboard',
  //   allowedGroups: [UserRole.Teacher]
  // },
  {
    path: '/admin/class',
    title: 'Classes',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Teacher]
  },
  {
    path: '/admin/student-exam-result',
    title: 'Exam Result',
    icon: 'zmdi zmdi-view-dashboard',
    allowedGroups: [UserRole.Student]
  }
]
