import React, { useContext, useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Avatar, Button, Divider, Dropdown, Layout, Menu, MenuProps, Popover, Space, theme } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { routes } from './menu-item'
import { RouteInfo } from './sidebar.metadata'
import { AppstoreOutlined } from '@ant-design/icons'
import { AppContext, AppContextType } from '@/contexts/app.context'
import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { toast } from 'sonner'
import { IoNotificationsOutline } from 'react-icons/io5'
import { IoClose } from 'react-icons/io5'
import { MdMessage } from 'react-icons/md'
import socket from '@/socket'
import { notificationApi } from '@/api/notification.api'
import { INotification, NotificationListConfig } from '@/interface/notification'
import moment from 'moment'

const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const location = useLocation()
  const { profile, setIsAuthenticated, setProfile } = useContext<AppContextType>(AppContext)
  const [width, setWidth] = useState<string>('85%')
  const [marginLeft, setMarginLeft] = useState<string>('15%')
  const [notificationData, setNotificationData] = useState<INotification[]>([])
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])
  const [activeMenu, setActiveMenu] = useState('')
  const [open, setOpen] = useState(false)

  const hide = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const logOutMutation = useMutation({
    mutationFn: authApi.logout
  })
  const handleLogout = () => {
    logOutMutation.mutate(undefined, {
      onSuccess: () => {
        setIsAuthenticated(false)
        setProfile(null)
        toast.success('Logged out successfully', {
          cancel: true
        })
      }
    })
  }

  const queryConfig: NotificationListConfig = {
    page_size: 10,
    page: 1,
    userId: profile?.id
  }

  const { data: fetchNotificationData } = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn: () => notificationApi.getNotifications(queryConfig)
  })
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      handleLogout()
    }
  }
  const itemsDropdown = [
    {
      label: <Link to={'/admin'}>Trang chủ</Link>,
      key: 'home'
    },
    {
      label: <button style={{ cursor: 'pointer' }}>Logout</button>,
      key: 'logout'
    }
  ]
  React.useEffect(() => {
    if (profile) {
      const result: RouteInfo[] = []
      routes.forEach((route) => {
        if (route.allowedGroups?.indexOf(profile.role) !== -1) {
          result.push(route)
        }
      })
      const full = result.map((item) => {
        return {
          label: <Link to={item.path}>{item.title}</Link>,
          key: `${item.path}`,
          icon: <AppstoreOutlined />
        }
      })
      setMenuItems(full)
    }
  }, [profile])
  React.useEffect(() => {
    setActiveMenu(location.pathname)
  }, [location])
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  React.useEffect(() => {
    setWidth(collapsed ? '100%' : '85%')
    setMarginLeft(collapsed ? '0' : '15%')
  }, [collapsed])

  React.useEffect(() => {
    if (fetchNotificationData?.data?.data) {
      setNotificationData(fetchNotificationData?.data?.data)
    }
  }, [fetchNotificationData])
  React.useEffect(() => {
    // client-side

    //This place is being triggered twice so we have to search to see if it already exists before adding it to the array
    socket.on('receive_notification', (payload) => {
      if (payload) {
        setNotificationData((prevData) => {
          const found = prevData.find((data) => data.id === payload.id)
          if (found) {
            return prevData
          }
          return [
            {
              ...payload
            },
            ...prevData
          ]
        })
      }
    })
  }, [])
  return (
    <>
      <Header
        style={{ padding: 0, background: colorBgContainer, position: 'fixed', top: 0 }}
        className='flex justify-between w-full z-50'
      >
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => {
            setCollapsed(!collapsed)
          }}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64
          }}
        />
        <div className='flex items-center jusitfy-center gap-3'>
          <Popover
            rootClassName='p-0'
            className='p-0'
            content={
              <div className='w-[300px] h-[300px] overflow-auto'>
                {notificationData && notificationData?.length > 0 ? (
                  notificationData?.map((item) => {
                    return (
                      <div key={item.id} className='flex gap-2 p-2'>
                        <div className='flex-shrink-0 flex items-center'>
                          <MdMessage className='size-10' />
                        </div>
                        <div className='flex-1'>
                          <div>
                            <h1 className='text-[18px] font-bold'>SYSTEM</h1>
                          </div>
                          <div className='text-justify line-clamp-3 font-semibold'>{item.content}</div>
                          <div className='flex justify-end font-bold text-sm text-gray-400 mt-1'>
                            Created at: {moment(item.createdAt).format('DD/MM/YYYY hh:mma')}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className='text-xl text-center'>No notifications!</div>
                )}
              </div>
            }
            title={
              <div className='relative'>
                Notifications
                <div onClick={hide} className='absolute top-0 right-0'>
                  <IoClose className='size-5 cursor-pointer hover:text-blue-500' />
                </div>
                <Divider className='my-2 bg-blue-500' />
              </div>
            }
            placement='bottomRight'
            trigger='click'
            open={open}
            onOpenChange={handleOpenChange}
          >
            <div className='relative'>
              <IoNotificationsOutline className='size-[30px] pt-1 cursor-pointer hover:text-blue-500' />
              <div className='absolute top-[3px] right-1 size-[10px] rounded-full bg-blue-500'></div>{' '}
            </div>
          </Popover>
          <Dropdown menu={{ items: itemsDropdown, onClick }} trigger={['click']} className='px-4'>
            <Space style={{ cursor: 'pointer' }}>
              {/* Welcome {profile?.fullName} */}
              <Avatar> {profile?.fullName?.split(' ')[profile?.fullName?.split(' ').length - 1]} </Avatar>
            </Space>
          </Dropdown>
        </div>
      </Header>
      <Layout className='w-full h-screen pt-[64px]'>
        <Sider
          trigger={null}
          breakpoint='lg'
          onBreakpoint={(broken) => {
            setCollapsed(broken)
          }}
          width='15%'
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0
          }}
          collapsedWidth='0'
          collapsible
          collapsed={collapsed}
          className='transition-all duration-400 ease-in-out'
        >
          <Menu
            theme='dark'
            selectedKeys={[activeMenu]}
            mode='inline'
            items={menuItems}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>
        <Layout
          style={{
            width: width,
            overflow: 'auto',
            marginLeft: marginLeft
          }}
          className='transition-all duration-400 ease-in-out'
        >
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              height: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
