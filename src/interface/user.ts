import { BaseConfig } from './app'
import { IClassEnrollment } from './class-enrollment'
import { IExamResult } from './exam-result'

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
  examResults?: IExamResult[]
}
export interface UserListConfig extends BaseConfig {
  role?: UserRole
}
export interface IAddUser {
  fullName: string;
  email: string;
}