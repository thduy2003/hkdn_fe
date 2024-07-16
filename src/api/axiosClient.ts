import HttpStatusCode from '@/constants/http'
import {
  clearLS,
  getAccessTokenFromLS,
  getTokenExpiredFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setTokenExpiredToLS
} from '@/utils/storage'
import axios, { AxiosInstance } from 'axios'
import config from './../configs/index'
import { toast } from 'sonner'
import moment from 'moment'
import { IUser } from '@/interface/user'

export interface LoginResponse {
  expired_at: number
  access_token: string
  user: IUser
}

export class Http {
  instance: AxiosInstance
  private AccessToken: string
  private isTokenExpired: boolean
  private isRefreshToken: boolean
  constructor() {
    this.AccessToken = getAccessTokenFromLS()
    this.isRefreshToken = false
    this.isTokenExpired = false
    this.instance = axios.create({
      baseURL: config.baseUrl,
      withCredentials: true,
      timeout: 5000,
      headers: {
        'Access-Control-Allow-Origin': import.meta.env.VITE_API_URL,
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 15, // 15 phút
        'expire-refresh-token': 60 * 60 * 24 * 7 // 160 ngày
      }
    })
    this.instance.interceptors.request.use(
      async (config) => {
        if (this.AccessToken && config.headers) {
          const expiredAt = getTokenExpiredFromLS()
          this.isTokenExpired = moment(new Date(Number(expiredAt) * 1000)).isBefore(new Date())
          if (this.isTokenExpired && config.url !== '/auth/refresh-token/') {
            if (!this.isRefreshToken) {
              this.isRefreshToken = true
              try {
                const data = await this.instance.get<LoginResponse>('/auth/refresh-token/')

                if (data.data) {
                  this.AccessToken = data.data.access_token
                  setAccessTokenToLS(this.AccessToken)
                  setTokenExpiredToLS(data.data.expired_at)
                  this.isRefreshToken = false
                  this.isTokenExpired = false
                }
              } catch (err) {
                this.AccessToken = ''
                this.isRefreshToken = false
                this.isTokenExpired = false
                clearLS()
                throw err
              }
            }
            while (this.isRefreshToken) {
              await new Promise((resolve) => {
                setTimeout(() => {
                  return resolve(true)
                }, 50)
              })
            }
          }

          config.headers.Authorization = `Bearer ${this.AccessToken}`
          return config
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        const data = response.data.data as LoginResponse
        if (url === '/auth/login/' || url === '/auth/login/') {
          this.AccessToken = data.access_token
          setAccessTokenToLS(this.AccessToken)
          setTokenExpiredToLS(data.expired_at)
          setProfileToLS(data.user)
        } else if (url === '/auth/logout/') {
          this.AccessToken = ''
          clearLS()
        }
        return response.data
      },
      async (error) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }

        if (error.response?.status === HttpStatusCode.Unauthorized) {
          this.AccessToken = ''
          this.isRefreshToken = false
          this.isTokenExpired = false
          clearLS()
          toast.error(error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }
}
const http = new Http().instance
export default http
