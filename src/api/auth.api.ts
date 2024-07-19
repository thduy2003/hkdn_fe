import http, { LoginResponse } from '@/api/axiosClient'
import { DataResponse } from '@/interface/app'
import { Account } from '@/redux/authSaga'

export const authApi = {
  login(params: Account): Promise<DataResponse<LoginResponse>> {
    const url = '/auth/login/'
    return http.post(url, params)
  },
  logout(): Promise<DataResponse<string>> {
    const url = '/auth/logout/'
    return http.post(url)
  },
  register(params: Account): Promise<DataResponse<LoginResponse>> {
    const url = '/auth/register/'
    return http.post(url, params)
  }
}
