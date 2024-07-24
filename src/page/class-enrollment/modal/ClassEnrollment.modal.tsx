import { userApi } from '@/api/user.api'
import ModalComponent from '@/components/Modal'
import { ModalProps } from '@/interface/app'
import { IClassEnrollment } from '@/interface/class-enrollment'
import { IUserList } from '@/interface/user'
import AddStudentModal from '@/page/student/modal'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Row, Select } from 'antd'
import { useState } from 'react'
import { toast } from 'sonner'
export interface IClassEnrollmentModalProps {
  setSearchTerm: (value: string) => void
  usersData: IUserList[]
  classId: number
}
export default function ClassEnrollmentModal({
  open,
  setOpen,
  setSearchTerm,
  usersData,
  classId
}: ModalProps & IClassEnrollmentModalProps) {
  const [openStudentModal, setOpenStudentModal] = useState(false)

  const [form] = Form.useForm()

  const queryClient = useQueryClient()

  const enrollClass = useMutation({
    mutationKey: ['enrollClass'],
    mutationFn: (value: IClassEnrollment) => userApi.enrollClass({ classId: value.classId, studentId: value.studentId })
  })

  const onSubmitForm = (value: IClassEnrollment) => {
    enrollClass.mutate(
      {
        ...value,
        classId
      },
      {
        onSuccess: () => {
          toast.success('Enrolled class successfully')
          queryClient.invalidateQueries(['class-enrollment'] as InvalidateQueryFilters)
          setOpen(false)
          form.resetFields()
        },
        onError: (error: unknown) => {
          console.log(error)
        }
      }
    )
  }
  const customTitle = () => {
    return <p>Add new student to the class</p>
  }
  const onCancel = () => {
    form.resetFields()
    setOpen(false)
  }
  const formContentRender = () => {
    return (
      <Form
        name='ClassEnrollmentForm'
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        layout='vertical'
        onFinish={onSubmitForm}
        autoComplete='off'
      >
        <Form.Item<IClassEnrollment>
          label='Student'
          className='mb-0'
          name='studentId'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Select
            showSearch
            placeholder={'Search student'}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={(value) => {
              setSearchTerm(value)
            }}
            notFoundContent={null}
            options={(usersData || []).map((d) => ({
              value: d.id,
              label: d.fullName
            }))}
          />
        </Form.Item>
        <Row className='justify-start my-2'>
          <Button onClick={() => setOpenStudentModal(true)}>Thêm</Button>
          <AddStudentModal open={openStudentModal} setOpen={setOpenStudentModal} />
        </Row>
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
