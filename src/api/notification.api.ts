import { DataResponse, PageData } from '@/interface/app'
import { INotification, NotificationListConfig } from '@/interface/notification'
import http from './axiosClient'

export const notificationApi = {
  getNotifications(params: NotificationListConfig): Promise<DataResponse<PageData<INotification>>> {
    const url = `/notifications/`
    return http.get(url, { params })
  }
}
