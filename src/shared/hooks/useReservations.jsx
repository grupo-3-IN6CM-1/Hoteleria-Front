import { useState, useEffect } from 'react'
import {
  getReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation
} from '../../services/api'

export default function useReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await getReservations()
    setReservations(data.reservations)
    setLoading(false)
  }

  const create = async r => {
    const { data } = await createReservation(r)
    setReservations(prev => [data.reservation, ...prev])
  }

  const updateStatus = async (id, status) => {
    const { data } = await updateReservationStatus(id, status)
    setReservations(prev =>
      prev.map(x => (x._id === id ? data.reservation : x))
    )
  }

  const remove = async id => {
    await deleteReservation(id)
    setReservations(prev => prev.filter(x => x._id !== id))
  }

  useEffect(() => { fetch() }, [])

  return { reservations, loading, fetch, create, updateStatus, remove }
}
