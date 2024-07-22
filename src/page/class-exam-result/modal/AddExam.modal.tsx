import { classApi } from "@/api/class.api";
import ModalComponent from "@/components/Modal";
import { ModalProps } from "@/interface/app";
import { IExam } from "@/interface/exam";
import { useMutation } from "@tanstack/react-query";
import { Button, Col, Form, Row, Select } from "antd";
import { toast } from "sonner";
export interface AddExamModalProps {
    classId?: number,
    examsData: IExam[] | undefined
}
export default function AddExamModal({open, setOpen, classId, examsData} : ModalProps & AddExamModalProps) {
    const [form] = Form.useForm()
    
    const addExams = useMutation({
        mutationKey: ['enter-result'],
        mutationFn: (data: {examIds: number[], classId: number}) => classApi.addExams(data)
    })
    const customTitle = () => {
        return <p>Add Exams</p>
    }
    const onCancel = () => {
        form.resetFields()
        setOpen(false)
    }
    const onSubmitForm = (value: IExam) => {
      
      if(value.id) {
        addExams.mutate(
            {
              classId: classId as number,
              examIds: [...value.id.toString().split(',').map(x => Number(x))]
            },
            {
              onSuccess: () => {
                toast.success('Exams have been successfully added for the class')
                setOpen(false)
                form.resetFields()
              },
              onError: (error: unknown) => {
                console.log(error)
              }
            }
          )
      }
    }
    const formContentRender = () => {
        return (
          <Form
            name='basic'
            form={form}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            onFinish={onSubmitForm}

            layout='vertical'
            autoComplete='off'
          >
            <Form.Item<IExam>
              label='Exam'
              name='id'
              initialValue={[examsData && examsData[0]?.id]}
              rules={[{ required: true, message: 'Please enter the exam' }]}
            >
              <Select
                className='w-full'
                mode="multiple"
                options={(examsData || []).map((d) => ({
                  value: d.id,
                  label: d.name + ' - ' + d.type
                }))}
              ></Select>
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
        <ModalComponent
          customTitle={customTitle}
          formContentRender={formContentRender}
          open={open}
          setOpen={setOpen}
          onCancel={onCancel}
        />
      )
}