import { Form, Input, Select, Button } from 'antd'
const { TextArea } = Input

export default function HotelForm({ hotel, onFinish }) {
  const [form] = Form.useForm()
  if (hotel) form.setFieldsValue(hotel)

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="address" label="Dirección" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item name="category" label="Categoría">
        <Select>
          <Select.Option value="ECONOMICO">Económico</Select.Option>
          <Select.Option value="FAMILIAR">Familiar</Select.Option>
          <Select.Option value="NEGOCIOS">Negocios</Select.Option>
          <Select.Option value="RESORT">Resort</Select.Option>
          <Select.Option value="LUJO">Lujo</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="amenities" label="Amenities">
        <Select mode="multiple">
          {['WIFI','PISCINA','RESTAURANTE','GYM','SPA','ESTACIONAMIENTO','SERVICIO_HABITACION']
            .map(a => (<Select.Option key={a} value={a}>{a}</Select.Option>))
          }
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {hotel ? 'Actualizar' : 'Crear'} Hotel
        </Button>
      </Form.Item>
    </Form>
  )
}
