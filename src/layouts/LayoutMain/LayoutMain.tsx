import React, { useContext, useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, MenuProps, theme } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { routes } from './menu-item'
import { RouteInfo } from './sidebar.metadata'
import { AppstoreOutlined } from '@ant-design/icons'
import { AppContext, AppContextType } from '@/contexts/app.context'
const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const location = useLocation()
  const { profile } = useContext<AppContextType>(AppContext)
  const [width, setWidth] = useState<string>('85%')
  const [marginLeft, setMarginLeft] = useState<string>('15%')

  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])
  const [activeMenu, setActiveMenu] = useState('')

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

  return (
    <Layout className='w-full h-screen'>
      <Sider
        trigger={null}
        breakpoint='lg'
        onBreakpoint={(broken) => {
          setCollapsed(broken)
          setWidth(broken ? '100%' : '85%')
          setMarginLeft(broken ? '0' : '15%')
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
      >
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
