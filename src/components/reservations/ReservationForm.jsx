import { Form, Select, DatePicker, Button, Spin } from 'antd'
const { RangePicker } = DatePicker

export default function ReservationForm({
  hotels,
  rooms,
  loadingHotels,
  loadingRooms,
  initial,
  onFinish
}) {
  const [form] = Form.useForm()
  if (initial) form.setFieldsValue({
    hotel:  initial.hotel._id,
    room:   initial.room._id,
    dates:  [initial.checkIn, initial.checkOut],
    status: initial.status
  })

  // Filtrar habitaciones según hotel seleccionado
  const hotelId = Form.useWatch('hotel', form)
  const availableRooms = rooms.filter(r => r.hotel._id === hotelId)

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={vals => {
        const [checkIn, checkOut] = vals.dates
        onFinish({
          hotel:     vals.hotel,
          room:      vals.room,
          checkIn:   checkIn.toISOString(),
          checkOut:  checkOut.toISOString(),
          ...(vals.status && { status: vals.status })
        })
      }}
    >
      <Form.Item name="hotel" label="Hotel" rules={[{ required: true }]}>
        {loadingHotels ? <Spin/> :
          <Select options={hotels.map(h=>({ label:h.name, value:h._id }))} />
        }
      </Form.Item>

      <Form.Item name="room" label="Habitación" rules={[{ required: true }]}>
        {loadingRooms ? <Spin/> :
          <Select options={availableRooms.map(r=>({
            label:`${r.number} (${r.type})`,
            value:r._id
          }))} />
        }
      </Form.Item>

      <Form.Item name="dates" label="Fechas" rules={[{ required: true }]}>
        <RangePicker />
      </Form.Item>

      {initial && (
        <Form.Item name="status" label="Estado">
          <Select options={[
            { label:'CONFIRMED', value:'CONFIRMED' },
            { label:'CANCELLED', value:'CANCELLED' },
            { label:'COMPLETED', value:'COMPLETED' }
          ]}/>
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {initial ? 'Actualizar Reserva' : 'Crear Reserva'}
        </Button>
      </Form.Item>
    </Form>
  )
}
