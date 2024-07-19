import { IExam } from "./exam";

export interface IExamResult {
  id?: string | number;
  result: number
  exam: IExam
  deadlineFeedback?: Date
}

export interface IUpdateExamResult {
  studentId: number 
  classId: number 
  data: IExamResult
}