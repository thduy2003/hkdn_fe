import { BaseConfig } from './app'
import { IClassEnrollment } from './class-enrollment'
import { IExam } from './exam'
import { IExamResult } from './exam-result'
import { IUser } from './user'

export interface IClass {
  id: number
  name: string
  startDate?: Date
  endDate?: Date
  teacher?: IUser
  classEnrollments?: IClassEnrollment[]
  examResults?: IExamResult[]
  exams?: IExam[]
}
export interface ClassListConfig extends BaseConfig {
  teacherId?: number
}
