import HttpStatusCode from '@/constants/http'
// import { useAppDispatch } from '@/redux/hooks'
// import { appAction } from '@/redux/store/appSlice'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS } from '@/utils/storage'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import config from './../configs/index'
import { toast } from 'sonner'

export interface LoginResponse {
  data: {
    access_token: string
    [key: string]: string
  }
}

export class Http {
  instance: AxiosInstance
  private AccessToken: string
  private RefreshTokenRequest: Promise<string> | null
  private isRefreshToken: boolean;
  constructor() {
    this.AccessToken = getAccessTokenFromLS()
    this.RefreshTokenRequest = null
    this.isRefreshToken = false;
    this.instance = axios.create({
      baseURL: config.baseUrl,

      timeout: 5000,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:4000/api',
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60 * 24, // 1 ngày
        'expire-refresh-token': 60 * 60 * 24 * 160 // 160 ngày
      }
    })
    this.instance.interceptors.request.use(
      async (config) => {
        if (this.AccessToken && config.headers) {
          if (is expired) {
            if (!this.isRefreshToken) {
              this.isRefreshToken = true;
              start refresh process
            }
            while(this.isRefreshToken) {
              chờ 50ms
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
        console.log('config', response.config)
        const { url } = response.config
        const data = response.data as LoginResponse
        if (url === '/auth/login/' || url === '/auth/login/') {
          this.AccessToken = data.data.access_token
          setAccessTokenToLS(this.AccessToken)
        } else if (url === '/auth/logout/') {
          this.AccessToken = ''
          clearLS()
        }
        return response
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
          console.log('2')

          const config: AxiosRequestConfig = error.response?.config || {}

          const { url } = config
        
          if (
            error.response?.data?.message === 'Expired token' &&
            url !== '/auth/refresh-token/'
          ) {
            this.RefreshTokenRequest = this.RefreshTokenRequest
              ? this.RefreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.RefreshTokenRequest = null
                  }, 10000)
                })
            return this.RefreshTokenRequest.then((access_token) => {
              // tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }
          this.AccessToken = ''
          clearLS()
          toast.error(error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .get<LoginResponse>('/auth/refresh-token/', {
        withCredentials: true
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLS(access_token)
        this.AccessToken = access_token
        return access_token
      })
      .catch((error) => {
        this.AccessToken = ''
        clearLS()
        throw error
      })
  }
}
const http = new Http().instance
export default http
