

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
      <div className={`bg-[url('./src/assets/ueh_cover.jpg')] max-md:hidden max-lg:w-1/2 w-[calc(100%_-_560px)] bg-no-repeat bg-cover bg-center z-[1]`}></div>
      <div className='max-md:w-full max-lg:w-1/2 w-[560px] min-h-screen block bg-[#f7f7f7] p-[55px]'>
        <div className='flex items-center justify-center'>
          <img src='./src/assets/ueh_logo.png' className='object-cover w-[200px] h-[125px]' />
        </div>
        <h1 className='text-center font-bold mt-4 text-xl mb-2'>DÀNH CHO NGƯỜI HỌC</h1>
        <Form
         
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item<FieldType> name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <FloatInput label='Email' placeholder='Email' height={78}/>
          </Form.Item>

          <Form.Item<FieldType> name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <FloatInput label='Password' type='password' placeholder='Password' height={78}/>
          </Form.Item>

          <Form.Item>
            <Button className='w-full h-[50px] uppercase' type='primary' htmlType='submit'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Login
