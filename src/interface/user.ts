export enum UserRole {
  Teacher = 'teacher',
  Employee = 'employee',
  Student = 'student'
}
export interface IUser {
  id: number
  fullName: string
  email: string
  role: UserRole
}
export interface UserListConfig {
  page?: number
  page_size?: number
  order?: 'asc' | 'desc'
  keyword?: string
  role?: UserRole
}
