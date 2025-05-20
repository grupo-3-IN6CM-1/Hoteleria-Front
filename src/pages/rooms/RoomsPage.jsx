import { useState } from 'react'
import { Button, Modal, Spin } from 'antd'
import { motion } from 'framer-motion'
import useRooms  from '../../shared/hooks/useRooms'
import useHotels from '../../shared/hooks/useHotels'
import RoomList  from '../../components/rooms/RoomList'
import RoomForm  from '../../components/rooms/RoomForm'

export default function RoomsPage() {
  const { rooms, loading: lr, create, update, remove } = useRooms()
  const { hotels, loading: lh }                    = useHotels()
  const [open, setOpen]       = useState(false)
  const [current, setCurrent] = useState(null)

  const showModal = room => {
    setCurrent(room || null)
    setOpen(true)
  }
  const closeModal = () => setOpen(false)

  const handleFinish = async vals => {
    current 
      ? await update(current._id, vals)
      : await create(vals)
    closeModal()
  }

  return (
    <motion.div initial={{ x: -50 }} animate={{ x: 0 }} style={{ padding: 24 }}>
      <Button type="primary" onClick={() => showModal(null)} style={{ marginBottom: 16 }}>
        Nueva Habitación
      </Button>

      {lr 
        ? <Spin /> 
        : <RoomList rooms={rooms} remove={remove} onEdit={showModal} />
      }

      <Modal
        title={current ? 'Editar Habitación' : 'Crear Habitación'}
        open={open}
        onCancel={closeModal}
        footer={null}
      >
        <RoomForm 
          hotels={hotels} 
          loadingHotels={lh} 
          room={current} 
          onFinish={handleFinish} 
        />
      </Modal>
    </motion.div>
  )
}
