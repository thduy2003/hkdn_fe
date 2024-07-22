import React, { useContext, useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Menu, MenuProps, Space, theme } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { routes } from './menu-item'
import { RouteInfo } from './sidebar.metadata'
import { AppstoreOutlined } from '@ant-design/icons'
import { AppContext, AppContextType } from '@/contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { toast } from 'sonner'
import Notification from '@/components/shared/Notification'

const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const location = useLocation()
  const { profile, setIsAuthenticated, setProfile } = useContext<AppContextType>(AppContext)
  const [width, setWidth] = useState<string>('85%')
  const [marginLeft, setMarginLeft] = useState<string>('15%')
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])
  const [activeMenu, setActiveMenu] = useState('')

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
    const subMenu = menuItems?.find((item) => item?.key === location.pathname)
    if (subMenu) {
      setActiveMenu(subMenu?.key?.toString() as string)
    } else {
      setActiveMenu(location.pathname.substring(0, location.pathname.length - 2))
    }
  }, [location, menuItems])
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  React.useEffect(() => {
    setWidth(collapsed ? '100%' : '85%')
    setMarginLeft(collapsed ? '0' : '15%')
  }, [collapsed])

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
          <Notification />
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
