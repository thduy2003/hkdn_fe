import { DataResponse, PageData } from '@/interface/app'
import http from './axiosClient'
import { IUser, UserListConfig } from '@/interface/user'

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
  }
}
