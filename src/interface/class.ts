import { IClassEnrollment } from './class-enrollment'
import { IUser } from './user'

export interface IClass {
  name: string
  startDate: Date
  endDate: Date
  user: IUser
  classEnrollments: IClassEnrollment[]
}
