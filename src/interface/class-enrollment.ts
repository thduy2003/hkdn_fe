import { IClass } from './class'
import { IUser } from './user'

export interface IClassEnrollment {
  classId: number
  studentId: number
  enrollmentDate: Date
  createdAt: Date
  user: IUser
  class: IClass
}
export interface ClassEnrollmentListConfig {
  page?: number
  page_size?: number
  order?: 'asc' | 'desc'
  classId: number
  keyword?: string
}
