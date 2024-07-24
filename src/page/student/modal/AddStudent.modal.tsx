import { userApi } from '@/api/user.api'
import ModalComponent from '@/components/Modal'
import { ModalProps } from '@/interface/app'
import { IUser } from '@/interface/user'
import { useMutation } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row } from 'antd'
import { toast } from 'sonner'
export default function AddStudentModal({ open, setOpen }: ModalProps) {
  const [form] = Form.useForm()
  const addUser = useMutation({
    mutationKey: ['enter-result'],
    mutationFn: (data: IUser) => userApi.addUser(data)
  })
  const onSubmitForm = (values: IUser) => {
    addUser.mutate({
      ...values
    }, {
      onSuccess: () => {
        form.resetFields()
        toast.success('Student added successfully')
      },
      onError: (error) => {
        console.error(error)
      }
    })
  }
  const customTitle = () => {
    return <p>Add new Student</p>
  }
  const onCancel = () => {
    form.resetFields()
    setOpen(false)
  }
  const formContentRender = () => {
    return (
      <Form
      form={form}
        name='addStudentForm'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        layout='vertical'
        onFinish={onSubmitForm}
        autoComplete='off'
      >
        <Form.Item<IUser>
          label='Student Email'
          className='mb-0'
          name='email'
          rules={[{ required: true, message: 'Please enter the student\'s email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<IUser>
          label='Student Name'
          className='mb-0'
          name='fullName'
          rules={[{ required: true, message: 'Please enter the student\'s full name' }]}
        >
          <Input />
        </Form.Item>
        <Row className='flex justify-end mt-4' gutter={[15, 15]}>
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
    <ModalComponent onCancel={onCancel} customTitle={customTitle} formContentRender={formContentRender} open={open} setOpen={setOpen} />
  )
}
