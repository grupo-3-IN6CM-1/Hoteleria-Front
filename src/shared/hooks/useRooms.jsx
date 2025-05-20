import { useState, useEffect } from 'react'
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from '../../services/api'

export default function useRooms() {
  const [rooms, setRooms]     = useState([])
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await getRooms()
    setRooms(data.rooms)
    setLoading(false)
  }

  const create = async r => {
    const { data } = await createRoom(r)
    setRooms(prev => [data.room, ...prev])
  }

  const update = async (id, r) => {
    const { data } = await updateRoom(id, r)
    setRooms(prev =>
      prev.map(x => (x._id === id ? data.room : x))
    )
  }

  const remove = async id => {
    await deleteRoom(id)
    setRooms(prev => prev.filter(x => x._id !== id))
  }

  useEffect(() => { fetch() }, [])

  return { rooms, loading, fetch, create, update, remove }
}
