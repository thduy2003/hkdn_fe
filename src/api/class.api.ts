import { DataResponse, PageData } from '@/interface/app'
import { ClassListConfig, IClass } from '@/interface/class'
import http from './axiosClient'
import { IUserList, UserListConfig } from '@/interface/user'
import { IUpdateExamResult } from '@/interface/exam-result'

export const classApi = {
  getClassesByTeacher(params: ClassListConfig): Promise<DataResponse<PageData<IClass>>> {
    const url = `/classes/`
    return http.get(url, {params})
  },
  getClassDetail(classId: number): Promise<DataResponse<IClass>> {
    const url = `/class/${classId}`
    return http.get(url)
  },
  getStudentsInClass(classId: number, params: UserListConfig): Promise<DataResponse<PageData<IUserList>>>  {
    const url = `/class/${classId}/students`
    return http.get(url, {params})
  },
  enterResult(data: IUpdateExamResult): Promise<string> {
    const url = `/class/${data.classId}/${data.studentId}/result`
    return http.post(url, {
      examId: data.data.exam.id,
      result: data.data.result,
      deadlineFeedback: data.data.deadlineFeedback
    })
  },
  addExams(params: { examIds: number[]; classId: number }): Promise<DataResponse<string>> {
    const url = `/class/${params.classId}/exam`
    return http.post(url, {examIds: params.examIds})
  }
}
