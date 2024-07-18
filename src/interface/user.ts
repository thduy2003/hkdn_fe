import { BaseConfig } from "./app"
import { IClassEnrollment } from "./class-enrollment"

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
export interface IUserList {
  id: number 
  fullName: string 
  email?: string 
  role?: string
  classEnrollments?: IClassEnrollment[]
}
export interface UserListConfig extends BaseConfig{
  role?: UserRole
}
