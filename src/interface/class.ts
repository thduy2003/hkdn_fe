import { IClassEnrollment } from './class-enrollment'
import { IUser } from './user'

export interface IClass {
  id: number
  name: string
  startDate: Date
  endDate: Date
  teacher?: IUser
  classEnrollments?: IClassEnrollment[]
}
