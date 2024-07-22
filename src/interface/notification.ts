import { BaseConfig } from './app'

export interface INotification {
  id?: number
  content: string
  createdAt: Date
  read?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any
}
export interface NotificationListConfig extends BaseConfig {
  userId?: number
}
