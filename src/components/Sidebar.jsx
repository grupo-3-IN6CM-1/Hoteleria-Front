import { Layout, Menu, Switch, Avatar } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
  AppstoreOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { useDarkMode } from '../shared/context/DarkModeContext'

const { Sider } = Layout

export default function Sidebar() {
  const { dark, toggle } = useDarkMode()
  const { pathname } = useLocation()
  const selectedKey = pathname.split('/')[2] || 'dashboard'

  const items = [
    { key: 'dashboard',       icon: <HomeOutlined />,       label: <Link to="/dashboard">Dashboard</Link> },
    { key: 'users',           icon: <UserOutlined />,       label: <Link to="/dashboard/users">Usuarios</Link> },
    { key: 'hotels',          icon: <ShopOutlined />,      label: <Link to="/dashboard/hotels">Hoteles</Link> },
    { key: 'rooms',           icon: <AppstoreOutlined />,   label: <Link to="/dashboard/rooms">Habitaciones</Link> },
    { key: 'reservations',    icon: <CalendarOutlined />,   label: <Link to="/dashboard/reservations">Reservaciones</Link> },
  ]

  return (
    <Sider
      theme={dark ? 'dark' : 'light'}
      width={240}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div style={{ height: 64, margin: 16, background: 'rgba(255,255,255,0.2)' }} />

      <Menu
        theme={dark ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
      />

      <div style={{ padding: 16 }}>
        <Switch
          checked={dark}
          onChange={toggle}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          style={{ width: '100%', marginBottom: 16 }}
        />
        <div style={{ textAlign: 'center' }}>
          <Avatar style={{ marginBottom: 8 }}>U</Avatar>
          <div style={{ color: dark ? '#fff' : '#000' }}>usuario@correo.com</div>
        </div>
      </div>
    </Sider>
  )
}
