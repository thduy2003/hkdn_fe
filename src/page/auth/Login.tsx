import { authApi } from '@/api/auth.api'
import FloatInput from '@/components/FloatInput'
import { AppContext, AppContextType } from '@/contexts/app.context'
import { UserRole } from '@/interface/user'
import { Account } from '@/redux/authSaga'
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Typography } from 'antd'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
const { Text } = Typography
type FieldType = {
  email?: string
  password?: string
}
export default function Login() {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext<AppContextType>(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: Account) => authApi.login(data)
  })
  const onSubmit = async (data: Account) => {
    setIsLoading(true)
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsLoading(false)
        setIsAuthenticated(true)
        setProfile(data.data.user)
        switch (data.data.user.role) {
          case UserRole.Employee:
            navigate('/admin/students')
            break
          case UserRole.Teacher:
            navigate('/admin/teachers')
            break
          default:
            navigate('/admin')
            break
        }

        toast.success('Login successfully')
      },
      onError: (error) => {
        setIsLoading(false)
      }
    })
  }
  return (
    <div className='w-full min-h-screen flex items-stretch justify-center bg-[#f2f2f2]'>
      <div
        className={`bg-[url('./src/assets/ueh_cover.jpg')] max-md:hidden max-lg:w-1/2 w-[calc(100%_-_560px)] bg-no-repeat bg-cover bg-center z-[1]`}
      ></div>
      <div className='max-md:w-full max-lg:w-1/2 w-[560px] min-h-screen block bg-[#f7f7f7] p-[55px]'>
        <div className='flex items-center justify-center'>
          <img src='./src/assets/ueh_logo.png' className='object-cover w-[200px] h-[125px]' />
        </div>
        <h1 className='text-center font-bold mt-4 text-xl mb-2'>DÀNH CHO NGƯỜI HỌC</h1>
        <Form name='basic' initialValues={{ remember: true }} onFinish={onSubmit} autoComplete='off'>
          <Form.Item<FieldType> name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
            <FloatInput label='Email' placeholder='Email' height={78} />
          </Form.Item>

          <Form.Item<FieldType> name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <FloatInput label='Password' type='password' placeholder='Password' height={78} />
          </Form.Item>

          <Form.Item>
            <Button loading={isLoading} className='w-full h-[50px] uppercase' type='primary' htmlType='submit'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
