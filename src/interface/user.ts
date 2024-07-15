export enum UserRole {
  Teacher = 'teacher',
  Employee = 'employee',
  Student = 'student'
}
export interface User {
  id: number
  fullName: string
  email: string
  role: UserRole
}
