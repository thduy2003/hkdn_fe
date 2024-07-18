import { DataResponse, PageData } from '@/interface/app'
import { IClass } from '@/interface/class'
import http from './axiosClient'
import { IUserList, UserListConfig } from '@/interface/user'

export const classApi = {
  getClassDetail(classId: number): Promise<DataResponse<IClass>> {
    const url = `/class/${classId}`
    return http.get(url)
  },
  getStudentsInClass(classId: number, params: UserListConfig): Promise<DataResponse<PageData<IUserList>>>  {
    const url = `/class/${classId}/students`
    return http.get(url, {params})
  }
}
