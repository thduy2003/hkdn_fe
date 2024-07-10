import uehCover from '@/assets/ueh_cover.png'
import uehLogo from '@/assets/ueh_logo.png'
import FloatInput from '@/components/FloatInput'

import { Button, Form, FormProps, Input, Typography } from 'antd'
const { Text } = Typography
type FieldType = {
  username?: string
  password?: string
}
function Login() {
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div className='w-full min-h-screen flex items-stretch justify-center bg-[#f2f2f2]'>
      <div className={`bg-[url('.${uehCover}')] w-[calc(100%_-_560px)] bg-no-repeat bg-cover bg-center z-[1]`}></div>
      <div className='w-[560px] min-h-screen block bg-[#f7f7f7] p-[55px]'>
        <div className='flex items-center justify-center'>
          <img src={`.${uehLogo}`} className='object-cover w-[200px] h-[125px]' />
        </div>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item<FieldType> name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <FloatInput label='Email' placeholder='Email here please' height={50} />
          </Form.Item>

          <Form.Item<FieldType> name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <FloatInput label='Password' type='password' placeholder='Password here please' height={50} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Login
