import { BaseConfig } from './app'

export interface INotification {
  id?: number
  content: string
  createdAt: Date
  read?: boolean
}
export interface NotificationListConfig extends BaseConfig {
  userId?: number
}
