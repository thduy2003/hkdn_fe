export enum UserRole {
  Teacher = 'teacher',
  Employee = 'employee',
  Student = 'student'
}
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}
