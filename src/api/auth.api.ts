import http, { LoginResponse } from '@/api/axiosClient'
import { Account } from '@/redux/authSaga'

export const authApi = {
  login(params: Account): Promise<LoginResponse> {
    const url = '/auth/login/'
    return http.post(url, params)
  },
  register(params: Account): Promise<LoginResponse> {
    const url = '/auth/register/'
    return http.post(url, params)
  }
}
