import { DataResponse } from '@/interface/app'
import { IClass } from '@/interface/class'
import http from './axiosClient'

export const classApi = {
  getClassDetail(classId: number): Promise<DataResponse<IClass>> {
    const url = `/class/${classId}`
    return http.get(url)
  }
}
