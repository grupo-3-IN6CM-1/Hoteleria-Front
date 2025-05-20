import { Table, Button, Space } from 'antd'
import { Link } from 'react-router-dom'

export default function HotelList({ hotels, remove }) {
  const cols = [
    { title: 'Nombre',     dataIndex: 'name',    key: 'name' },
    { title: 'Dirección',  dataIndex: 'address', key: 'address' },
    { title: 'Categoría',  dataIndex: 'category',key: 'category' },
    { title: 'Amenities',  dataIndex: 'amenities', key: 'amenities',
      render: arr => arr.join(', ')
    },
    {
      title: 'Acciones', key: 'actions',
      render: (_, r) => (
        <Space>
          <Link to={`/hotels/${r._id}`}>Editar</Link>
          <Button type="link" danger onClick={() => remove(r._id)}>
            Eliminar
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Table
      dataSource={hotels}
      columns={cols}
      rowKey="_id"
      loading={false}
    />
  )
}
