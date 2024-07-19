
import { classApi } from "@/api/class.api";
import ModalComponent from "@/components/Modal";
import { ModalProps } from "@/interface/app";
import { IUpdateExamResult } from "@/interface/exam-result";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { customAlphabet  } from 'nanoid';
import { examApi } from "@/api/exam.api";
const nanoid = customAlphabet('1234567890', 20);
interface FormData {
    result: number;
    examId: number;
    deadlineFeedback: Date
}
export interface EnterResultModalProps {
    studentId?: number
    studentName?: string
    className?: string
    classId?: number
}
interface Props {
    data: EnterResultModalProps
    onHandleUpdateSuccess: (data: {examName: string, result: number, id: string,studentId: number }) => void
}
export default function EnterResultModal({ open, setOpen, data, onHandleUpdateSuccess }: ModalProps & Props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [form] = Form.useForm();
    const [examName, setExamName] = useState<string>('')
    const customTitle = () => {
        return <p>Enter result</p>
      }
    const onCancel = () => {
        form.resetFields()
        setOpen(false)
    }
    const { data: examsData } = useQuery({
        queryKey: ['exams'],
        queryFn: () => examApi.getExams()
      })
    const enterResult = useMutation({
        mutationKey: ['enter-result'],
        mutationFn: (data: IUpdateExamResult) =>
          classApi.enterResult(data)
    })
    const onSubmitForm = (value: FormData) => {
       enterResult.mutate({
        classId: data.classId as number,
        studentId: data.studentId as number,
        data: {
          result: Number(value.result),
          deadlineFeedback: value.deadlineFeedback,
          exam: {
            id: value.examId
          }
        }
       }, {
        onSuccess: () => {
          toast.success('Enter result successfully')
          onHandleUpdateSuccess({
            examName,
            result: value.result,
            id: nanoid(),
            studentId: data.studentId as number
           })
          setOpen(false)
          form.resetFields()
        },
        onError: (error: unknown) => {
          console.log(error)
        }
      })
    }
    useEffect(() => {
       if(examsData?.data?.data[0]?.name) {
        setExamName(examsData?.data?.data[0]?.name)
       }
    }, [examsData])
    const formContentRender = () => {
        return (
          <Form
            name='basic'
            form={form}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            layout='vertical'
            onFinish={onSubmitForm}
            autoComplete='off'
          >
            <div className="w-full bg-yellow-500 p-2 mb-2">
                You are entering result for student: <strong>{data.studentName}</strong> in class: <strong>{data.className}</strong>
            </div>
            <Form.Item<FormData>
              label='Exam'
              name='examId'
              initialValue={examsData?.data?.data[0]?.id}        
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Select
                className='w-full'
                onChange={(_, options) => {
                    if((options as DefaultOptionType).children) {
                        setExamName((options as DefaultOptionType).children?.toString() as string)
                    }
                }}
                options={(examsData?.data?.data || []).map((d) => ({
                    value: d.id,
                    label: d.name
                }))}
            >
            </Select>
            </Form.Item>
            <Form.Item<FormData>
              label='Result'
              name='result'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input/>
            </Form.Item>

            <Form.Item<FormData>
              label='Deadline Feedback'
              name='deadlineFeedback'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <DatePicker className="w-full" format={['DD/MM/YYYY']}/>
            </Form.Item>
            <Row className='flex justify-end' gutter={[15, 15]}>
              <Col>
                <Button
                  type='default'
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        )
      }
      return (
        <ModalComponent customTitle={customTitle} formContentRender={formContentRender} open={open} setOpen={setOpen} onCancel={onCancel} />
      )
}