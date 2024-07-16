import ModalComponent from "@/components/Modal";
import { ModalProps } from "@/interface/app";
import { Button, Col, Form, Input, Row, Select } from "antd";
const {Option} = Select
export default function AddStudentModal({open, setOpen}: ModalProps) {
    const onSubmitForm = (values: any) => {
        console.log('Success:', values);
      };
      const customTitle = () => {
        return <p>Thêm sinh viên</p>
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
        <Form.Item<any>
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
    
        <Form.Item<any>
          label='Student'
          className='mb-0'
          name='studentId'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input />
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