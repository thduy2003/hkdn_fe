import { DataResponse, PageData } from '@/interface/app';
import http from './axiosClient'
import { User } from '@/interface/user';

export const userApi = {
  getUsers(params: { page: number; page_size: number; keyword: string }): Promise<DataResponse<PageData<User>>> {
    const { page, page_size, keyword } = params
    const url = `/admin/users/?page=${page}&page_size=${page_size}&keyword=${keyword}`
    return http.get(url)
  }
}
