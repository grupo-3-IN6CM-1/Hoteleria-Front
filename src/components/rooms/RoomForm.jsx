import { Form, Select, Input, InputNumber, Button } from 'antd'
const { TextArea } = Input

export default function RoomForm({ hotels, loadingHotels, room, onFinish }) {
  const [form] = Form.useForm()

  if (room) {
    form.setFieldsValue({
      hotel: room.hotel._id,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      description: room.description
    })
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="hotel" label="Hotel" rules={[{ required: true }]}>
        <Select
          loading={loadingHotels}
          options={hotels.map(h => ({ label: h.name, value: h._id }))}
        />
      </Form.Item>

      <Form.Item name="number" label="Número de habitación" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="type" label="Tipo de habitación" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="SENCILLA">Sencilla</Select.Option>
          <Select.Option value="DOBLE">Doble</Select.Option>
          <Select.Option value="SUITE">Suite</Select.Option>
          <Select.Option value="FAMILIAR">Familiar</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="capacity" label="Capacidad" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="pricePerNight" label="Precio por noche" rules={[{ required: true }]}>
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="description" label="Descripción">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {room ? 'Actualizar' : 'Crear'} Habitación
        </Button>
      </Form.Item>
    </Form>
  )
}
