import { DataResponse, PageData } from '@/interface/app';
import http from './axiosClient'
import { IUser, UserListConfig } from '@/interface/user';

export const userApi = {
  getUsers(params: UserListConfig): Promise<DataResponse<PageData<IUser>>> {
    const url = `/admin/users/`
    return http.get(url, {params})
  }
}
