import { IExam } from './exam'
import { IFeedback } from './feedback'

export interface IExamResult {
  id?: string | number
  result: number
  exam: IExam
  deadlineFeedback?: Date
  feedbacks?: IFeedback[]
}

export interface IUpdateExamResult {
  studentId: number
  classId: number
  data: IExamResult
}
