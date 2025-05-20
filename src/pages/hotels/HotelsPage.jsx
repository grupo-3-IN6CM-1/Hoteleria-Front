import { useState }     from 'react'
import { Button, Modal, Spin } from 'antd'
import { motion }       from 'framer-motion'
import useHotels        from '../../shared/hooks/useHotels'
import HotelList        from '../../components/hotels/HotelList'
import HotelForm        from '../../components/hotels/HotelForm'

export default function HotelsPage() {
  const { hotels, loading, create, update, remove } = useHotels()
  const [open, setOpen]      = useState(false)
  const [current, setCurrent]= useState(null)

  const showModal = hotel => {
    setCurrent(hotel || null)
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
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ padding: 24 }}>
      <Button
        type="primary"
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Nuevo Hotel
      </Button>

      {loading
        ? <Spin />
        : <HotelList hotels={hotels} remove={remove} />
      }

      <Modal
        title={current ? 'Editar Hotel' : 'Crear Hotel'}
        visible={open}
        onCancel={closeModal}
        footer={null}
      >
        <HotelForm hotel={current} onFinish={handleFinish} />
      </Modal>
    </motion.div>
  )
}
