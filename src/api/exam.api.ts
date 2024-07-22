import { DataResponse, PageData } from "@/interface/app"
import { IExam } from "@/interface/exam"
import http from "./axiosClient"

export const examApi = {
    getExams(): Promise<DataResponse<PageData<IExam>>> {
      const url = `/exams/`
      return http.get(url)
    }
}
  