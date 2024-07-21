import { DataResponse, PageData } from '@/interface/app'
import http from './axiosClient'
import { FeedbackListConfig, IFeedback } from '@/interface/feedback'

export const feedbackApi = {
  getFeedbacks(params: FeedbackListConfig): Promise<DataResponse<PageData<IFeedback>>> {
    const url = `/feedbacks/`
    return http.get(url, { params })
  }
}
