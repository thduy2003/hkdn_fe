import { DataResponse, PageData } from '@/interface/app'
import http from './axiosClient'
import { IUser, UserListConfig } from '@/interface/user'
import { ClassListConfig, IClass } from '@/interface/class'
import { ICreateExamResultFeedback } from '@/interface/feedback'

export const userApi = {
  getUsers(params: UserListConfig): Promise<DataResponse<PageData<IUser>>> {
    const url = `/users/`
    return http.get(url, { params })
  },
  enrollClass(params: { classId: number; studentId: number }): Promise<DataResponse<string>> {
    const url = `/user/enroll/${params.classId}`
    return http.post(url, {
      studentId: params.studentId
    })
  },
  unenrollClass(params: { classId: number; studentId: number }): Promise<DataResponse<string>> {
    const url = `/user/unenroll/${params.classId}`
    return http.post(url, {
      studentId: params.studentId
    })
  },
  getExamResults(params: ClassListConfig): Promise<DataResponse<PageData<IClass>>> {
    const url = `/user/exam-results`
    return http.get(url, { params })
  },
  createExamResultFeedback(params: ICreateExamResultFeedback): Promise<string> {
    const url = `/user/exam-result/${params.examResultId}/feedback`
    return http.post(url, { content: params.content })
  }
}
