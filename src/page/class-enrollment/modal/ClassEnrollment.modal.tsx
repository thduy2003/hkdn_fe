import { classEnrollmentApi } from '@/api/class-enrollment.api'
import { userApi } from '@/api/user.api'
import ModalComponent from '@/components/Modal'
import useDebounceState from '@/hooks/useDebounce'
import { ModalProps } from '@/interface/app'
import { IClassEnrollment } from '@/interface/class-enrollment'
import { UserListConfig } from '@/interface/user'
import AddStudentModal from '@/page/student/modal'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Row, Select } from 'antd'
import { useState } from 'react'
import { toast } from 'sonner'
const { Option } = Select

export default function ClassEnrollmentModal({ open, setOpen }: ModalProps) {
  const [openStudentModal, setOpenStudentModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, debouncedSearchTerm, setSearchTerm] = useDebounceState('', 300)
  const queryClient = useQueryClient()

  const queryConfig: UserListConfig = {
    page_size: 10,
    page: 1,
    ...(debouncedSearchTerm ? { keyword: debouncedSearchTerm } : {})
  }

  const { data: usersData } = useQuery({
    queryKey: ['users', debouncedSearchTerm],
    queryFn: () => userApi.getUsers(queryConfig)
  })
  const enrollClass = useMutation({
    mutationKey: ['enrollClass'],
    mutationFn: (value: IClassEnrollment) =>
      classEnrollmentApi.enrollClass({ classId: value.classId, studentId: value.studentId })
  })

  const onSubmitForm = (value: IClassEnrollment) => {
    enrollClass.mutate(value, {
      onSuccess: () => {
        toast.success('Enrolled class successfully')
        queryClient.invalidateQueries(['class-enrollment'] as InvalidateQueryFilters)
        setOpen(false)
      },
      onError: (error: unknown) => {
        console.log(error)
      }
    })
  }
  const customTitle = () => {
    return <p>Thêm mới học sinh vào lớp</p>
  }

  const formContentRender = () => {
    return (
      <Form
        name='basic'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        layout='vertical'
        onFinish={onSubmitForm}
        autoComplete='off'
      >
        <Form.Item<IClassEnrollment>
          label='Lớp học'
          name='classId'
          initialValue={4}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Select
            // placeholder="Select a option and change input text above"
            // onChange={(val) => {
            //   setTimeout(() => {
            //   }, 0)
            // }}
            // allowClear
            className='w-full'
          >
            <Option value={1}>BI001</Option>
            <Option value={2}>BI002</Option>
            <Option value={4}>DS001</Option>
          </Select>
        </Form.Item>

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
            options={(usersData?.data?.data || []).map((d) => ({
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
    <ModalComponent customTitle={customTitle} formContentRender={formContentRender} open={open} setOpen={setOpen} />
  )
}
