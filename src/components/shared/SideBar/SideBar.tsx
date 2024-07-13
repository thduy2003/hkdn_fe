import React, { useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, MenuProps, theme } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { getProfileFromLS } from '@/utils/storage'
import { routes } from './menu-item'
import { User } from '@/interface/user'
import { RouteInfo } from './sidebar.metadata'
import { AppstoreOutlined } from '@ant-design/icons'
const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const location = useLocation()

  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])
  const [activeMenu, setActiveMenu] = useState('')
  const currentUser: User = getProfileFromLS()

  React.useEffect(() => {
    if (currentUser) {
      const result: RouteInfo[] = []
      routes.forEach((route) => {
        if (route.allowedGroups?.indexOf(currentUser.role) !== -1) {
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
  }, [currentUser])
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
      <Layout>
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
