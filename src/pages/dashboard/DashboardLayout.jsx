import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const { Content } = Layout

export default function DashboardLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: 16, padding: 16, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
