import { Table, Button, Space, Tag } from 'antd'

export default function ReservationList({ reservations, remove, onChangeStatus }) {
  const columns = [
    {
      title: 'Usuario',
      dataIndex: ['user','name'],
      key: 'user',
      render: (_, r) => `${r.user.name} (${r.user.email})`
    },
    {
      title: 'Hotel',
      dataIndex: ['hotel','name'],
      key: 'hotel'
    },
    {
      title: 'Habitación',
      dataIndex: ['room','number'],
      key: 'room'
    },
    {
      title: 'Check-in',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: d => new Date(d).toLocaleDateString()
    },
    {
      title: 'Check-out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: d => new Date(d).toLocaleDateString()
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: p => `$ ${p.toFixed(2)}`
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: s => {
        let color = s==='CONFIRMED' ? 'green'
          : s==='CANCELLED' ? 'red' : 'blue'
        return <Tag color={color}>{s}</Tag>
      }
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => onChangeStatus(r)}>
            Cambiar Estado
          </Button>
          <Button size="small" danger onClick={() => remove(r._id)}>
            Eliminar
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Table
      dataSource={reservations}
      columns={columns}
      rowKey="_id"
      loading={false}
    />
  )
}
