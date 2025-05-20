import { Table, Button, Space } from 'antd'

export default function RoomList({ rooms, remove, onEdit }) {
  const cols = [
    { title: 'Hotel',          dataIndex: ['hotel','name'], key: 'hotel' },
    { title: 'Número',         dataIndex: 'number',       key: 'number' },
    { title: 'Tipo',           dataIndex: 'type',         key: 'type' },
    { title: 'Capacidad',      dataIndex: 'capacity',     key: 'capacity' },
    {
      title: 'Precio/Noche',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      render: p => `$ ${p.toFixed(2)}`
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, r) => (
        <Space>
          <Button type="link" onClick={() => onEdit(r)}>Editar</Button>
          <Button type="link" danger onClick={() => remove(r._id)}>Eliminar</Button>
        </Space>
      )
    }
  ]

  return <Table dataSource={rooms} columns={cols} rowKey="_id" />
}
