import { useState }      from 'react'
import { Button, Modal, Spin } from 'antd'
import { motion }        from 'framer-motion'
import useReservations   from '../../shared/hooks/useReservations'
import useHotels         from '../../shared/hooks/useHotels'
import useRooms          from '../../shared/hooks/useRooms'
import ReservationList   from '../../components/reservations/ReservationList'
import ReservationForm   from '../../components/reservations/ReservationForm'

export default function ReservationsPage() {
  const { reservations, loading, create, updateStatus, remove } = useReservations()
  const { hotels, loading: lh }   = useHotels()
  const { rooms, loading: lr }    = useRooms()

  const [open, setOpen]       = useState(false)
  const [current, setCurrent] = useState(null)

  const showModal = r => {
    setCurrent(r || null)
    setOpen(true)
  }
  const closeModal = () => setOpen(false)

  const handleCreate = async vals => {
    await create(vals)
    closeModal()
  }

  const handleChangeStatus = r => showModal(r)

  const handleFormFinish = async vals => {
    if (current) {
      await updateStatus(current._id, vals.status)
    } else {
      await create(vals)
    }
    closeModal()
  }

  return (
    <motion.div initial={{ y:50 }} animate={{ y:0 }} style={{ padding:24 }}>
      <Button type="primary" onClick={()=>showModal(null)} style={{ marginBottom:16 }}>
        Nueva Reserva
      </Button>

      {loading
        ? <Spin />
        : <ReservationList
            reservations={reservations}
            remove={remove}
            onChangeStatus={handleChangeStatus}
          />
      }

      <Modal
        title={current ? 'Cambiar Estado / Editar Reserva' : 'Crear Reserva'}
        open={open}
        onCancel={closeModal}
        footer={null}
      >
        <ReservationForm
          hotels={hotels}
          rooms={rooms}
          loadingHotels={lh}
          loadingRooms={lr}
          initial={current}
          onFinish={handleFormFinish}
        />
      </Modal>
    </motion.div>
  )
}
