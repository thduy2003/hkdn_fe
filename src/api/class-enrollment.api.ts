import { DataResponse, PageData } from '@/interface/app'
import { ClassEnrollmentListConfig, IClassEnrollment } from '@/interface/class-enrollment'
import http from './axiosClient'

export const classEnrollmentApi = {
  getAll(params: ClassEnrollmentListConfig): Promise<DataResponse<PageData<IClassEnrollment>>> {
    const url = `/class-enrollments/`
    return http.get(url, { params })
  }
}
