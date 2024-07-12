import http from "./axiosClient";

export const userApi = {
    getUsers(params: { page: number; page_size: number }): Promise<any> {
        const { page, page_size } = params
        const url = `/admin/users/?page=${page}&page_size=${page_size}`
        return http.get(url)
    },
}