import ModalComponent from '@/components/Modal';
import { ModalProps } from '@/interface/app';
import { IClassEnrollment } from '@/interface/class-enrollment'
import AddStudentModal from '@/page/student/modal';
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { useState } from 'react';
const {Option} = Select

export default function ClassEnrollmentModal({open, setOpen}: ModalProps) {
    const [openStudentModal, setOpenStudentModal] = useState(false)
  const onSubmitForm = (values: IClassEnrollment) => {
    console.log('Success:', values);
  };
  const customTitle = () => {
    return <p>Thêm mới học sinh vào lớp</p>
  }
  const formContentRender = () => {
    return  <Form
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
        defaultValue={1}
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
      <Input />
      <Row className='justify-start my-2'>
         <Button onClick={() => setOpenStudentModal(true)}>Thêm</Button>
         <AddStudentModal open={openStudentModal} setOpen={setOpenStudentModal}/>
      </Row>
    </Form.Item>
    <Row className='flex justify-end' gutter={[15,15]}>
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
  }
  return (
    <ModalComponent customTitle={customTitle} formContentRender={formContentRender} open={open} setOpen={setOpen}/>
  )
}
