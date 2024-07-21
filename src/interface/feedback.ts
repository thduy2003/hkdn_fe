import { BaseConfig } from './app'

export interface IFeedback {
  id?: number
  content: string
  createdAt: Date
}
export interface FeedbackListConfig extends BaseConfig {
  examResultId?: number
}
export interface ICreateExamResultFeedback {
  examResultId: number
  content: string
}
